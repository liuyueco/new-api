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
import { Link } from '@tanstack/react-router'
import { CherryStudio } from '@lobehub/icons'
import { ArrowRight, Layers3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

const MoreIcon = () => (
  <svg
    className='text-primary/70 group-hover:text-primary size-5 shrink-0 transition-colors'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle cx='6' cy='12' r='2' fill='currentColor' />
    <circle cx='12' cy='12' r='2' fill='currentColor' />
    <circle cx='18' cy='12' r='2' fill='currentColor' />
  </svg>
)

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-80 dark:opacity-45'
        style={{
          background: [
            'radial-gradient(ellipse 46% 42% at 16% 12%, oklch(0.7115 0.1596 61.71 / 24%) 0%, transparent 72%)',
            'radial-gradient(ellipse 42% 36% at 86% 24%, oklch(0.7115 0.1596 61.71 / 18%) 0%, transparent 70%)',
            'linear-gradient(135deg, transparent 0%, oklch(0.7115 0.1596 61.71 / 6%) 50%, transparent 100%)',
          ].join(', '),
        }}
      />
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--primary)_22%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--primary)_16%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_18%,black_10%,transparent_78%)] bg-[size:3.25rem_3.25rem] opacity-35 dark:opacity-20'
      />
      <div
        aria-hidden
        className='via-primary/35 absolute top-28 left-1/2 -z-10 h-px w-[min(72rem,calc(100vw-3rem))] -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent'
      />

      <div className='mx-auto flex max-w-5xl justify-center'>
        <div className='flex w-full flex-col items-center text-center'>
          <div
            className='landing-animate-fade-up border-primary/25 bg-primary/8 text-primary shadow-primary/10 mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase opacity-0 shadow-sm backdrop-blur-md'
            style={{ animationDelay: '0ms' }}
          >
            <span className='relative flex size-2'>
              <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-50' />
              <span className='bg-primary relative inline-flex size-2 rounded-full' />
            </span>
            <span>{t('AI Application Infrastructure Foundation')}</span>
          </div>

          <h1
            className='home-display-title landing-animate-fade-up max-w-4xl text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.96] opacity-0'
            style={{ animationDelay: '60ms' }}
          >
            {t('Unified API Gateway for')}
            <span className='text-primary relative mt-1 block'>
              {t('Vast Range of AI Models')}
            </span>
          </h1>

          <p
            className='landing-animate-fade-up text-muted-foreground mx-auto mt-6 max-w-3xl text-base leading-8 opacity-0 md:text-lg'
            style={{ animationDelay: '120ms' }}
          >
            {t(
              'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
            )}
          </p>

          <div
            className='landing-animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0'
            style={{ animationDelay: '180ms' }}
          >
            {props.isAuthenticated ? (
              <>
                <Button
                  className='group shadow-primary/20 text-primary-foreground h-12 rounded-full px-6 text-sm font-semibold shadow-lg'
                  render={<Link to='/dashboard' />}
                >
                  {t('Go to Dashboard')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
              </>
            ) : (
              <>
                <Button
                  className='group shadow-primary/20 text-primary-foreground h-12 rounded-full px-6 text-sm font-semibold shadow-lg'
                  render={<Link to='/sign-up' />}
                >
                  {t('Register and use now')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Button
                  variant='outline'
                  className='border-primary/20 bg-background/55 hover:border-primary/45 hover:bg-primary/8 h-12 rounded-full px-6 text-sm font-medium shadow-sm backdrop-blur-md'
                  render={<Link to='/pricing' />}
                >
                  {t('View affordable pricing')}
                </Button>
              </>
            )}
          </div>

          <div
            className='landing-animate-fade-up mt-5 flex flex-wrap justify-center gap-2 opacity-0'
            style={{ animationDelay: '210ms' }}
          >
            {[
              t('Register an account'),
              t('Recharge on demand'),
              t('Copy API config'),
            ].map((item) => (
              <span
                key={item}
                className='border-primary/15 bg-primary/6 text-foreground/75 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold'
              >
                {item}
              </span>
            ))}
          </div>

          <div
            className='landing-animate-fade-up border-border/50 bg-card/70 mt-10 w-full max-w-3xl rounded-3xl border p-4 text-left opacity-0 shadow-[0_16px_45px_-30px_rgba(0,0,0,0.45)] backdrop-blur-xl'
            style={{ animationDelay: '240ms' }}
          >
            <div className='mb-4 flex items-center gap-3 px-1'>
              <div className='bg-primary/10 text-primary flex size-9 items-center justify-center rounded-2xl'>
                <Layers3 className='size-4' strokeWidth={1.8} />
              </div>
              <div>
                <span className='text-foreground text-xs font-bold tracking-[0.15em] uppercase'>
                  {t('Supported Applications')}
                </span>
                <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
                  {t(
                    'Supports one-click configuration and perfectly adapts to NewAPI multi-protocol configuration.'
                  )}
                </p>
              </div>
            </div>
            <div className='grid gap-2 sm:grid-cols-3'>
              <a
                href='https://cherry-ai.com'
                target='_blank'
                rel='noopener noreferrer'
                className='group border-border/50 bg-background/70 hover:border-primary/35 hover:bg-primary/8 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5'
              >
                <CherryStudio.Color size={24} className='shrink-0' />
                <span>Cherry Studio</span>
              </a>
              <a
                href='https://ccswitch.io'
                target='_blank'
                rel='noopener noreferrer'
                className='group border-border/50 bg-background/70 hover:border-primary/35 hover:bg-primary/8 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5'
              >
                <img
                  src='https://ccswitch.io/favicon.png'
                  alt='CC Switch'
                  className='size-6 shrink-0 rounded-md object-contain'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <span
                  style={{ display: 'none' }}
                  className='bg-primary/10 text-primary size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold'
                >
                  CC
                </span>
                <span>CC Switch</span>
              </a>
              <div className='group border-border/50 bg-background/70 hover:border-primary/35 hover:bg-primary/8 flex cursor-default items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5'>
                <MoreIcon />
                <span>{t('More Apps')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
