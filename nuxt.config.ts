// Polyfill modern Set methods for Node < 22 (required by postcss-merge-longhand / cssnano)
if (typeof Set !== 'undefined') {
  if (!(Set.prototype as any).isSubsetOf) {
    (Set.prototype as any).isSubsetOf = function(other: Set<any>) {
      for (const elem of this) {
        if (!other.has(elem)) return false;
      }
      return true;
    };
  }
  if (!(Set.prototype as any).isSupersetOf) {
    (Set.prototype as any).isSupersetOf = function(other: Set<any>) {
      for (const elem of other) {
        if (!this.has(elem)) return false;
      }
      return true;
    };
  }
  if (!(Set.prototype as any).intersection) {
    (Set.prototype as any).intersection = function(other: Set<any>) {
      const result = new Set();
      for (const elem of this) {
        if (other.has(elem)) result.add(elem);
      }
      return result;
    };
  }
  if (!(Set.prototype as any).union) {
    (Set.prototype as any).union = function(other: Set<any>) {
      const result = new Set(this);
      for (const elem of other) result.add(elem);
      return result;
    };
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },
  app: {
    head: {
      title: 'Photobooth HUT RI ke-81 - Pesona Cilebut 1',
      meta: [
        { name: 'description', content: 'Photobooth Virtual Peringatan HUT ke-81 Kemerdekaan RI 2026: Indonesia Berdaulat, Adil, dan Makmur. Abadikan momen pesta kemerdekaan warga Pesona Cilebut 1.' },
        { name: 'theme-color', content: '#DC2626' },
        { property: 'og:title', content: 'Photobooth HUT RI ke-81 - Pesona Cilebut 1' },
        { property: 'og:description', content: 'Abadikan momen 17-an bareng warga Pesona Cilebut 1. Pilih bingkai, jepret, simpan, bagikan!' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&display=swap'
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        }
      ]
    }
  },
  nitro: {
    // Otomatis mendeteksi provider (Netlify, Vercel, Cloudflare Pages, atau Node)
  }
})
