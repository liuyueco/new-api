package model

import (
	"fmt"
	"math"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"
	"github.com/bytedance/gopkg/util/gopool"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// TopUpBonusRecord ensures each top-up trade_no grants payer bonus at most once.
type TopUpBonusRecord struct {
	Id         int     `json:"id"`
	TradeNo    string  `json:"trade_no" gorm:"type:varchar(255);uniqueIndex;not null"`
	UserId     int     `json:"user_id" gorm:"index;not null"`
	AgentLevel int     `json:"agent_level" gorm:"type:int;default:0"`
	Rate       float64 `json:"rate" gorm:"type:decimal(10,6);default:0"`
	Money      float64 `json:"money" gorm:"type:decimal(20,6);default:0"`
	Bonus      int64   `json:"bonus" gorm:"type:bigint;default:0"` // quota units
	CreatedAt  int64   `json:"created_at" gorm:"bigint"`
}

func (TopUpBonusRecord) TableName() string {
	return "topup_bonus_records"
}

func GetTopUpBonusRate(agentLevel int) float64 {
	if agentLevel >= common.AgentLevelAdvanced {
		return common.TopUpBonusRateAdvanced
	}
	return common.TopUpBonusRateNormal
}

// GrantTopUpBonusOnTopUp credits the payer with a percentage bonus of paid money as usable quota.
// Idempotent on tradeNo. Disabled when TopUpBonusEnabled is false.
func GrantTopUpBonusOnTopUp(payerUserId int, money float64, tradeNo string) {
	if !common.TopUpBonusEnabled || money <= 0 || tradeNo == "" || payerUserId <= 0 {
		return
	}

	payer := &User{}
	if err := DB.Select("id", "agent_level", "status").First(payer, payerUserId).Error; err != nil {
		common.SysLog(fmt.Sprintf("topup bonus: load payer %d failed: %v", payerUserId, err))
		return
	}
	if payer.Status != common.UserStatusEnabled {
		return
	}

	rate := GetTopUpBonusRate(payer.AgentLevel)
	if rate <= 0 {
		return
	}

	bonus := int64(math.Round(decimal.NewFromFloat(money).Mul(decimal.NewFromFloat(rate)).Mul(decimal.NewFromFloat(common.QuotaPerUnit)).InexactFloat64()))
	if bonus < 1 {
		common.SysLog(fmt.Sprintf("topup bonus: skip tiny amount trade_no=%s money=%.4f rate=%.4f", tradeNo, money, rate))
		return
	}

	err := DB.Transaction(func(tx *gorm.DB) error {
		record := &TopUpBonusRecord{
			TradeNo:    tradeNo,
			UserId:     payerUserId,
			AgentLevel: payer.AgentLevel,
			Rate:       rate,
			Money:      money,
			Bonus:      bonus,
			CreatedAt:  common.GetTimestamp(),
		}
		if err := tx.Create(record).Error; err != nil {
			return err
		}

		result := tx.Model(&User{}).Where("id = ?", payerUserId).Updates(map[string]interface{}{
			"quota": gorm.Expr("quota + ?", bonus),
		})
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return fmt.Errorf("payer %d not updated", payerUserId)
		}
		return nil
	})
	if err != nil {
		if isDuplicateKeyError(err) {
			return
		}
		common.SysLog(fmt.Sprintf("topup bonus failed trade_no=%s: %v", tradeNo, err))
		return
	}

	gopool.Go(func() {
		if cacheErr := cacheIncrUserQuota(payerUserId, bonus); cacheErr != nil {
			common.SysLog("failed to increase payer quota cache after topup bonus: " + cacheErr.Error())
		}
	})

	RecordLog(payerUserId, LogTypeSystem, fmt.Sprintf(
		"在线充值赠送到账 %s（订单 %s，实付 %.2f，赠送比例 %.2f%%，等级 %s）",
		logger.LogQuota(int(bonus)),
		tradeNo,
		money,
		rate*100,
		agentLevelLabel(payer.AgentLevel),
	))
}
