import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'KecyAI Robotik Wiki',
  tagline: 'Türkçe robotik ve ROS 2 dokümantasyonu',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://furkanbsk.online',
  baseUrl: '/',

  organizationName: 'furkanbsk',
  projectName: 'kecy_docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      // NVIDIA kaynağında bazı eski `images/...` yolları 404 — build'i
      // kırmak yerine uyarıya indirelim. Ayrıca converter bu durumları
      // loglayıp bozuk img etiketlerini düşürüyor.
      onBrokenMarkdownImages: 'warn',
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'tr',
    locales: ['tr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Robotik Wiki',
      logo: {
        alt: 'KecyAI',
        src: 'img/kecy-ai-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Dokümanlar',
        },
        {
          href: 'https://github.com/furkanbsk/kecy_docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Dokümanlar',
          items: [
            {label: 'Giriş', to: '/'},
            {
              label: 'GitHub',
              href: 'https://github.com/furkanbsk/kecy_docs',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} KecyAI. Docusaurus ile yapıldı.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
