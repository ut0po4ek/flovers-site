export interface Bouquet {
  id: string;
  slug: string;
  title: string;
  category: 'roses' | 'peonies' | 'seasonal' | 'mono' | 'gift';
  categoryLabel: string;
  price: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  composition: string[];
  size: string;
  care: string[];
  delivery: string;
  badge?: string;
  isBestseller?: boolean;
}

export const bouquets: Bouquet[] = [
  {
    id: 'dolce-rose',
    slug: 'dolce-rose',
    title: 'Dolce Rose',
    category: 'roses',
    categoryLabel: 'Розы',
    price: '4 900 ₽',
    shortDescription: 'Нежный букет из садовых роз в пыльно-розовых и персиковых оттенках.',
    description: 'Авторский букет из садовых роз сортов Jumilia и Ohara в пыльно-розовых и персиковых тонах. Каждый цветок подбирается вручную, упаковка — крафт с лентой. Подходит для романтических поводов, дней рождения и просто так.',
    image: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?ixlib=rb-4.1.0&w=900&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?ixlib=rb-4.1.0&w=1400&q=82&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1680563899402-26c3a712831f?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613052271194-5427710fb39d?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    ],
    composition: ['Роза Jumilia — 7 шт', 'Роза Ohara — 5 шт', 'Эвкалипт — 3 ветки', 'Питтоспорум — 2 ветки'],
    size: 'Средний, 35–40 см',
    care: [
      'Подрезайте стебли под углом каждые 2 дня',
      'Меняйте воду ежедневно',
      'Держите вдали от прямых солнечных лучей и сквозняков',
      'Оптимальная температура — 16–20 °C',
    ],
    delivery: 'В течение 1–3 часов по Москве',
    badge: 'Хит',
    isBestseller: true,
  },
  {
    id: 'malina',
    slug: 'malina',
    title: 'Malina',
    category: 'roses',
    categoryLabel: 'Розы',
    price: '5 500 ₽',
    shortDescription: 'Яркий букет из алых и малиновых роз — страстный и запоминающийся.',
    description: 'Насыщенный букет из бархатистых роз в малиновых и тёмно-красных оттенках. Классика флористики в авторском исполнении — лаконично, дерзко и красиво. Идеален для признаний и ярких поводов.',
    image: 'https://images.unsplash.com/photo-1684826120615-09297bfa5495?ixlib=rb-4.1.0&w=900&q=80&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1684826120615-09297bfa5495?ixlib=rb-4.1.0&w=1400&q=82&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1673026448806-6d6c00bbba29?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1673026190548-c95adc90ef60?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    ],
    composition: ['Роза Red Explorer — 9 шт', 'Роза Black Baccara — 4 шт', 'Зелень ростки — 5 шт'],
    size: 'Средний, 38–42 см',
    care: [
      'Подрезайте стебли под углом каждые 2 дня',
      'Меняйте воду ежедневно',
      'Держите в прохладе',
    ],
    delivery: 'В течение 1–3 часов по Москве',
    isBestseller: true,
  },
  {
    id: 'felicia',
    slug: 'felicia',
    title: 'Felicia',
    category: 'gift',
    categoryLabel: 'Подарочные',
    price: '7 200 ₽',
    shortDescription: 'Пышный подарочный букет с розами, пионовидными гвоздиками и зеленью.',
    description: 'Щедрый подарочный букет с нежными розами, пионовидными гвоздиками и декоративной зеленью. Упаковка — матовая бумага и атласная лента. Подходит для праздников, юбилеев и корпоративных подарков.',
    image: 'https://images.unsplash.com/photo-1613052271194-5427710fb39d?ixlib=rb-4.1.0&w=900&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1613052271194-5427710fb39d?ixlib=rb-4.1.0&w=1400&q=82&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1680563899402-26c3a712831f?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    ],
    composition: ['Роза Sweet Avalanche — 5 шт', 'Гвоздика пионовидная — 6 шт', 'Лизиантус — 4 шт', 'Эвкалипт — 4 ветки'],
    size: 'Большой, 45–50 см',
    care: [
      'Подрезайте стебли под углом',
      'Меняйте воду каждые 1–2 дня',
      'Избегайте фруктов рядом — этилен ускоряет увядание',
    ],
    delivery: 'В течение 1–3 часов по Москве',
    badge: 'Новинка',
    isBestseller: true,
  },
  {
    id: 'ivory-garden',
    slug: 'ivory-garden',
    title: 'Ivory Garden',
    category: 'seasonal',
    categoryLabel: 'Сезонные',
    price: '6 800 ₽',
    shortDescription: 'Воздушный сезонный букет в молочно-белых и кремовых тонах.',
    description: 'Лёгкий и воздушный букет из белых и кремовых цветов — ранункулюсов, анемонов и мимозы. Передаёт настроение ранней весны. Подходит для тематических свадеб и нежных поводов.',
    image: 'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?ixlib=rb-4.1.0&w=900&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?ixlib=rb-4.1.0&w=1400&q=82&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484676681417-64a0ea3475fd?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    ],
    composition: ['Ранункулюс белый — 7 шт', 'Анемон — 5 шт', 'Мимоза — 3 ветки', 'Гипсофила — 2 ветки'],
    size: 'Средний, 35–40 см',
    care: [
      'Держите в прохладе — не выше 18 °C',
      'Подрезайте стебли каждые 2 дня',
      'Избегайте прямых солнечных лучей',
    ],
    delivery: 'В течение 1–3 часов по Москве',
  },
  {
    id: 'pink-mood',
    slug: 'pink-mood',
    title: 'Pink Mood',
    category: 'peonies',
    categoryLabel: 'Пионы',
    price: '8 500 ₽',
    shortDescription: 'Роскошный букет из розовых пионов — пышный, ароматный, праздничный.',
    description: 'Пышный сезонный букет из розовых пионов сорта Sarah Bernhardt и Bowl of Beauty. Аромат — сильный, сладкий. Каждый пион — крупный и плотный. Подходит для особых поводов и юбилеев.',
    image: 'https://images.unsplash.com/photo-1558021843-f9ab317ed0eb?ixlib=rb-4.1.0&w=900&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1558021843-f9ab317ed0eb?ixlib=rb-4.1.0&w=1400&q=82&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1750277543474-18208d3157c6?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498813569067-a4332afdfcf0?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    ],
    composition: ['Пион Sarah Bernhardt — 5 шт', 'Пион Bowl of Beauty — 4 шт', 'Питтоспорум — 3 ветки'],
    size: 'Большой, 40–45 см',
    care: [
      'Пионы в бутонах — держите в тёплой комнате для раскрытия',
      'Меняйте воду каждый день',
      'Подрезайте стебли наискось',
    ],
    delivery: 'В течение 2–4 часов по Москве (сезонный товар)',
  },
  {
    id: 'velvet-peony',
    slug: 'velvet-peony',
    title: 'Velvet Peony',
    category: 'peonies',
    categoryLabel: 'Пионы',
    price: '9 200 ₽',
    shortDescription: 'Тёмно-бордовые пионы для тех, кто ценит глубину и характер.',
    description: 'Тёмно-бордовые пионы с бархатистыми лепестками — редкий и эффектный выбор. Букет производит сильное впечатление, подходит для торжественных поводов и ценителей необычных цветов.',
    image: 'https://images.unsplash.com/photo-1750568894857-22ff6af386ef?ixlib=rb-4.1.0&w=900&q=80&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1750568894857-22ff6af386ef?ixlib=rb-4.1.0&w=1400&q=82&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1759145799275-b5211732fe16?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1673026448806-6d6c00bbba29?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    ],
    composition: ['Пион Red Charm — 7 шт', 'Пион Karl Rosenfield — 3 шт', 'Лавровишня — 3 ветки'],
    size: 'Большой, 42–48 см',
    care: [
      'Держите в прохладе для более долгого цветения',
      'Меняйте воду каждый день',
      'Подрезайте стебли каждые 2 дня',
    ],
    delivery: 'В течение 2–4 часов по Москве (сезонный товар)',
  },
  {
    id: 'morning-blush',
    slug: 'morning-blush',
    title: 'Morning Blush',
    category: 'mono',
    categoryLabel: 'Монобукеты',
    price: '3 800 ₽',
    shortDescription: 'Нежный монобукет из кремовых тюльпанов — лёгкость весеннего утра.',
    description: 'Простой и изысканный монобукет из кремово-розовых тюльпанов. Минимализм и чистота формы. Идеален для тех, кто ценит сдержанную элегантность. Доступный вариант без потери в качестве.',
    image: 'https://images.unsplash.com/photo-1710077339692-cfb118eb361e?ixlib=rb-4.1.0&w=900&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1710077339692-cfb118eb361e?ixlib=rb-4.1.0&w=1400&q=82&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1768448581878-b52637049bda?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    ],
    composition: ['Тюльпан кремово-розовый — 15 шт'],
    size: 'Стандарт, 30–35 см',
    care: [
      'Тюльпаны продолжают расти в вазе — обрезайте стебли',
      'Меняйте воду каждый день',
      'Держите в прохладе',
    ],
    delivery: 'В течение 1–2 часов по Москве',
  },
  {
    id: 'wild-romance',
    slug: 'wild-romance',
    title: 'Wild Romance',
    category: 'seasonal',
    categoryLabel: 'Сезонные',
    price: '5 500 ₽',
    shortDescription: 'Букет-сюрприз из сезонных полевых цветов с диким, живым настроением.',
    description: 'Авторский сезонный букет из полевых и садовых цветов — каждый раз разный состав в зависимости от урожая. Живой, непредсказуемый, пахнущий летом. Для тех, кто ценит натуральность.',
    image: 'https://images.unsplash.com/photo-1678880032208-aef80e10a57d?ixlib=rb-4.1.0&w=900&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1678880032208-aef80e10a57d?ixlib=rb-4.1.0&w=1400&q=82&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1677607786688-95b18f64a37d?ixlib=rb-4.1.0&w=1000&q=78&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop',
    ],
    composition: ['Состав — сезонный, определяется в день сборки', 'Злаки, полевые цветы, декоративная зелень'],
    size: 'Средний, 35–45 см',
    care: [
      'Подрезайте стебли под углом',
      'Меняйте воду каждые 1–2 дня',
    ],
    delivery: 'В течение 1–3 часов по Москве',
  },
];

export function getBouquetBySlug(slug: string): Bouquet | undefined {
  return bouquets.find(b => b.slug === slug);
}

export function getRelatedBouquets(currentSlug: string, count = 3): Bouquet[] {
  return bouquets.filter(b => b.slug !== currentSlug).slice(0, count);
}

export function getBestsellers(): Bouquet[] {
  return bouquets.filter(b => b.isBestseller === true);
}
