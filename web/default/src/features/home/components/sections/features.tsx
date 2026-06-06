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
import {
  Zap,
  Shield,
  Globe,
  Code,
  Gauge,
  DollarSign,
  Users,
  HeartHandshake,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const features = [
    {
      id: 'fast',
      num: '01',
      title: t('Lightning Fast'),
      desc: t(
        'Optimized network architecture ensures millisecond response times'
      ),
      span: 'lg:col-span-7',
      icon: <Zap className='size-5' strokeWidth={1.8} />,
      visual: (
        <div className='mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3'>
          {['OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Qwen', 'Llama'].map(
            (name, index) => (
              <div
                key={name}
                className='border-primary/15 bg-primary/6 text-foreground/80 hover:border-primary/35 hover:bg-primary/12 flex items-center justify-between rounded-2xl border px-3 py-3 text-xs font-semibold transition-colors duration-300'
              >
                <span>{name}</span>
                <span className='text-primary/70 font-mono text-[10px]'>
                  0{index + 1}
                </span>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      id: 'secure',
      num: '02',
      title: t('Secure & Reliable'),
      desc: t(
        'Enterprise-grade security with comprehensive permission management'
      ),
      span: 'lg:col-span-5',
      icon: <Shield className='size-5' strokeWidth={1.8} />,
      visual: (
        <div className='mt-7 flex items-center gap-4'>
          <div className='border-primary/25 bg-primary/10 text-primary relative flex size-20 items-center justify-center rounded-[1.7rem] border'>
            <Shield className='size-8' strokeWidth={1.5} />
            <div className='bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full text-xs font-black'>
              ✓
            </div>
          </div>
          <div className='space-y-2 text-xs'>
            {[t('Load Balancing'), t('Rate Limiting'), t('Cost Tracking')].map(
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
      id: 'global',
      num: '03',
      title: t('Global Coverage'),
      desc: t('Multi-region deployment for stable global access'),
      span: 'lg:col-span-5',
      icon: <Globe className='size-5' strokeWidth={1.8} />,
      visual: (
        <div className='border-primary/25 bg-primary/5 mt-7 rounded-3xl border border-dashed p-4'>
          <div className='relative h-28 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_58%)]'>
            <div className='border-primary/35 absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border' />
            <div className='border-primary/25 absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border' />
            <span className='bg-primary absolute top-7 left-12 size-2.5 rounded-full shadow-[0_0_22px_color-mix(in_oklch,var(--primary)_80%,transparent)]' />
            <span className='bg-primary absolute right-14 bottom-8 size-2.5 rounded-full shadow-[0_0_22px_color-mix(in_oklch,var(--primary)_80%,transparent)]' />
            <span className='bg-primary absolute top-12 right-24 size-2 rounded-full opacity-70' />
          </div>
        </div>
      ),
    },
    {
      id: 'developer',
      num: '04',
      title: t('Developer Friendly'),
      desc: t('Compatible API routes for common AI application workflows'),
      span: 'lg:col-span-7',
      icon: <Code className='size-5' strokeWidth={1.8} />,
      visual: (
        <div className='mt-7 flex flex-wrap items-center gap-3'>
          {['API', 'SDK', 'CLI', 'Docs'].map((n) => (
            <div
              key={n}
              className='border-primary/20 bg-background/75 text-primary flex h-12 min-w-16 items-center justify-center rounded-2xl border px-4 text-xs font-black tracking-[0.12em] shadow-sm'
            >
              {n}
            </div>
          ))}
          <div className='text-muted-foreground bg-muted/40 rounded-full px-4 py-2 text-xs font-medium'>
            {t('Multi-protocol Compatible')}
          </div>
        </div>
      ),
    },
  ]

  const additionalFeatures = [
    {
      icon: <Gauge className='size-5' strokeWidth={1.5} />,
      title: t('High Performance'),
      desc: t('Support for high concurrency with automatic load balancing'),
    },
    {
      icon: <DollarSign className='size-5' strokeWidth={1.5} />,
      title: t('Transparent Billing'),
      desc: t('Pay-as-you-go with real-time usage monitoring'),
    },
    {
      icon: <Users className='size-5' strokeWidth={1.5} />,
      title: t('Team Collaboration'),
      desc: t('Multi-user management with flexible permission allocation'),
    },
    {
      icon: <HeartHandshake className='size-5' strokeWidth={1.5} />,
      title: t('AI API Relay Service'),
      desc: t(
        'Relay requests to multiple model APIs through one service, ideal for chatbots, AI tools and business systems'
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
            <h2 className='max-w-xl text-3xl leading-[1.05] font-black tracking-[-0.04em] md:text-5xl'>
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

        <div className='mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {additionalFeatures.map((f, i) => (
            <AnimateInView
              key={f.title}
              delay={i * 80}
              animation='fade-up'
              className='border-border/50 bg-background/55 hover:border-primary/30 hover:bg-primary/5 rounded-3xl border p-5 transition-colors duration-300'
            >
              <div className='text-primary bg-primary/10 mb-4 flex size-11 items-center justify-center rounded-2xl'>
                {f.icon}
              </div>
              <h3 className='mb-2 text-sm font-bold'>{f.title}</h3>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                {f.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
