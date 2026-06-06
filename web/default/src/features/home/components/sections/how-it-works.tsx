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
import { Settings, Zap, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      num: '01',
      title: t('Configure'),
      desc: t(
        'Add your API keys, set up channels and configure access permissions'
      ),
      icon: <Settings className='size-6' strokeWidth={1.5} />,
    },
    {
      num: '02',
      title: t('Connect'),
      desc: t(
        'Connect through OpenAI, Claude, Gemini, and other compatible API routes'
      ),
      icon: <Zap className='size-6' strokeWidth={1.5} />,
    },
    {
      num: '03',
      title: t('Monitor'),
      desc: t('Track usage, costs and performance with real-time analytics'),
      icon: <BarChart3 className='size-6' strokeWidth={1.5} />,
    },
  ]

  return (
    <section className='relative z-10 px-6 py-24 md:py-32'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-16 text-center md:mb-20'>
          <p className='text-primary mb-3 text-xs font-black tracking-[0.22em] uppercase'>
            {t('How It Works')}
          </p>
          <h2 className='home-display-title text-3xl leading-[1.08] md:text-5xl'>
            {t('Three steps to get started')}
          </h2>
        </AnimateInView>

        <div className='relative grid gap-5 md:grid-cols-3'>
          <div
            aria-hidden
            className='bg-primary/20 absolute top-14 right-[16%] left-[16%] hidden h-px md:block'
          />
          {steps.map((step, i) => (
            <AnimateInView
              key={step.num}
              delay={i * 150}
              animation='fade-up'
              className='border-border/60 bg-card/70 relative rounded-[2rem] border p-6 shadow-[0_22px_70px_-58px_rgba(0,0,0,0.65)] backdrop-blur-xl md:p-7'
            >
              <div className='mb-8 flex items-center justify-between'>
                <div className='border-primary/25 bg-primary/10 text-primary flex size-16 items-center justify-center rounded-[1.4rem] border'>
                  {step.icon}
                </div>
                <span className='text-primary/55 font-mono text-sm font-black tracking-[0.18em]'>
                  {step.num}
                </span>
              </div>
              <h3 className='mb-3 text-xl font-black tracking-[-0.03em]'>
                {step.title}
              </h3>
              <p className='text-muted-foreground text-sm leading-7'>
                {step.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
