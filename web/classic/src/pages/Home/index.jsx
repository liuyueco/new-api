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
import {
  IconArrowRight,
  IconBolt,
  IconFile,
  IconGithubLogo,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';

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

  const planCards = [
    {
      badge: t('快速起步'),
      title: t('个人体验方案'),
      subtitle: t('适合快速购买 token 并接入现有应用'),
      points: [
        t('兼容 OpenAI 风格接口'),
        t('主流模型统一中转'),
        t('支持基础 token 和额度使用'),
      ],
      highlighted: false,
    },
    {
      badge: t('推荐选择'),
      title: t('稳定调用方案'),
      subtitle: t('适合更高频率、更稳定的日常调用场景'),
      points: [
        t('支持更丰富的 token 使用和购买方式'),
        t('更适合长期稳定调用和日常使用'),
        t('适合需要持续消费模型能力的用户'),
      ],
      highlighted: true,
    },
    {
      badge: t('长期扩展'),
      title: t('企业用量方案'),
      subtitle: t('适合更高额度、更高并发和更稳定的使用需求'),
      points: [
        t('覆盖更多模型与调用场景'),
        t('更适合稳定高频业务调用'),
        t('适合长期用量管理和稳定消费'),
      ],
      highlighted: false,
    },
  ];

  const reviewCards = [
    {
      name: 'David Z.',
      role: t('全栈工程师 @ 大型互联网公司'),
      quote: t('接入新模型时不再需要重复改 SDK、鉴权和计费逻辑，整个迭代链路顺了很多。'),
    },
    {
      name: t('陈工'),
      role: t('前端架构师 @ 生活服务平台'),
      quote: t('把模型调用、公告、令牌和日志都集中到一个后台之后，运营和研发终于能共用一套配置。'),
    },
    {
      name: t('吴总监'),
      role: t('研发总监 @ 金融科技公司'),
      quote: t('最实用的是排障路径很清晰，哪个用户、哪个令牌、走了哪条渠道都能快速定位。'),
    },
    {
      name: 'Sarah L.',
      role: t('独立开发者 / iOS 专家'),
      quote: t('作为独立开发者，我更在意接入速度和维护成本。这套首页展示出来的产品逻辑是对的。'),
    },
    {
      name: t('李先生'),
      role: t('技术负责人 @ 独角兽企业'),
      quote: t('按量额度和统一入口设计很实用，高峰期也不必再担心资源和策略散落在多个地方。'),
    },
    {
      name: 'Alice S.',
      role: t('算法工程师 @ 社交媒体平台'),
      quote: t('客户端体验和后台治理终于被放到同一个系统里，产品推进速度明显更稳。'),
    },
  ];

  const faqs = [
    {
      question: t('什么是 {{name}}？', { name: systemName }),
      answer: t('{{name}} 是面向开发者的 AI 编程工作台，提供代码辅助、智能问答、团队协作、订阅与按量购买等功能，帮助开发者更高效地完成日常研发工作。', { name: systemName }),
    },
    {
      question: t('为什么选择 {{name}}？', { name: systemName }),
      answer: t('我们把常用 AI 开发能力、计费管理和客户支持整合在同一个软件平台里，减少工具切换成本，适合个人开发者和团队持续使用。'),
    },
    {
      question: t('服务稳定性如何保障？'),
      answer: t('我们通过持续监控、容量规划、故障恢复和性能优化来保障稳定性，核心能力面向高频开发场景持续维护，企业版还提供更完善的服务支持。'),
    },
    {
      question: t('如何开始使用服务？'),
      answer: t('注册账号后选择合适的套餐，即可开始使用工作台能力。平台提供清晰的上手说明、购买入口和客服支持，新用户也可以先体验再决定是否订阅。'),
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
                  <img src={logo} alt={systemName} className='classic-home-v2-logo' />
                  <span>{systemName}</span>
                </Link>

                <nav className='classic-home-v2-links'>
                  {docsLink && (
                    <a href={docsLink} target='_blank' rel='noreferrer'>
                      {t('文档')}
                    </a>
                  )}
                  <a href='#plans'>{t('方案')}</a>
                  <a href='#reviews'>{t('用户评价')}</a>
                  <a href='#faq'>{t('常见问题')}</a>
                  <a href='#contact'>{t('联系我们')}</a>
                </nav>

                <div className='classic-home-v2-nav-action'>
                  <Link to='/login'>
                    <Button theme='solid' type='primary' className='classic-home-v2-login-btn'>
                      {t('登录')}
                    </Button>
                  </Link>
                </div>
              </div>
            </header>

            <section className='classic-home-v2-hero'>
              <div className='classic-home-v2-hero-copy'>
                <span className='classic-home-v2-pill'>
                  {t('统一 AI 模型中转入口')}
                </span>
                <h1>
                  <span>{t('把主流模型能力')}</span>
                  <span className='classic-home-v2-gradient-text'>
                    {t('整理成一个稳定可用的 API 入口')}
                  </span>
                </h1>
                <p>
                  {t('通过统一 token 和兼容接口，直接调用主流大模型能力，降低接入门槛和使用成本。')}
                </p>

                <div className='classic-home-v2-actions'>
                  <Link to='/console'>
                    <Button
                      theme='solid'
                      type='primary'
                      size='large'
                      icon={<IconBolt />}
                      className='classic-home-v2-primary-btn'
                    >
                      {t('立即体验')}
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            <section className='classic-home-v2-hero-metrics'>
              <div className='classic-home-v2-metrics'>
                <div>
                  <strong>40+</strong>
                  <span>{t('个上游供应商')}</span>
                </div>
                <div>
                  <strong>99.9%</strong>
                  <span>{t('中转稳定性')}</span>
                </div>
                <div>
                  <strong>OpenAI</strong>
                  <span>{t('兼容 OpenAI 风格调用')}</span>
                </div>
                <div>
                  <strong>Token</strong>
                  <span>{t('开通 token 后即可开始调用')}</span>
                </div>
              </div>
            </section>

            <section className='classic-home-v2-section' id='plans'>
              <div className='classic-home-v2-section-head'>
                <span className='classic-home-v2-section-badge'>{t('方案')}</span>
                <h2>{t('选择适合你的 token 使用方案')}</h2>
                <p>
                  {t('不强调模板式官网文案，直接把用户关心的接入效率、开箱即用和运营稳定性讲清楚。')}
                </p>
              </div>

              <div className='classic-home-v2-plan-grid'>
                {planCards.map((item) => (
                  <article
                    className={`classic-home-v2-plan-card${item.highlighted ? ' classic-home-v2-plan-card-highlighted' : ''}`}
                    key={item.title}
                  >
                    <div className='classic-home-v2-plan-badge'>{item.badge}</div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <Link to='/login'>
                      <Button
                        theme={item.highlighted ? 'solid' : 'light'}
                        type={item.highlighted ? 'primary' : 'tertiary'}
                        className='classic-home-v2-plan-btn'
                      >
                        {t('登录后获取 token')}
                      </Button>
                    </Link>
                  </article>
                ))}

                <article className='classic-home-v2-enterprise-card'>
                  <div className='classic-home-v2-enterprise-badge'>
                    {t('企业协作')}
                  </div>
                  <h3>{t('需要更高阶的 token 方案？')}</h3>
                  <p>
                    {t('适合更高频调用、更高额度需求和更长期的业务使用场景。')}
                  </p>
                  <ul>
                    <li>{t('支持更大规模的 token 使用需求')}</li>
                    <li>{t('更适合长期稳定调用与业务接入')}</li>
                    <li>{t('方便结合文档、公告和服务支持持续使用')}</li>
                  </ul>
                  <a
                    href={docsLink || 'mailto:support@quantumnous.com'}
                    target={docsLink ? '_blank' : undefined}
                    rel={docsLink ? 'noreferrer' : undefined}
                  >
                    <Button theme='solid' type='warning' className='classic-home-v2-enterprise-btn'>
                      {t('查看文档或联系支持')}
                    </Button>
                  </a>
                </article>
              </div>
            </section>

            <section className='classic-home-v2-section' id='reviews'>
              <div className='classic-home-v2-section-head classic-home-v2-section-head-center'>
                <span className='classic-home-v2-section-badge'>{t('用户评价')}</span>
                <h2>{t('用户怎么说')}</h2>
                <p>
                  {t('真实的反馈通常不在于页面多炫，而在于 token 是否好买、接口是否稳定、模型是否够全。')}
                </p>
              </div>

              <div className='classic-home-v2-review-masonry'>
                {reviewCards.map((item, index) => (
                  <article
                    className={`classic-home-v2-review-card classic-home-v2-review-card-${(index % 3) + 1}`}
                    key={`${item.name}-${index}`}
                  >
                    <p>{item.quote}</p>
                    <div className='classic-home-v2-review-user'>
                      <div className='classic-home-v2-review-avatar'>
                        {String(item.name).slice(0, 1)}
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.role}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className='classic-home-v2-section classic-home-v2-faq-section' id='faq'>
              <div className='classic-home-v2-section-head classic-home-v2-section-head-center'>
                <span className='classic-home-v2-section-badge'>{t('常见问题')}</span>
                <h2>{t('有疑问？我们来解答')}</h2>
              </div>

              <div className='classic-home-v2-faq-list'>
                {faqs.map((item, index) => (
                  <details className='classic-home-v2-faq-item' key={item.question} open={index === 0}>
                    <summary>
                      <span>{item.question}</span>
                      <span>+</span>
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className='classic-home-v2-contact' id='contact'>
              <div className='classic-home-v2-contact-copy'>
                <span className='classic-home-v2-section-badge'>{t('联系我们')}</span>
                <h2>{t('先获取 token，再开始调用')}</h2>
                <p>
                  {t('如果你已经有现成客户端或应用，只需要获取 token 并替换 Base URL，就可以开始调用。')}
                </p>
              </div>

              <div className='classic-home-v2-contact-actions'>
                <Link to='/console'>
                  <Button theme='solid' type='primary' size='large' icon={<IconArrowRight />}>
                    {t('立即获取 token')}
                  </Button>
                </Link>
                {docsLink ? (
                  <Button
                    size='large'
                    icon={<IconFile />}
                    onClick={() => window.open(docsLink, '_blank')}
                  >
                    {t('文档')}
                  </Button>
                ) : (
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
                  )
                )}
              </div>
            </section>
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
