import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import starlight from "@astrojs/starlight";
import vercel from "@astrojs/vercel/serverless";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: "https://calarasiwarriors.club",
  image: {
    domains: ["images.unsplash.com", "img.youtube.com", "res.cloudinary.com"],
  },
  // i18n: {
  //   defaultLocale: "en",
  //   locales: ["en", "fr"],
  //   fallback: {
  //     fr: "en",
  //   },
  //   routing: {
  //     prefixDefaultLocale: false,
  //   },
  // },
  prefetch: true,
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en", // All urls that don't contain language prefix will be treated as default locale
        locales: {
          en: "en", // The `defaultLocale` value must present in `locales` keys
          fr: "fr",
        },
      },
    }),
    starlight({
      title: "Calarasi Warriors Docs",
      // https://github.com/withastro/starlight/blob/main/packages/starlight/CHANGELOG.md
      // If no Astro and Starlight i18n configurations are provided, the built-in default locale is used in Starlight and a matching Astro i18n configuration is generated/used.
      // If only a Starlight i18n configuration is provided, an equivalent Astro i18n configuration is generated/used.
      // If only an Astro i18n configuration is provided, the Starlight i18n configuration is updated to match it.
      // If both an Astro and Starlight i18n configurations are provided, an error is thrown.
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        de: { label: "Deutsch", lang: "de" },
        es: { label: "Español", lang: "es" },
        fa: { label: "Persian", lang: "fa", dir: "rtl" },
        fr: { label: "Français", lang: "fr" },
        ja: { label: "日本語", lang: "ja" },
        "zh-cn": { label: "简体中文", lang: "zh-CN" },
      },
      // https://starlight.astro.build/guides/sidebar/
      sidebar: [
        {
          label: "Site Navigation",
          items: [
            { label: "Acasă", link: "https://calarasiwarriors.club/" },
            { label: "Despre noi", link: "https://calarasiwarriors.club/aboutUs" },
            { label: "Proiecte trecute", link: "https://calarasiwarriors.club/past-projects" },
            { label: "Viziune și scop", link: "https://calarasiwarriors.club/ourVision" },
            { label: "Știri/Podcast", link: "https://calarasiwarriors.club/news" },
            { label: "Contact", link: "https://calarasiwarriors.club/contact" },
          ],
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/calarasiwarriors/calarasi-warriors",
        },
      ],
      disable404Route: true,
      customCss: ["./src/assets/styles/starlight.css"],
      favicon: "/favicon.ico",
      components: {
        SiteTitle: "./src/components/ui/starlight/SiteTitle.astro",
        Head: "./src/components/ui/starlight/Head.astro",
        MobileMenuFooter:
          "./src/components/ui/starlight/MobileMenuFooter.astro",
        ThemeSelect: "./src/components/ui/starlight/ThemeSelect.astro",
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://calarasiwarriors.club" + "/social.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "twitter:image",
            content: "https://calarasiwarriors.club" + "/social.png",
          },
        },
      ],
    }),
    compressor({
      gzip: false,
      brotli: true,
    }),
    mdx(),
    react(),
  ],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.astro'],
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@data': '/src/data_files',
        '@images': '/src/images',
        '@utils': '/src/utils'
      }
    },
    server: {
      headers: {
        'Content-Security-Policy': "img-src 'self' data: https: http: blob: res.cloudinary.com img.youtube.com; default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
      }
    },
    ssr: {
      noExternal: ['@astrojs/vercel']
    }
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
    includeFiles: [
      "migrations",
      "knexfile.cjs",
      "database.mjs"
    ]
  }),
});
