import type { IconName } from '../../components/ui/Icon';

export interface Category {
  slug: string;
  ru: string;
  en: string;
  detail: string;
  detailEn: string;
  icon: IconName;
  aliases: readonly string[];
}

export const categories: readonly Category[] = [
  {
    slug: 'home',
    ru: 'Дом и быт',
    en: 'Home & living',
    detail: 'Кухня, ванная, садоводство и вещи для питомцев',
    detailEn: 'Kitchen, bathroom, gardening and pet accessories',
    icon: 'home',
    aliases: ['Для дома'],
  },
  {
    slug: 'organizers',
    ru: 'Органайзеры и хранение',
    en: 'Organization & storage',
    detail: 'Контейнеры, разделители, хранение инструментов и проводов',
    detailEn: 'Containers, dividers, tool storage and cable management',
    icon: 'storage',
    aliases: [],
  },
  {
    slug: 'decor',
    ru: 'Декор и освещение',
    en: 'Decor & lighting',
    detail: 'Вазы, светильники, абажуры и настенный декор',
    detailEn: 'Vases, lamps, lampshades and wall art',
    icon: 'lamp',
    aliases: ['Декор'],
  },
  {
    slug: 'tools',
    ru: 'Инструменты и мастерская',
    en: 'Tools & workshop',
    detail: 'Зажимы, шаблоны, кондукторы и измерительная оснастка',
    detailEn: 'Clamps, templates, jigs and measuring tools',
    icon: 'tool',
    aliases: [],
  },
  {
    slug: 'parts',
    ru: 'Запчасти и механизмы',
    en: 'Parts & mechanisms',
    detail: 'Шестерни, петли, ручки, переходники и крепёж',
    detailEn: 'Gears, hinges, handles, adapters and fasteners',
    icon: 'gear',
    aliases: [],
  },
  {
    slug: '3d-printers',
    ru: 'Для 3D-принтеров',
    en: '3D printer accessories',
    detail: 'Держатели катушек, воздуховоды и калибровочные модели',
    detailEn: 'Spool holders, cooling ducts and calibration models',
    icon: 'printer',
    aliases: [],
  },
  {
    slug: 'electronics',
    ru: 'Электроника и гаджеты',
    en: 'Electronics & gadgets',
    detail: 'Корпуса плат, подставки для телефонов и крепления камер',
    detailEn: 'Circuit board cases, phone stands and camera mounts',
    icon: 'chip',
    aliases: [],
  },
  {
    slug: 'toys',
    ru: 'Игрушки и головоломки',
    en: 'Toys & puzzles',
    detail: 'Подвижные игрушки, конструкторы, антистресс и пазлы',
    detailEn: 'Articulated toys, building sets, fidgets and puzzles',
    icon: 'puzzle',
    aliases: ['Игрушки'],
  },
  {
    slug: 'games',
    ru: 'Настольные игры и миниатюры',
    en: 'Tabletop games & miniatures',
    detail: 'Игровые фигурки, ландшафт, жетоны и башни для кубиков',
    detailEn: 'Miniatures, terrain, tokens and dice towers',
    icon: 'dice',
    aliases: ['Игры'],
  },
  {
    slug: 'figurines',
    ru: 'Фигурки и скульптуры',
    en: 'Figurines & sculptures',
    detail: 'Персонажи, существа, бюсты и статуэтки',
    detailEn: 'Characters, creatures, busts and statues',
    icon: 'sculpture',
    aliases: [],
  },
  {
    slug: 'cosplay',
    ru: 'Косплей и реквизит',
    en: 'Cosplay & props',
    detail: 'Маски, шлемы, элементы костюмов и бутафория',
    detailEn: 'Masks, helmets, costume pieces and props',
    icon: 'mask',
    aliases: [],
  },
  {
    slug: 'jewelry',
    ru: 'Украшения и аксессуары',
    en: 'Jewelry & accessories',
    detail: 'Кольца, серьги, кулоны, браслеты и брелоки',
    detailEn: 'Rings, earrings, pendants, bracelets and keychains',
    icon: 'gem',
    aliases: [],
  },
  {
    slug: 'architecture',
    ru: 'Архитектура и макеты',
    en: 'Architecture & scale models',
    detail: 'Здания, достопримечательности и городские макеты',
    detailEn: 'Buildings, landmarks and city models',
    icon: 'building',
    aliases: ['Архитектура'],
  },
  {
    slug: 'transport',
    ru: 'Транспорт и моделизм',
    en: 'Vehicles & scale modeling',
    detail: 'Машины, самолёты, корабли, поезда и радиомодели',
    detailEn: 'Cars, aircraft, ships, trains and RC models',
    icon: 'car',
    aliases: ['Транспорт'],
  },
  {
    slug: 'outdoors',
    ru: 'Спорт и активный отдых',
    en: 'Sports & outdoors',
    detail: 'Аксессуары для велосипеда, походов и рыбалки',
    detailEn: 'Cycling, camping, fishing and sports accessories',
    icon: 'mountain',
    aliases: [],
  },
  {
    slug: 'science',
    ru: 'Обучение и наука',
    en: 'Education & science',
    detail: 'Анатомия, геометрия, молекулы и учебные механизмы',
    detailEn: 'Anatomy, geometry, molecules and learning mechanisms',
    icon: 'science',
    aliases: [],
  },
  {
    slug: 'animals',
    ru: 'Животные',
    en: 'Animals',
    detail: 'Цифровые модели животных, птиц и морских обитателей',
    detailEn: 'Digital models of animals, birds and marine life',
    icon: 'paw',
    aliases: [],
  },
  {
    slug: 'furniture',
    ru: 'Мебель',
    en: 'Furniture',
    detail: 'Стулья, столы, диваны и мебель для интерьерных сцен',
    detailEn: 'Chairs, tables, sofas and furniture for interior scenes',
    icon: 'chair',
    aliases: [],
  },
  {
    slug: 'plants',
    ru: 'Растения',
    en: 'Plants',
    detail: 'Цифровые деревья, цветы, кустарники и комнатные растения',
    detailEn: 'Digital trees, flowers, shrubs and houseplants',
    icon: 'plant',
    aliases: [],
  },
];

export const formats = ['OBJ', 'FBX', 'GLTF', 'GLB', 'STL', 'ZIP'];
export const findCategory = (name: string) =>
  categories.find(
    (category) =>
      category.ru === name ||
      category.aliases.includes(name) ||
      category.slug === name,
  );
export const categoryLabel = (name: string, lang: 'ru' | 'en') =>
  findCategory(name)?.[lang] || name;

export const purposes = [
  { value: 'printing', ru: 'Для 3D-печати', en: '3D printing' },
  {
    value: 'visualization',
    ru: 'Для игр и визуализации',
    en: 'Games & visualization',
  },
  { value: 'engineering', ru: 'Для проектирования', en: 'Engineering & CAD' },
] as const;
export const features = [
  { value: 'support-free', ru: 'Без поддержек', en: 'Support-free' },
  { value: 'articulated', ru: 'Подвижная модель', en: 'Articulated' },
  { value: 'multicolor', ru: 'Многоцветная печать', en: 'Multicolor printing' },
  { value: 'assembly', ru: 'Требуется сборка', en: 'Assembly required' },
  { value: 'low-poly', ru: 'Low-poly', en: 'Low-poly' },
  { value: 'pbr', ru: 'PBR-текстуры', en: 'PBR textures' },
  { value: 'rigged', ru: 'Скелет для анимации', en: 'Rigged' },
  { value: 'animated', ru: 'Готовая анимация', en: 'Animated' },
] as const;
export const licenses = [
  {
    value: 'CC0-1.0',
    ru: 'CC0 · общественное достояние',
    en: 'CC0 · public domain',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    value: 'CC-BY-4.0',
    ru: 'CC BY · с указанием автора',
    en: 'CC BY · attribution',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    value: 'CC-BY-SA-4.0',
    ru: 'CC BY-SA · на тех же условиях',
    en: 'CC BY-SA · share alike',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    value: 'CC-BY-NC-4.0',
    ru: 'CC BY-NC · некоммерческое использование',
    en: 'CC BY-NC · noncommercial',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
  },
] as const;
export const softwareOptions = [
  'Blender',
  '3ds Max',
  'Maya',
  'Cinema 4D',
  'Fusion',
  'SolidWorks',
  'FreeCAD',
  'SketchUp',
  'ZBrush',
];
export function metadataLabel(
  options: readonly { value: string; ru: string; en: string }[],
  value: string,
  lang: 'ru' | 'en',
) {
  return options.find((option) => option.value === value)?.[lang] || value;
}
