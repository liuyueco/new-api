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
      title: 'Standard Plan',
      subtitle: t('学生和轻量级开发者'),
      price: '¥399',
      cadence: '/4周',
      points: [
        t('周额度 $110'),
        t('相当于全站 API 计费额外尊享 9 折'),
        t('最多 5 个并发'),
      ],
      highlighted: false,
    },
    {
      badge: t('推荐选择'),
      title: 'Premium Plan',
      subtitle: t('专业开发者首选'),
      price: '¥899',
      cadence: '/4周',
      points: [
        t('周额度 $260'),
        t('相当于全站 API 计费额外尊享 86 折'),
        t('最多 5 个并发'),
      ],
      highlighted: true,
    },
    {
      badge: t('长期扩展'),
      title: 'Professional Plan',
      subtitle: t('顶尖开发者与极客'),
      price: '¥1799',
      cadence: '/4周',
      points: [
        t('周额度 $530'),
        t('相当于全站 API 计费额外尊享 84 折'),
        t('最多 5 个并发'),
      ],
      highlighted: false,
    },
  ];

  const reviewCards = [
    {
      name: 'David Z.',
      role: t('全栈工程师 @ 大型互联网公司'),
      quote: t('每笔消耗在后台都能对上，余额变动有明细，计费规则看得懂，比用过的一些中转站实在多了。'),
    },
    {
      name: t('陈工'),
      role: t('前端架构师 @ 生活服务平台'),
      quote: t('日常写代码连着跑，首 token 和整段响应都够快，高峰期也没有明显变慢，体验接近官方直连。'),
    },
    {
      name: t('吴总监'),
      role: t('研发总监 @ 金融科技公司'),
      quote: t('Cursor、Continue 这些工具改个 Base URL 就能用，协议兼容到位，团队迁移基本只改一行配置。'),
    },
    {
      name: 'Sarah L.',
      role: t('独立开发者 / iOS 专家'),
      quote: t('一个人做项目，不想维护一堆密钥和节点。一个账号常用模型都能用，充值查量都在同一页，真的省事。'),
    },
    {
      name: t('李先生'),
      role: t('技术负责人 @ 独角兽企业'),
      quote: t('业务 7×24 在线，最怕半夜接口挂。稳定性不错，调用日志也能追溯，排查比自己在那试错快多了。'),
    },
    {
      name: 'Alice S.',
      role: t('算法工程师 @ 社交媒体平台'),
      quote: t('Claude、GPT、Gemini 走同一入口，新模型上线也跟得比较勤，不用每个厂商单独找渠道、配 key。'),
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
              <div className='classic-home-v2-section-head classic-home-v2-section-head-center'>
                <span className='classic-home-v2-section-badge'>{t('套餐订阅')}</span>
                <h2>{t('选择适合你的订阅方案')}</h2>
                <p>
                  {t('覆盖个人试用、稳定开发与企业协作，先把用户最关心的额度、折扣、并发和服务边界讲清楚。')}
                </p>
              </div>

              <div className='classic-home-v2-plan-grid'>
                {planCards.map((item) => (
                  <article
                    className={`classic-home-v2-plan-card${item.highlighted ? ' classic-home-v2-plan-card-highlighted' : ''}`}
                    key={item.title}
                  >
                    <div
                      className={`classic-home-v2-plan-badge${item.highlighted ? ' classic-home-v2-plan-badge-highlighted' : ''}`}
                    >
                      {item.badge}
                    </div>
                    <h3>{item.title}</h3>
                    <p className='classic-home-v2-plan-subtitle'>{item.subtitle}</p>
                    <div className='classic-home-v2-plan-price'>
                      <strong>{item.price}</strong>
                      <span>{item.cadence}</span>
                    </div>
                    <div className='classic-home-v2-plan-divider' />
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <Link to='/login'>
                      <Button
                        theme='solid'
                        type={item.highlighted ? 'primary' : 'tertiary'}
                        className={`classic-home-v2-plan-btn${item.highlighted ? '' : ' classic-home-v2-plan-btn-muted'}`}
                      >
                        {t('登录订阅')}
                      </Button>
                    </Link>
                  </article>
                ))}

                <article className='classic-home-v2-enterprise-card'>
                  <div className='classic-home-v2-enterprise-badge'>
                    {t('企业协作')}
                  </div>
                  <h3>{t('企业方案')}</h3>
                  <p>
                    {t('根据团队规模、额度与并发灵活适配配置')}
                  </p>
                  <ul>
                    <li>{t('按团队规模定制额度与并发')}</li>
                    <li>{t('支持专属 API 接入与用量管理')}</li>
                    <li>{t('专属售后支持与故障优先处理')}</li>
                    <li>{t('支持合同、发票与企业结算')}</li>
                  </ul>
                  <Button theme='solid' type='warning' className='classic-home-v2-enterprise-btn'>
                    {t('咨询企业方案')}
                  </Button>
                </article>
              </div>
            </section>

            <section className='classic-home-v2-section' id='reviews'>
              <div className='classic-home-v2-section-head classic-home-v2-section-head-center'>
                <span className='classic-home-v2-section-badge'>{t('用户评价')}</span>
                <h2>{t('用户怎么说')}</h2>
                <p>
                  {t('做 API 中转，真正让人留下来的，从来都是计费透不透明、响应够不够快、兼容广不广、用起来省不省心。')}
                </p>
              </div>

              <div className='classic-home-v2-review-grid'>
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
