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
import { Button, Modal, Select } from '@douyinfe/semi-ui';
import {
  API,
  copy,
  getLogo,
  getSystemName,
  showError,
  showSuccess,
} from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { IconArrowRight, IconFile, IconGithubLogo } from '@douyinfe/semi-icons';
import {
  BarChart3,
  Code,
  Copy,
  DollarSign,
  Menu,
  Settings,
  Shield,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import FooterBar from '../../components/layout/Footer';
import ActionButtons from '../../components/layout/headerbar/ActionButtons';
import LanguageSelector from '../../components/layout/headerbar/LanguageSelector';
import ThemeToggle from '../../components/layout/headerbar/ThemeToggle';
import UserArea from '../../components/layout/headerbar/UserArea';
import { useHeaderBar } from '../../hooks/common/useHeaderBar';
import { useNotifications } from '../../hooks/common/useNotifications';
import { fetchTokenKeys } from '../../helpers/token';

const accessTools = [
  {
    key: 'cc-switch',
    name: 'CC Switch',
    icon: '🎛️',
    downloadUrl: 'https://github.com/farion1231/cc-switch/releases/latest',
    description: 'Claude Code / Codex 多配置切换工具，支持从浏览器唤起导入。',
  },
  {
    key: 'claude-code',
    name: 'Claude Code',
    icon: '🧠',
    description: 'Claude Code 的一键安装脚本。',
  },
  {
    key: 'codex',
    name: 'Codex',
    icon: '💻',
    description: 'Codex 的一键安装脚本。',
  },
  {
    key: 'cursor',
    name: 'Cursor',
    icon: '📝',
    description: 'Cursor 的一键安装脚本。',
  },
  {
    key: 'hermes',
    name: 'Hermes',
    icon: '⚡',
    description: 'Hermes 的一键安装脚本。',
  },
  {
    key: 'openclaw',
    name: 'OpenClaw',
    icon: '🦞',
    description: 'OpenClaw 的一键安装脚本。',
  },
];

const accessModels = [
  'claude-opus-4-7',
  'claude-sonnet-4',
  'gpt-5.5',
  'gpt-5',
  'gemini-2.5-pro',
  'deepseek-chat',
];

const PLACEHOLDER_API_KEY = 'sk-your-key-here';
const ccSwitchProjectUrl = 'https://github.com/farion1231/cc-switch';
const ccSwitchLatestReleaseUrl = `${ccSwitchProjectUrl}/releases/latest`;
const accessOperatingSystems = ['macOS', 'Linux', 'Windows'];
const ccSwitchDownloadPlatforms = ['macOS', 'Linux', 'Windows'];
const createCcSwitchUrl = (model, baseUrl, target, systemName, apiKey) => {
  const endpoint = target === 'codex' ? `${baseUrl}/v1` : baseUrl;
  const params = new URLSearchParams();
  params.set('resource', 'provider');
  params.set('app', target);
  params.set(
    'name',
    `${systemName || 'new-api'} ${target === 'codex' ? 'Codex' : 'Claude'}`,
  );
  params.set('endpoint', endpoint);
  params.set('apiKey', apiKey);
  params.set('model', model);
  params.set('homepage', baseUrl);
  params.set('enabled', 'true');

  return `ccswitch://v1/import?${params.toString()}`;
};

const createAccessScript = (
  toolKey,
  model,
  baseUrl,
  systemName,
  os,
  apiKey = PLACEHOLDER_API_KEY,
) => {
  const appName = systemName || 'New API';
  const safeBaseUrl = baseUrl.replace(/\/+$/, '');
  const shellValue = (value) => String(value).replace(/(["\\$`])/g, '\\$1');
  const safeAppName = shellValue(appName);
  const safeModel = shellValue(model);
  const psValue = (value) => String(value).replace(/'/g, "''");
  const psAppName = psValue(appName);
  const psModel = psValue(model);
  const psBaseUrl = psValue(safeBaseUrl);
  const resolvedApiKey = apiKey || PLACEHOLDER_API_KEY;
  const hasRealApiKey = resolvedApiKey !== PLACEHOLDER_API_KEY;
  const safeApiKey = shellValue(resolvedApiKey);
  const psApiKey = psValue(resolvedApiKey);
  const providerId = 'new-api';
  const blockName = `${appName} ${toolKey}`;
  const safeBlockName = shellValue(blockName);
  const psBlockName = psValue(blockName);
  const genericPrefix = toolKey.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  const toolLabel =
    accessTools.find((tool) => tool.key === toolKey)?.name || 'Tool';
  const psNextStep = hasRealApiKey
    ? `Open a NEW PowerShell window and run:`
    : `Replace ${PLACEHOLDER_API_KEY} with your real Key, open a NEW PowerShell window, and run:`;
  const shellNextStep = hasRealApiKey
    ? `Open a NEW terminal and run:`
    : `Replace ${PLACEHOLDER_API_KEY} with your real Key, open a NEW terminal, and run:`;

  const buildWindowsProfileScript = (
    body,
    toolCommand,
    installCommand,
  ) => `$ErrorActionPreference = 'Stop'

$ProfilePath = $PROFILE
$ProfileDir = Split-Path -Parent $ProfilePath
if (!(Test-Path $ProfileDir)) { New-Item -ItemType Directory -Path $ProfileDir -Force | Out-Null }
if (!(Test-Path $ProfilePath)) { New-Item -ItemType File -Path $ProfilePath -Force | Out-Null }

$BlockStart = '# ${psBlockName} start'
$BlockEnd = '# ${psBlockName} end'
$Content = Get-Content -Raw -Path $ProfilePath
if ($Content.Contains($BlockStart)) {
  Copy-Item $ProfilePath "$ProfilePath.bak.$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
  $Pattern = "(?s)\\r?\\n?" + [regex]::Escape($BlockStart) + ".*?" + [regex]::Escape($BlockEnd) + "\\r?\\n?"
  $Content = [regex]::Replace($Content, $Pattern, [Environment]::NewLine).TrimEnd() + [Environment]::NewLine
  Set-Content -Path $ProfilePath -Value $Content
}

Add-Content -Path $ProfilePath -Value @'

# ${psBlockName} start
${body}
# ${psBlockName} end
'@

Write-Host "[${psAppName}] ${toolLabel} config written to $ProfilePath"
if (!(Get-Command ${toolCommand} -ErrorAction SilentlyContinue)) {
  Write-Host ""
  Write-Host "[${psAppName}] ${toolLabel} not installed yet. Install:"
  Write-Host "  ${installCommand}"
  Write-Host ""
  Write-Host "${psNextStep} ${toolCommand}"
} else {
  Write-Host ""
  Write-Host "[${psAppName}] ${psNextStep} ${toolCommand}"
}`;

  const buildProfileScript = (
    body,
    toolCommand,
    installCommand,
  ) => `#!/usr/bin/env bash
set -e

RC="$HOME/.zshrc"
BLOCK_START="# ${safeBlockName} start"
BLOCK_END="# ${safeBlockName} end"
touch "$RC"

if grep -q "$BLOCK_START" "$RC" 2>/dev/null; then
  cp "$RC" "$RC.bak.$(date +%s)"
  TMP="$RC.tmp.$$"
  awk -v start="$BLOCK_START" -v end="$BLOCK_END" '
    $0 == start { skip = 1; next }
    $0 == end { skip = 0; next }
    !skip { print }
  ' "$RC" > "$TMP" && mv "$TMP" "$RC"
fi

cat >> "$RC" <<'EOF'

# ${blockName} start
${body}
# ${blockName} end
EOF

echo "[${appName}] ${toolLabel} config written to $RC"
. "$RC" 2>/dev/null || true

if ! command -v ${toolCommand} >/dev/null 2>&1; then
  echo ""
  echo "[${appName}] ${toolLabel} not installed yet. Install:"
  echo "  ${installCommand}"
  echo ""
  echo "${shellNextStep} ${toolCommand}"
else
  echo ""
  echo "[${appName}] ${shellNextStep} ${toolCommand}"
fi`;

  switch (toolKey) {
    case 'claude-code':
      if (os === 'Windows') {
        return buildWindowsProfileScript(
          `$env:ANTHROPIC_BASE_URL='${psBaseUrl}'
$env:ANTHROPIC_AUTH_TOKEN='${psApiKey}'
$env:ANTHROPIC_MODEL='${psModel}'
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC='1'`,
          'claude',
          'npm install -g @anthropic-ai/claude-code',
        );
      }

      return buildProfileScript(
        `export ANTHROPIC_BASE_URL="${safeBaseUrl}"
export ANTHROPIC_AUTH_TOKEN="${safeApiKey}"
export ANTHROPIC_MODEL="${safeModel}"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`,
        'claude',
        'npm install -g @anthropic-ai/claude-code',
      );
    case 'codex':
      if (os === 'Windows') {
        return `$ErrorActionPreference = 'Stop'

$CodexDir = Join-Path $env:USERPROFILE '.codex'
$ConfigPath = Join-Path $CodexDir 'config.toml'
$ProfilePath = $PROFILE
$ProfileDir = Split-Path -Parent $ProfilePath
if (!(Test-Path $CodexDir)) { New-Item -ItemType Directory -Path $CodexDir -Force | Out-Null }
if (!(Test-Path $ProfileDir)) { New-Item -ItemType Directory -Path $ProfileDir -Force | Out-Null }
if (!(Test-Path $ProfilePath)) { New-Item -ItemType File -Path $ProfilePath -Force | Out-Null }
if (Test-Path $ConfigPath) { Copy-Item $ConfigPath "$ConfigPath.bak.$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())" }

Set-Content -Path $ConfigPath -Value @'
model = "${psModel}"
model_provider = "${providerId}"
review_model = "${psModel}"
disable_response_storage = true

[model_providers.${providerId}]
name = "${psAppName}"
base_url = "${psBaseUrl}/v1"
wire_api = "responses"
env_key = "OPENAI_API_KEY"
'@

$BlockStart = '# ${psBlockName} env start'
$BlockEnd = '# ${psBlockName} env end'
$Content = Get-Content -Raw -Path $ProfilePath
if ($Content.Contains($BlockStart)) {
  Copy-Item $ProfilePath "$ProfilePath.bak.$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
  $Pattern = "(?s)\\r?\\n?" + [regex]::Escape($BlockStart) + ".*?" + [regex]::Escape($BlockEnd) + "\\r?\\n?"
  $Content = [regex]::Replace($Content, $Pattern, [Environment]::NewLine).TrimEnd() + [Environment]::NewLine
  Set-Content -Path $ProfilePath -Value $Content
}

Add-Content -Path $ProfilePath -Value @'

# ${psBlockName} env start
$env:OPENAI_API_KEY='${psApiKey}'
# ${psBlockName} env end
'@

Write-Host "[${psAppName}] Codex config written to $ConfigPath"
if (!(Get-Command codex -ErrorAction SilentlyContinue)) {
  Write-Host ""
  Write-Host "[${psAppName}] Codex not installed yet. Install:"
  Write-Host "  npm install -g @openai/codex"
  Write-Host ""
  Write-Host "${psNextStep} codex"
} else {
  Write-Host ""
  Write-Host "[${psAppName}] ${psNextStep} codex"
}`;
      }

      return `#!/usr/bin/env bash
set -e

CODEX_DIR="$HOME/.codex"
CONFIG_PATH="$CODEX_DIR/config.toml"
RC="$HOME/.zshrc"
BLOCK_START="# ${blockName} env start"
BLOCK_END="# ${blockName} env end"
mkdir -p "$CODEX_DIR"
touch "$CONFIG_PATH"
touch "$RC"

if [ -f "$CONFIG_PATH" ]; then
  cp "$CONFIG_PATH" "$CONFIG_PATH.bak.$(date +%s)"
fi

cat > "$CONFIG_PATH" <<'EOF'
model = "${safeModel}"
model_provider = "${providerId}"
review_model = "${safeModel}"
disable_response_storage = true

[model_providers.${providerId}]
name = "${safeAppName}"
base_url = "${safeBaseUrl}/v1"
wire_api = "responses"
env_key = "OPENAI_API_KEY"
EOF

if grep -q "$BLOCK_START" "$RC" 2>/dev/null; then
  cp "$RC" "$RC.bak.$(date +%s)"
  TMP="$RC.tmp.$$"
  awk -v start="$BLOCK_START" -v end="$BLOCK_END" '
    $0 == start { skip = 1; next }
    $0 == end { skip = 0; next }
    !skip { print }
  ' "$RC" > "$TMP" && mv "$TMP" "$RC"
fi

cat >> "$RC" <<'EOF'

# ${blockName} env start
export OPENAI_API_KEY="${safeApiKey}"
# ${blockName} env end
EOF

echo "[${appName}] Codex config written to $CONFIG_PATH"
. "$RC" 2>/dev/null || true

if ! command -v codex >/dev/null 2>&1; then
  echo ""
  echo "[${appName}] Codex not installed yet. Install:"
  echo "  npm install -g @openai/codex"
  echo ""
  echo "${shellNextStep} codex"
else
  echo ""
  echo "[${appName}] ${shellNextStep} codex"
fi`;
    case 'cursor':
    case 'hermes':
    case 'openclaw':
      if (os === 'Windows') {
        return buildWindowsProfileScript(
          `$env:${genericPrefix}_BASE_URL='${psBaseUrl}/v1'
$env:${genericPrefix}_API_KEY='${psApiKey}'
$env:${genericPrefix}_MODEL='${psModel}'
$env:OPENAI_BASE_URL='${psBaseUrl}/v1'
$env:OPENAI_API_KEY='${psApiKey}'
$env:OPENAI_MODEL='${psModel}'`,
          toolKey,
          `Install ${toolLabel} from its official distribution, then re-run this script.`,
        );
      }

      return buildProfileScript(
        `export ${genericPrefix}_BASE_URL="${safeBaseUrl}/v1"
export ${genericPrefix}_API_KEY="${safeApiKey}"
export ${genericPrefix}_MODEL="${safeModel}"
export OPENAI_BASE_URL="${safeBaseUrl}/v1"
export OPENAI_API_KEY="${safeApiKey}"
export OPENAI_MODEL="${safeModel}"`,
        toolKey,
        `Install ${toolLabel} from its official distribution, then re-run this script.`,
      );
    case 'cc-switch':
    default:
      return '';
  }
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [accessGuideVisible, setAccessGuideVisible] = useState(false);
  const [selectedAccessTool, setSelectedAccessTool] = useState('cc-switch');
  const [selectedAccessModel, setSelectedAccessModel] = useState(
    accessModels[0],
  );
  const [selectedAccessOs, setSelectedAccessOs] = useState('macOS');
  const [selectedCcSwitchTarget, setSelectedCcSwitchTarget] =
    useState('claude');
  const [resolvedAccessApiKey, setResolvedAccessApiKey] =
    useState(PLACEHOLDER_API_KEY);
  const [loadingAccessApiKey, setLoadingAccessApiKey] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const systemName = getSystemName();
  const logo = getLogo();
  const {
    userState,
    currentLang,
    isLoading,
    isNewYear,
    isSelfUseMode,
    theme,
    logout,
    handleLanguageChange,
    handleThemeToggle,
    navigate,
  } = useHeaderBar({
    onMobileMenuToggle: () => {},
    drawerOpen: false,
  });
  const {
    noticeVisible: headerNoticeVisible,
    unreadCount,
    handleNoticeOpen,
    handleNoticeClose,
    getUnreadKeys,
  } = useNotifications(statusState);

  const isAuthenticated = Boolean(localStorage.getItem('user'));
  const accessBaseUrl =
    statusState?.status?.server_address || window.location.origin;
  const accessApiKey = resolvedAccessApiKey || PLACEHOLDER_API_KEY;
  const hasResolvedAccessApiKey = accessApiKey !== PLACEHOLDER_API_KEY;
  const currentAccessTool =
    accessTools.find((tool) => tool.key === selectedAccessTool) ||
    accessTools[0];
  const accessScript = createAccessScript(
    currentAccessTool.key,
    selectedAccessModel,
    accessBaseUrl,
    systemName,
    selectedAccessOs,
    accessApiKey,
  );
  const accessScriptExtension = selectedAccessOs === 'Windows' ? 'ps1' : 'sh';
  const accessScriptFileName = `${systemName
    .toLowerCase()
    .replace(
      /\s+/g,
      '-',
    )}-${currentAccessTool.key}-setup.${accessScriptExtension}`;
  const accessScriptRunCommand =
    selectedAccessOs === 'Windows'
      ? `powershell -ExecutionPolicy Bypass -File .\\${accessScriptFileName}`
      : `bash ~/Downloads/${accessScriptFileName}`;
  const ccSwitchTargets = [
    { value: 'claude', label: 'Claude Code' },
    { value: 'codex', label: 'Codex' },
  ];
  const ccSwitchUrl = createCcSwitchUrl(
    selectedAccessModel,
    accessBaseUrl,
    selectedCcSwitchTarget,
    systemName,
    accessApiKey,
  );
  const isCcSwitchSelected = currentAccessTool.key === 'cc-switch';
  const isCursorSelected = currentAccessTool.key === 'cursor';
  const cursorConfigFields = [
    { label: 'Base URL', value: `${accessBaseUrl.replace(/\/+$/, '')}/v1` },
    { label: 'API Key', value: accessApiKey },
    { label: 'Model', value: selectedAccessModel },
  ];

  const handleCopyAccessScript = async () => {
    const ok = await copy(accessScript);
    if (ok) {
      showSuccess(t('脚本已复制'));
    }
  };

  const handleDownloadAccessScript = () => {
    const blob = new Blob([accessScript], {
      type:
        selectedAccessOs === 'Windows'
          ? 'text/plain;charset=utf-8'
          : 'text/x-shellscript;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = accessScriptFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyCcSwitchUrl = async () => {
    const ok = await copy(ccSwitchUrl);
    if (ok) {
      showSuccess(t('唤起链接已复制'));
    }
  };

  const handleCopyCursorValue = async (value) => {
    const ok = await copy(value);
    if (ok) {
      showSuccess(t('已复制到剪贴板'));
    }
  };

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

  useEffect(() => {
    if (!isMobile && mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [isMobile, mobileNavOpen]);

  useEffect(() => {
    let cancelled = false;

    const loadAccessApiKey = async () => {
      if (!accessGuideVisible || !isAuthenticated) {
        setResolvedAccessApiKey(PLACEHOLDER_API_KEY);
        setLoadingAccessApiKey(false);
        return;
      }

      setLoadingAccessApiKey(true);
      try {
        const keys = await fetchTokenKeys();
        const firstKey = keys?.[0] ? `sk-${keys[0]}` : PLACEHOLDER_API_KEY;
        if (!cancelled) {
          setResolvedAccessApiKey(firstKey);
        }
      } catch (error) {
        console.error('获取 API Key 失败:', error);
        if (!cancelled) {
          setResolvedAccessApiKey(PLACEHOLDER_API_KEY);
        }
      } finally {
        if (!cancelled) {
          setLoadingAccessApiKey(false);
        }
      }
    };

    loadAccessApiKey();

    return () => {
      cancelled = true;
    };
  }, [accessGuideVisible, isAuthenticated]);

  return (
    <div className='classic-page-fill classic-home-page w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      <NoticeModal
        visible={headerNoticeVisible}
        onClose={handleNoticeClose}
        isMobile={isMobile}
        defaultTab={unreadCount > 0 ? 'system' : 'inApp'}
        unreadKeys={getUnreadKeys()}
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
                  <Link to='/'>{t('首页')}</Link>
                  <Link to={isAuthenticated ? '/console' : '/login'}>
                    {t('控制台')}
                  </Link>
                  <Link to='/pricing'>{t('模型广场')}</Link>
                  {docsLink && (
                    <a href={docsLink} target='_blank' rel='noreferrer'>
                      {t('文档')}
                    </a>
                  )}
                </nav>

                <div className='classic-home-v2-nav-action'>
                  {isMobile ? (
                    <>
                      <LanguageSelector
                        currentLang={currentLang}
                        onLanguageChange={handleLanguageChange}
                        t={t}
                      />
                      <ThemeToggle
                        theme={theme}
                        onThemeToggle={handleThemeToggle}
                        t={t}
                      />
                      <UserArea
                        userState={userState}
                        isLoading={isLoading}
                        isMobile={isMobile}
                        isSelfUseMode={isSelfUseMode}
                        logout={logout}
                        navigate={navigate}
                        t={t}
                      />
                      <Button
                        theme='borderless'
                        type='tertiary'
                        className='classic-home-v2-menu-btn'
                        icon={
                          mobileNavOpen ? <X size={20} /> : <Menu size={20} />
                        }
                        aria-label={mobileNavOpen ? t('关闭') : t('菜单')}
                        onClick={() => setMobileNavOpen((open) => !open)}
                      />
                    </>
                  ) : (
                    <>
                      <ActionButtons
                        isNewYear={isNewYear}
                        unreadCount={unreadCount}
                        onNoticeOpen={handleNoticeOpen}
                        theme={theme}
                        onThemeToggle={handleThemeToggle}
                        currentLang={currentLang}
                        onLanguageChange={handleLanguageChange}
                        userState={userState}
                        isLoading={isLoading}
                        isMobile={isMobile}
                        isSelfUseMode={isSelfUseMode}
                        logout={logout}
                        navigate={navigate}
                        t={t}
                      />
                    </>
                  )}
                </div>

                {isMobile && mobileNavOpen && (
                  <div className='classic-home-v2-mobile-menu'>
                    <Link to='/' onClick={() => setMobileNavOpen(false)}>
                      {t('首页')}
                    </Link>
                    <Link
                      to={isAuthenticated ? '/console' : '/login'}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {t('控制台')}
                    </Link>
                    <Link to='/pricing' onClick={() => setMobileNavOpen(false)}>
                      {t('模型广场')}
                    </Link>
                    {docsLink && (
                      <a
                        href={docsLink}
                        target='_blank'
                        rel='noreferrer'
                        onClick={() => setMobileNavOpen(false)}
                      >
                        {t('文档')}
                      </a>
                    )}
                  </div>
                )}
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
                  <Button
                    size='large'
                    className='classic-home-v2-secondary-btn'
                    onClick={() => setAccessGuideVisible(true)}
                  >
                    {t('一键接入向导')}
                  </Button>
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

            <Modal
              visible={accessGuideVisible}
              onCancel={() => setAccessGuideVisible(false)}
              footer={null}
              centered
              closeOnEsc
              width={isMobile ? 'calc(100vw - 28px)' : 820}
              className='classic-home-v2-access-modal'
            >
              <div className='classic-home-v2-access-modal-head'>
                <span>{t('一键接入')}</span>
                <strong>{t('一键接入向导')}</strong>
                <p>{t('选择工具，复制对应脚本文件内容。')}</p>
              </div>

              <div
                className='classic-home-v2-access-tools'
                style={{
                  '--access-tool-count': accessTools.length,
                  '--access-tool-index': accessTools.findIndex(
                    (tool) => tool.key === selectedAccessTool,
                  ),
                }}
              >
                {accessTools.map((tool) => (
                  <button
                    key={tool.key}
                    type='button'
                    className={
                      selectedAccessTool === tool.key
                        ? 'classic-home-v2-access-tool active'
                        : 'classic-home-v2-access-tool'
                    }
                    onClick={() => setSelectedAccessTool(tool.key)}
                  >
                    <span>{tool.icon}</span>
                    {tool.name}
                  </button>
                ))}
              </div>

              <div className='classic-home-v2-access-controls mt-2'>
                <label>
                  <span>{t('模型')}</span>
                  <Select
                    value={selectedAccessModel}
                    onChange={setSelectedAccessModel}
                    className='classic-home-v2-access-select'
                  >
                    {accessModels.map((model) => (
                      <Select.Option key={model} value={model}>
                        {model}
                      </Select.Option>
                    ))}
                  </Select>
                </label>
                <p>
                  {loadingAccessApiKey
                    ? t('正在读取可用 API Key...')
                    : hasResolvedAccessApiKey
                      ? t('已使用你的可用 API Key。')
                      : t('将 sk-your-key-here 替换为你的真实 Key。')}
                </p>
              </div>

              {!isCcSwitchSelected && !isCursorSelected && (
                <div className='classic-home-v2-access-os-tabs'>
                  <span>{t('系统')}</span>
                  <div
                    className='classic-home-v2-access-segment'
                    style={{
                      '--segment-count': accessOperatingSystems.length,
                      '--segment-index':
                        accessOperatingSystems.indexOf(selectedAccessOs),
                    }}
                  >
                    {accessOperatingSystems.map((os) => (
                      <button
                        key={os}
                        type='button'
                        className={selectedAccessOs === os ? 'active' : ''}
                        onClick={() => setSelectedAccessOs(os)}
                      >
                        {os}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isCcSwitchSelected ? (
                <div className='classic-home-v2-access-config classic-home-v2-access-launch'>
                  <div className='classic-home-v2-access-targets'>
                    <span>{t('导入到')}</span>
                    <div
                      className='classic-home-v2-access-segment'
                      style={{
                        '--segment-count': ccSwitchTargets.length,
                        '--segment-index': ccSwitchTargets.findIndex(
                          (target) => target.value === selectedCcSwitchTarget,
                        ),
                      }}
                    >
                      {ccSwitchTargets.map((target) => (
                        <button
                          key={target.value}
                          type='button'
                          className={
                            selectedCcSwitchTarget === target.value
                              ? 'active'
                              : ''
                          }
                          onClick={() =>
                            setSelectedCcSwitchTarget(target.value)
                          }
                        >
                          {target.label}
                        </button>
                      ))}
                    </div>
                    <small>{t('可在 CC Switch 内继续调整副模型。')}</small>
                  </div>

                  <div>
                    <span>{t('唤起软件配置')}</span>
                    <div className='classic-home-v2-access-config-actions'>
                      <Button
                        theme='solid'
                        type='primary'
                        onClick={() => {
                          window.location.href = ccSwitchUrl;
                        }}
                      >
                        {t('打开 CC Switch')}
                      </Button>
                      <span className='classic-home-v2-access-download-label'>
                        {t('没装先下载')}
                      </span>
                      {ccSwitchDownloadPlatforms.map((platform) => (
                        <Button
                          key={platform}
                          onClick={() =>
                            window.open(ccSwitchLatestReleaseUrl, '_blank')
                          }
                        >
                          {platform}
                        </Button>
                      ))}
                      <Button
                        icon={<Copy size={15} />}
                        onClick={handleCopyCcSwitchUrl}
                      >
                        {t('复制唤起链接')}
                      </Button>
                    </div>
                  </div>
                  <p>{t('如果没有自动打开，请先安装 CC Switch。')}</p>
                  <a
                    className='classic-home-v2-access-project'
                    href={ccSwitchProjectUrl}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {t('项目主页')}: farion1231/cc-switch
                  </a>
                  <div className='classic-home-v2-access-notice mt-2'>
                    {hasResolvedAccessApiKey
                      ? t('已使用你的可用 API Key。')
                      : t(
                          '首页展示的是占位 Key。登录后到 Key 管理页可以把真实 Key 一键导入 CC Switch。',
                        )}
                  </div>
                </div>
              ) : isCursorSelected ? (
                <div className='classic-home-v2-access-manual'>
                  <h3>{t('Cursor 需要手动配置（约 1 分钟）')}</h3>
                  <ol>
                    <li>{t('打开 Cursor 设置，进入 Settings → Models。')}</li>
                    <li>{t('启用 Override OpenAI Base URL。')}</li>
                    <li>{t('把下面的 Base URL、API Key 和 Model 填进去。')}</li>
                    <li>{t('在顶部模型选择里选择你要使用的模型。')}</li>
                  </ol>
                  <div className='classic-home-v2-access-manual-fields'>
                    {cursorConfigFields.map((field) => (
                      <div key={field.label}>
                        <span>{field.label}</span>
                        <code>{field.value}</code>
                        <Button
                          theme='solid'
                          type='primary'
                          icon={<Copy size={15} />}
                          onClick={() => handleCopyCursorValue(field.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className='classic-home-v2-access-notice'>
                    {hasResolvedAccessApiKey
                      ? t('已使用你的可用 API Key。')
                      : t('登录后到 Key 管理页可以自动填入你的真实 Key。')}
                  </div>
                </div>
              ) : (
                <div className='classic-home-v2-access-config'>
                  <div>
                    <span>{t('脚本文件')}</span>
                    <div className='classic-home-v2-access-config-actions'>
                      <Button onClick={handleDownloadAccessScript}>
                        {t('下载脚本')}
                      </Button>
                      <Button
                        theme='solid'
                        type='primary'
                        icon={<Copy size={15} />}
                        onClick={handleCopyAccessScript}
                      >
                        {t('复制脚本')}
                      </Button>
                    </div>
                  </div>
                  <div className='classic-home-v2-access-script-meta'>
                    <span>{t('文件名')}</span>
                    <strong>{accessScriptFileName}</strong>
                  </div>
                  <div className='classic-home-v2-access-run-command'>
                    <span>{t('运行命令')}</span>
                    <code>{accessScriptRunCommand}</code>
                  </div>
                  <pre>{accessScript}</pre>
                </div>
              )}
            </Modal>
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
