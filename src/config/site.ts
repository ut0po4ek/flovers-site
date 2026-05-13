export const siteConfig = {
  name: 'FLOVERS',
  shortName: 'FLOVERS',
  description: 'Авторские букеты, сезонные композиции и доставка цветов.',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: 'https://example.com',
  year: new Date().getFullYear(),

  contacts: {
    email: 'hello@flovers.ru',
    phone: '+7 900 123-45-67',
    address: 'Москва, ул. Цветочная, 12',
    telegram: '#',
    whatsapp: '#',
    instagram: '#',
  },

  nav: [
    { label: 'О нас',    href: '/#about' },
    { label: 'Каталог',  href: '/catalog' },
    { label: 'Доставка', href: '/#delivery' },
    { label: 'FAQ',      href: '/#faq' },
    { label: 'Контакты', href: '/#contacts' },
  ],

  cta: {
    label: 'Заказать',
    href: '/catalog',
  },

  footer: {
    tagline: 'Авторские букеты, сезонные композиции и бережная доставка цветов.',
    ctaText: 'Расскажите, для кого букет — соберём под настроение и повод.',
    privacyHref: '/privacy',
  },

  seo: {
    ogImage: '/og-image.jpg',
  },
};
