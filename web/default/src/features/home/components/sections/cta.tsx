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
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AnimateInView } from '@/components/animate-in-view'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='relative z-10 overflow-hidden px-6 py-20 md:py-28'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView
          className='border-primary/20 bg-card/80 relative overflow-hidden rounded-[2.25rem] border p-8 text-center shadow-[0_28px_90px_-65px_rgba(0,0,0,0.7)] backdrop-blur-xl md:p-14'
          animation='scale-in'
        >
          <div
            aria-hidden
            className='bg-primary/20 absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl'
          />
          <div
            aria-hidden
            className='absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--primary)_16%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--primary)_12%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black_0%,transparent_76%)] bg-[size:2.5rem_2.5rem] opacity-45'
          />
          <div className='relative'>
            <h2 className='home-display-title text-3xl leading-[1.05] md:text-6xl'>
              {t('Ready to simplify')}
              <br />
              <span className='text-primary'>{t('your AI integration?')}</span>
            </h2>
            <p className='text-muted-foreground mx-auto mt-6 max-w-xl text-sm leading-7 md:text-base'>
              {t(
                'Deploy your own gateway and start routing requests through your configured upstream services.'
              )}
            </p>
            <div className='mt-9 flex flex-wrap items-center justify-center gap-3'>
              <Button
                className='group shadow-primary/20 text-primary-foreground h-12 rounded-full px-6 text-sm font-semibold shadow-lg'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='border-primary/20 bg-background/55 hover:border-primary/45 hover:bg-primary/8 h-12 rounded-full px-6 text-sm font-medium shadow-sm backdrop-blur-md'
                render={<Link to='/pricing' />}
              >
                {t('View Pricing')}
              </Button>
            </div>
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
