export const categories = [
  {
    slug: 'architecture',
    ru: 'Архитектура',
    en: 'Architecture',
    detail: 'Здания, пространства и города',
    detailEn: 'Buildings, spaces and cities',
  },
  {
    slug: 'home',
    ru: 'Для дома',
    en: 'For home',
    detail: 'Полезные вещи для вашего пространства',
    detailEn: 'Useful things for your space',
  },
  {
    slug: 'decor',
    ru: 'Декор',
    en: 'Decor',
    detail: 'Детали, которые создают настроение',
    detailEn: 'Details that set the mood',
  },
  {
    slug: 'toys',
    ru: 'Игрушки',
    en: 'Toys',
    detail: 'Большие идеи для маленьких открытий',
    detailEn: 'Big ideas for little discoveries',
  },
  {
    slug: 'animals',
    ru: 'Животные',
    en: 'Animals',
    detail: 'Вдохновлено миром природы',
    detailEn: 'Inspired by the natural world',
  },
  {
    slug: 'games',
    ru: 'Игры',
    en: 'Games',
    detail: 'Персонажи, миры и игровые объекты',
    detailEn: 'Characters, worlds and game assets',
  },
] as const;

export type Category = (typeof categories)[number];
export const formats = ['OBJ', 'FBX', 'GLTF', 'GLB', 'STL', 'ZIP'];
export const categoryLabel = (name: string, lang: 'ru' | 'en') =>
  categories.find((category) => category.ru === name)?.[lang] || name;
