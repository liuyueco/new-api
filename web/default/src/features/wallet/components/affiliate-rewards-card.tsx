/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatQuota } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CopyButton } from '@/components/copy-button'
import type { UserWalletData } from '../types'

interface AffiliateRewardsCardProps {
  user: UserWalletData | null
  affiliateLink: string
  onTransfer: () => void
  complianceConfirmed?: boolean
  loading?: boolean
  commissionEnabled?: boolean
  rateNormal?: number
  rateAdvanced?: number
  advancedSingleTopUp?: number
  advancedTotalSpend?: number
}

export function AffiliateRewardsCard({
  user,
  affiliateLink,
  onTransfer,
  complianceConfirmed = true,
  loading,
  commissionEnabled = true,
  rateNormal = 0.01,
  rateAdvanced = 0.1,
  advancedSingleTopUp = 10000,
  advancedTotalSpend = 30000,
}: AffiliateRewardsCardProps) {
  const { t } = useTranslation()
  if (loading) {
    return (
      <Card className='bg-muted/20 py-0'>
        <CardContent className='grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(220px,1fr)_minmax(220px,0.72fr)_minmax(320px,1.15fr)] lg:items-center'>
          <div>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='mt-2 h-4 w-48' />
          </div>
          <Skeleton className='h-14 rounded-lg' />
          <Skeleton className='h-10 rounded-lg' />
        </CardContent>
      </Card>
    )
  }

  const hasRewards = (user?.aff_quota ?? 0) > 0
  const isAdvanced = (user?.agent_level ?? 0) >= 1
  const currentRate = isAdvanced ? rateAdvanced : rateNormal
  const agentLabel = isAdvanced ? t('Advanced Agent') : t('Normal Agent')

  return (
    <Card className='bg-muted/20 py-0'>
      <CardContent className='grid gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-[minmax(200px,1fr)_minmax(180px,0.65fr)_minmax(280px,1fr)] lg:items-center'>
        <div className='flex min-w-0 items-center gap-2.5'>
          <div className='bg-background flex size-8 shrink-0 items-center justify-center rounded-lg border'>
            <Share2 className='text-muted-foreground size-4' />
          </div>
          <div className='min-w-0'>
            <h3 className='truncate text-sm font-semibold'>
              {t('Referral Program')}
            </h3>
            <p className='text-muted-foreground line-clamp-2 text-xs'>
              {commissionEnabled
                ? t(
                    'Earn {{rate}}% when your referrals complete an online top-up. Commission is credited to your wallet for usage only. You are currently a {{level}}.',
                    {
                      rate: (currentRate * 100).toFixed(
                        currentRate * 100 % 1 === 0 ? 0 : 2
                      ),
                      level: agentLabel,
                    }
                  )
                : t(
                    'Earn rewards when your referrals add funds. Transfer accumulated rewards to your balance anytime.'
                  )}
            </p>
            {commissionEnabled && !isAdvanced ? (
              <p className='text-muted-foreground mt-1 line-clamp-2 text-[11px]'>
                {t(
                  'Upgrade to advanced agent ({{advancedRate}}%) via a single top-up of {{single}} or cumulative spend of {{total}}.',
                  {
                    advancedRate: (rateAdvanced * 100).toFixed(
                      rateAdvanced * 100 % 1 === 0 ? 0 : 2
                    ),
                    single: advancedSingleTopUp,
                    total: advancedTotalSpend,
                  }
                )}
              </p>
            ) : null}
          </div>
        </div>

        <div className='grid grid-cols-3 gap-1.5 text-center'>
          {[
            [t('Pending'), formatQuota(user?.aff_quota ?? 0)],
            [t('Total Earned'), formatQuota(user?.aff_history_quota ?? 0)],
            [t('Invites'), String(user?.aff_count ?? 0)],
          ].map(([label, value]) => (
            <div key={label}>
              <div className='text-muted-foreground truncate text-[10px] font-medium tracking-wider uppercase'>
                {label}
              </div>
              <div className='mt-0.5 truncate text-sm font-semibold tabular-nums'>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-2'>
          <Input
            value={affiliateLink}
            readOnly
            className='border-muted bg-background/70 h-9 min-w-0 flex-1 font-mono text-xs'
          />
          <CopyButton
            value={affiliateLink}
            variant='outline'
            className='bg-background size-9 shrink-0'
            iconClassName='size-4'
            tooltip={t('Copy referral link')}
            aria-label={t('Copy referral link')}
          />
          {hasRewards && (
            <Button
              onClick={onTransfer}
              disabled={!complianceConfirmed}
              className='h-9 shrink-0 px-3'
              size='sm'
            >
              {t('Transfer to Balance')}
            </Button>
          )}
        </div>
        {!complianceConfirmed && hasRewards && (
          <p className='text-destructive col-span-full text-xs'>
            {t(
              'Reward transfers are disabled until an admin confirms the payment compliance statement.'
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
