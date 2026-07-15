package model

import (
	"fmt"
	"math"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"
	"github.com/bytedance/gopkg/util/gopool"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// AffCommissionRecord ensures each top-up trade_no grants commission at most once.
type AffCommissionRecord struct {
	Id          int     `json:"id"`
	TradeNo     string  `json:"trade_no" gorm:"type:varchar(255);uniqueIndex;not null"`
	PayerUserId int     `json:"payer_user_id" gorm:"index;not null"`
	InviterId   int     `json:"inviter_id" gorm:"index;not null"`
	AgentLevel  int     `json:"agent_level" gorm:"type:int;default:0"`
	Rate        float64 `json:"rate" gorm:"type:decimal(10,6);default:0"`
	// decimal(20,6): integer part must fit large CNY/USD top-ups (decimal(10,6) max is 9999.999999).
	Money       float64 `json:"money" gorm:"type:decimal(20,6);default:0"`
	Commission  int64   `json:"commission" gorm:"type:bigint;default:0"` // quota units
	CreatedAt   int64   `json:"created_at" gorm:"bigint"`
}

func (AffCommissionRecord) TableName() string {
	return "aff_commission_records"
}

func GetAffCommissionRate(agentLevel int) float64 {
	if agentLevel >= common.AgentLevelAdvanced {
		return common.AffCommissionRateAdvanced
	}
	return common.AffCommissionRateNormal
}

// GrantAffCommissionOnTopUp credits the payer's inviter with commission based on paid money.
// Idempotent on tradeNo. Does nothing when commission is disabled or there is no inviter.
func GrantAffCommissionOnTopUp(payerUserId int, money float64, tradeNo string) {
	if !common.AffCommissionEnabled || money <= 0 || tradeNo == "" || payerUserId <= 0 {
		return
	}

	payer := &User{}
	if err := DB.Select("id", "inviter_id", "status").First(payer, payerUserId).Error; err != nil {
		common.SysLog(fmt.Sprintf("aff commission: load payer %d failed: %v", payerUserId, err))
		return
	}
	if payer.InviterId <= 0 {
		return
	}

	inviter := &User{}
	if err := DB.Select("id", "agent_level", "status").First(inviter, payer.InviterId).Error; err != nil {
		common.SysLog(fmt.Sprintf("aff commission: load inviter %d failed: %v", payer.InviterId, err))
		return
	}
	if inviter.Status != common.UserStatusEnabled {
		return
	}

	rate := GetAffCommissionRate(inviter.AgentLevel)
	if rate <= 0 {
		return
	}

	commission := int64(math.Round(decimal.NewFromFloat(money).Mul(decimal.NewFromFloat(rate)).Mul(decimal.NewFromFloat(common.QuotaPerUnit)).InexactFloat64()))
	if commission < 1 {
		common.SysLog(fmt.Sprintf("aff commission: skip tiny amount trade_no=%s money=%.4f rate=%.4f", tradeNo, money, rate))
		return
	}

	err := DB.Transaction(func(tx *gorm.DB) error {
		record := &AffCommissionRecord{
			TradeNo:     tradeNo,
			PayerUserId: payerUserId,
			InviterId:   inviter.Id,
			AgentLevel:  inviter.AgentLevel,
			Rate:        rate,
			Money:       money,
			Commission:  commission,
			CreatedAt:   common.GetTimestamp(),
		}
		if err := tx.Create(record).Error; err != nil {
			return err
		}

		result := tx.Model(&User{}).Where("id = ?", inviter.Id).Updates(map[string]interface{}{
			// Commission goes directly into usable wallet quota (API spend only; not cash withdrawal).
			"quota":       gorm.Expr("quota + ?", commission),
			"aff_history": gorm.Expr("aff_history + ?", commission),
		})
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return fmt.Errorf("inviter %d not updated", inviter.Id)
		}
		return nil
	})
	if err != nil {
		if isDuplicateKeyError(err) {
			return
		}
		common.SysLog(fmt.Sprintf("aff commission failed trade_no=%s: %v", tradeNo, err))
		return
	}

	gopool.Go(func() {
		if cacheErr := cacheIncrUserQuota(inviter.Id, int64(commission)); cacheErr != nil {
			common.SysLog("failed to increase inviter quota cache after commission: " + cacheErr.Error())
		}
	})

	RecordLog(inviter.Id, LogTypeSystem, fmt.Sprintf(
		"下级在线充值抽佣到账 %s（订单 %s，实付 %.2f，比例 %.2f%%，等级 %s），已计入钱包额度，仅可用于本站消耗",
		logger.LogQuota(int(commission)),
		tradeNo,
		money,
		rate*100,
		agentLevelLabel(inviter.AgentLevel),
	))
}

func agentLevelLabel(level int) string {
	if level >= common.AgentLevelAdvanced {
		return "高级代理"
	}
	return "普通代理"
}

func isDuplicateKeyError(err error) bool {
	if err == nil {
		return false
	}
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "duplicate") ||
		strings.Contains(msg, "unique constraint") ||
		strings.Contains(msg, "unique_violation")
}

// TryPromoteAgentByTopUp upgrades the user to advanced if a single top-up meets the threshold.
func TryPromoteAgentByTopUp(userId int, money float64) {
	if userId <= 0 || money <= 0 {
		return
	}
	if money < common.AffAdvancedSingleTopUp {
		return
	}
	promoteAgentToAdvanced(userId, fmt.Sprintf("单笔在线充值 %.2f 达到门槛 %.2f", money, common.AffAdvancedSingleTopUp))
}

// TryPromoteAgentBySpend upgrades the user to advanced if cumulative used_quota meets the spend threshold.
func TryPromoteAgentBySpend(userId int) {
	if userId <= 0 || common.AffAdvancedTotalSpend <= 0 || common.QuotaPerUnit <= 0 {
		return
	}
	thresholdQuota := int(math.Round(common.AffAdvancedTotalSpend * common.QuotaPerUnit))
	if thresholdQuota <= 0 {
		return
	}
	usedQuota, err := GetUserUsedQuota(userId)
	if err != nil {
		common.SysLog(fmt.Sprintf("aff promote by spend: load used_quota user=%d failed: %v", userId, err))
		return
	}
	if usedQuota < thresholdQuota {
		return
	}
	promoteAgentToAdvanced(userId, fmt.Sprintf("累计消费达到门槛 %.2f（额度 %d）", common.AffAdvancedTotalSpend, usedQuota))
}

func promoteAgentToAdvanced(userId int, reason string) {
	result := DB.Model(&User{}).
		Where("id = ? AND agent_level < ?", userId, common.AgentLevelAdvanced).
		Update("agent_level", common.AgentLevelAdvanced)
	if result.Error != nil {
		common.SysLog(fmt.Sprintf("aff promote failed user=%d: %v", userId, result.Error))
		return
	}
	if result.RowsAffected == 0 {
		return
	}
	RecordLog(userId, LogTypeSystem, fmt.Sprintf("升为高级代理：%s", reason))
}

// HandleTopUpSideEffects runs after a successful online top-up:
// grant payer top-up bonus at the pre-promotion agent level,
// grant invitee commission to inviter, then try to promote the payer.
// Promotion happens after bonus so the first qualifying 10k top-up still gets the normal (1%) rate.
func HandleTopUpSideEffects(payerUserId int, money float64, tradeNo string) {
	if payerUserId <= 0 {
		return
	}
	GrantTopUpBonusOnTopUp(payerUserId, money, tradeNo)
	GrantAffCommissionOnTopUp(payerUserId, money, tradeNo)
	TryPromoteAgentByTopUp(payerUserId, money)
}
