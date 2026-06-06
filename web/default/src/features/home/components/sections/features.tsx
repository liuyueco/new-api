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
import { Code, DollarSign, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const features = [
    {
      id: 'recharge',
      num: '01',
      title: t('Lightning Fast'),
      desc: t(
        'Optimized network architecture ensures millisecond response times'
      ),
      span: 'lg:col-span-4',
      icon: <Zap className='size-5' strokeWidth={1.8} />,
      visual: (
        <div className='mt-7 grid grid-cols-2 gap-2'>
          {[
            t('Register an account'),
            t('Recharge on demand'),
            t('Create API key'),
            t('Start calling'),
          ].map((name, index) => (
            <div
              key={name}
              className='border-primary/15 bg-primary/6 text-foreground/80 hover:border-primary/35 hover:bg-primary/12 flex items-center justify-between rounded-2xl border px-3 py-3 text-xs font-semibold transition-colors duration-300'
            >
              <span>{name}</span>
              <span className='text-primary/70 font-mono text-[10px]'>
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'price',
      num: '02',
      title: t('Secure & Reliable'),
      desc: t(
        'Enterprise-grade security with comprehensive permission management'
      ),
      span: 'lg:col-span-4',
      icon: <DollarSign className='size-5' strokeWidth={1.8} />,
      visual: (
        <div className='mt-7 flex items-center gap-4'>
          <div className='border-primary/25 bg-primary/10 text-primary relative flex size-20 items-center justify-center rounded-[1.7rem] border'>
            <DollarSign className='size-8' strokeWidth={1.5} />
            <div className='bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full text-xs font-black'>
              ✓
            </div>
          </div>
          <div className='space-y-2 text-xs'>
            {[t('Recharge on demand'), t('Transparent Billing'), t('Cost Tracking')].map(
              (item) => (
                <div
                  key={item}
                  className='text-muted-foreground flex items-center gap-2'
                >
                  <span className='bg-primary size-1.5 rounded-full' />
                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'config',
      num: '03',
      title: t('Developer Friendly'),
      desc: t('Compatible API routes for common AI application workflows'),
      span: 'lg:col-span-4',
      icon: <Code className='size-5' strokeWidth={1.8} />,
      visual: (
        <div className='mt-7 flex flex-wrap items-center gap-3'>
          {[
            t('Copy Base URL'),
            t('Paste API key'),
            t('Choose model'),
            t('Use now'),
          ].map((n) => (
            <div
              key={n}
              className='border-primary/20 bg-background/75 text-primary flex h-12 min-w-24 items-center justify-center rounded-2xl border px-4 text-xs font-black tracking-[0.08em] shadow-sm'
            >
              {n}
            </div>
          ))}
        </div>
      ),
    },
  ]


  return (
    <section className='relative z-10 overflow-hidden px-6 py-24 md:py-32'>
      <div
        aria-hidden
        className='via-primary/30 absolute inset-x-0 top-0 -z-10 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent to-transparent'
      />
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-14 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end'>
          <div>
            <p className='text-primary mb-3 text-xs font-black tracking-[0.22em] uppercase'>
              {t('Core Features')}
            </p>
            <h2 className='home-display-title max-w-xl text-3xl leading-[1.05] md:text-5xl'>
              {t('Built for developers,')}
              <br />
              <span className='text-primary'>{t('designed for scale')}</span>
            </h2>
          </div>
          <p className='text-muted-foreground max-w-xl text-sm leading-7 md:justify-self-end md:text-base'>
            {t(
              'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
            )}
          </p>
        </AnimateInView>

        <div className='grid gap-4 lg:grid-cols-12'>
          {features.map((f, i) => (
            <AnimateInView
              key={f.id}
              delay={i * 100}
              animation='scale-in'
              className={`group border-border/60 bg-card/70 hover:border-primary/35 hover:bg-primary/5 relative overflow-hidden rounded-[2rem] border p-7 shadow-[0_22px_70px_-55px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 md:p-8 ${f.span}`}
            >
              <div className='bg-primary/12 absolute -top-20 -right-20 size-48 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-80' />
              <div className='relative'>
                <div className='mb-6 flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <span className='border-primary/25 bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl border'>
                      {f.icon}
                    </span>
                    <h3 className='text-lg font-black tracking-[-0.02em]'>
                      {f.title}
                    </h3>
                  </div>
                  <span className='text-primary/45 font-mono text-sm font-bold'>
                    {f.num}
                  </span>
                </div>
                <p className='text-muted-foreground max-w-md text-sm leading-7'>
                  {f.desc}
                </p>
                {f.visual}
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
