/*
Copyright (C) 2025 QuantumNous

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

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { API, getLogo, getSystemName, showError } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { IconArrowRight, IconFile, IconGithubLogo } from '@douyinfe/semi-icons';
import {
  BarChart3,
  Code,
  DollarSign,
  Settings,
  Shield,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import FooterBar from '../../components/layout/Footer';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const systemName = getSystemName();
  const logo = getLogo();

  const isAuthenticated = Boolean(localStorage.getItem('user'));

  const stats = [
    {
      value: '50+',
      label: t('upstream services integrated'),
    },
    {
      value: '100+',
      label: t('model billing support'),
    },
    {
      value: '50+',
      label: t('compatible API routes'),
    },
    {
      value: '10+',
      label: t('scheduling controls'),
    },
  ];

  const featureCards = [
    {
      number: '01',
      title: t('Lightning Fast'),
      description: t(
        'Optimized network architecture ensures millisecond response times',
      ),
      icon: <Zap size={20} strokeWidth={1.8} />,
      visual: [
        t('Register an account'),
        t('Recharge on demand'),
        t('Create API key'),
        t('Start calling'),
      ],
    },
    {
      number: '02',
      title: t('Secure & Reliable'),
      description: t(
        'Enterprise-grade security with comprehensive permission management',
      ),
      icon: <Shield size={20} strokeWidth={1.8} />,
      visual: [
        t('Recharge on demand'),
        t('Transparent Billing'),
        t('Cost Tracking'),
      ],
    },
    {
      number: '03',
      title: t('Developer Friendly'),
      description: t(
        'Compatible API routes for common AI application workflows',
      ),
      icon: <Code size={20} strokeWidth={1.8} />,
      visual: [
        t('Copy Base URL'),
        t('Paste API key'),
        t('Choose model'),
        t('Use now'),
      ],
    },
  ];

  const steps = [
    {
      number: '01',
      title: t('Configure'),
      description: t(
        'Add your API keys, set up channels and configure access permissions',
      ),
      icon: <Settings size={24} strokeWidth={1.6} />,
    },
    {
      number: '02',
      title: t('Connect'),
      description: t(
        'Connect through OpenAI, Claude, Gemini, and other compatible API routes',
      ),
      icon: <Zap size={24} strokeWidth={1.6} />,
    },
    {
      number: '03',
      title: t('Monitor'),
      description: t(
        'Track usage, costs and performance with real-time analytics',
      ),
      icon: <BarChart3 size={24} strokeWidth={1.6} />,
    },
  ];

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent(t('加载首页内容失败...'));
    }
    setHomePageContentLoaded(true);
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  return (
    <div className='classic-page-fill classic-home-page w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='classic-home-v2'>
          <div className='classic-home-v2-noise' />
          <div className='classic-home-v2-glow classic-home-v2-glow-left' />
          <div className='classic-home-v2-glow classic-home-v2-glow-right' />

          <div className='classic-home-v2-container'>
            <header className='classic-home-v2-nav-wrap'>
              <div className='classic-home-v2-nav'>
                <Link to='/' className='classic-home-v2-brand'>
                  <img
                    src={logo}
                    alt={systemName}
                    className='classic-home-v2-logo'
                  />
                  <span>{systemName}</span>
                </Link>

                <nav className='classic-home-v2-links'>
                  {docsLink && (
                    <a href={docsLink} target='_blank' rel='noreferrer'>
                      {t('文档')}
                    </a>
                  )}
                  <a href='#features'>{t('Core Features')}</a>
                  <a href='#workflow'>{t('How It Works')}</a>
                  <a href='#contact'>{t('Get Started')}</a>
                </nav>

                <div className='classic-home-v2-nav-action'>
                  <Link to={isAuthenticated ? '/console' : '/login'}>
                    <Button
                      theme='solid'
                      type='primary'
                      className='classic-home-v2-login-btn'
                    >
                      {isAuthenticated ? t('Go to Dashboard') : t('登录')}
                    </Button>
                  </Link>
                </div>
              </div>
            </header>

            <section className='classic-home-v2-hero'>
              <div className='classic-home-v2-hero-copy'>
                <span className='classic-home-v2-pill'>
                  <span className='classic-home-v2-pill-dot' />
                  {t('AI Application Infrastructure Foundation')}
                </span>
                <h1>
                  <span>{t('Unified API Gateway for')}</span>
                  <span className='classic-home-v2-gradient-text'>
                    {t('Vast Range of AI Models')}
                  </span>
                </h1>
                <p>
                  {t(
                    'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.',
                  )}
                </p>

                <div className='classic-home-v2-actions'>
                  <Link to={isAuthenticated ? '/console' : '/register'}>
                    <Button
                      theme='solid'
                      type='primary'
                      size='large'
                      icon={<IconArrowRight />}
                      className='classic-home-v2-primary-btn'
                    >
                      {isAuthenticated
                        ? t('Go to Dashboard')
                        : t('Register and use now')}
                    </Button>
                  </Link>
                  {!isAuthenticated && (
                    <Link to='/pricing'>
                      <Button
                        size='large'
                        className='classic-home-v2-secondary-btn'
                      >
                        {t('View affordable pricing')}
                      </Button>
                    </Link>
                  )}
                </div>

                <div className='classic-home-v2-quick-tags'>
                  {[
                    t('Register an account'),
                    t('Recharge on demand'),
                    t('Copy API config'),
                  ].map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </section>

            <section className='classic-home-v2-hero-metrics'>
              <div className='classic-home-v2-metrics'>
                {stats.map((item) => (
                  <div key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className='classic-home-v2-section' id='features'>
              <div className='classic-home-v2-section-head classic-home-v2-section-head-split'>
                <div>
                  <span className='classic-home-v2-section-badge'>
                    {t('Core Features')}
                  </span>
                  <h2>
                    {t('Built for developers,')}
                    <span>{t('designed for scale')}</span>
                  </h2>
                </div>
                <p>
                  {t(
                    'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.',
                  )}
                </p>
              </div>

              <div className='classic-home-v2-feature-grid'>
                {featureCards.map((item) => (
                  <article
                    className='classic-home-v2-feature-card'
                    key={item.number}
                  >
                    <div className='classic-home-v2-feature-head'>
                      <span className='classic-home-v2-feature-icon'>
                        {item.icon}
                      </span>
                      <span className='classic-home-v2-feature-number'>
                        {item.number}
                      </span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className='classic-home-v2-feature-visual'>
                      {item.number === '02' && (
                        <span className='classic-home-v2-price-icon'>
                          <DollarSign size={30} strokeWidth={1.5} />
                        </span>
                      )}
                      <div>
                        {item.visual.map((label, index) => (
                          <span key={label}>
                            {label}
                            {item.number === '01' && <em>0{index + 1}</em>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className='classic-home-v2-section' id='workflow'>
              <div className='classic-home-v2-section-head classic-home-v2-section-head-center'>
                <span className='classic-home-v2-section-badge'>
                  {t('How It Works')}
                </span>
                <h2>{t('Three steps to get started')}</h2>
              </div>

              <div className='classic-home-v2-step-grid'>
                {steps.map((step) => (
                  <article
                    className='classic-home-v2-step-card'
                    key={step.number}
                  >
                    <div className='classic-home-v2-step-head'>
                      <span className='classic-home-v2-step-icon'>
                        {step.icon}
                      </span>
                      <span>{step.number}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
            </section>

            {!isAuthenticated && (
              <section className='classic-home-v2-contact' id='contact'>
                <div className='classic-home-v2-contact-copy'>
                  <span className='classic-home-v2-section-badge'>
                    {t('Get Started')}
                  </span>
                  <h2>
                    {t('Ready to simplify')}
                    <span>{t('your AI integration?')}</span>
                  </h2>
                  <p>
                    {t(
                      'Deploy your own gateway and start routing requests through your configured upstream services.',
                    )}
                  </p>
                </div>

                <div className='classic-home-v2-contact-actions'>
                  <Link to='/register'>
                    <Button
                      theme='solid'
                      type='primary'
                      size='large'
                      icon={<IconArrowRight />}
                    >
                      {t('Get Started')}
                    </Button>
                  </Link>
                  <Link to='/pricing'>
                    <Button size='large'>{t('View Pricing')}</Button>
                  </Link>
                  {docsLink && (
                    <Button
                      size='large'
                      icon={<IconFile />}
                      onClick={() => window.open(docsLink, '_blank')}
                    >
                      {t('文档')}
                    </Button>
                  )}
                  {!docsLink &&
                    isDemoSiteMode &&
                    statusState?.status?.version && (
                      <Button
                        size='large'
                        icon={<IconGithubLogo />}
                        onClick={() =>
                          window.open(
                            'https://github.com/QuantumNous/new-api',
                            '_blank',
                          )
                        }
                      >
                        {statusState.status.version}
                      </Button>
                    )}
                </div>
              </section>
            )}

            <div className='classic-home-v2-footer'>
              <FooterBar />
            </div>
          </div>
        </div>
      ) : (
        <div className='classic-page-fill overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-full border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
