import { Model, SortOption } from '../../types/model';
import { categories, findCategory } from './categories';

export const filterKeys = [
  'q',
  'category',
  'purpose',
  'format',
  'feature',
  'license',
  'software',
  'sort',
] as const;
export type FilterKey = (typeof filterKeys)[number];
export interface CatalogFilters {
  q: string;
  category: string;
  purpose: string;
  format: string;
  feature: string;
  license: string;
  software: string;
  sort: SortOption;
}
export function readFilters(
  query: Record<string, string | string[] | undefined>,
): CatalogFilters {
  const value = (key: string) =>
    typeof query[key] === 'string' ? (query[key] as string) : '';
  const sort = value('sort');
  return {
    q: value('q'),
    category: value('category'),
    purpose: value('purpose'),
    format: value('format'),
    feature: value('feature'),
    license: value('license'),
    software: value('software'),
    sort: sort === 'name' || sort === 'size' ? sort : 'date',
  };
}
export const normalizeSearch = (value: string) =>
  value.toLocaleLowerCase().replace(/ё/g, 'е').replace(/[-_]/g, ' ').trim();
const synonyms = [
  ['телефон', 'смартфон', 'phone', 'smartphone'],
  ['держатель', 'подставка', 'holder', 'stand'],
  ['шестерня', 'шестерни', 'gear', 'gears'],
  ['кашпо', 'горшок', 'planter', 'pot'],
  ['автомобиль', 'машина', 'car', 'vehicle'],
  ['новогоднее', 'новый год', 'christmas', 'xmas'],
  ['органайзер', 'organizer', 'organiser'],
];
export function matchesSearch(model: Model, search: string) {
  const category = findCategory(model.category);
  const haystack = normalizeSearch(
    [
      model.name,
      model.description,
      ...(model.tags || []),
      model.category,
      category?.ru,
      category?.en,
      category?.detail,
      category?.detailEn,
    ]
      .filter(Boolean)
      .join(' '),
  );
  return normalizeSearch(search)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => {
      const alternatives = synonyms.find((group) => group.includes(term)) || [
        term,
      ];
      return alternatives.some((alternative) => haystack.includes(alternative));
    });
}
export function filterModels(
  models: Model[],
  filters: CatalogFilters,
  categorySlug?: string,
) {
  const category = findCategory(categorySlug || filters.category);
  return models
    .filter(
      (model) =>
        matchesSearch(model, filters.q) &&
        (!(categorySlug || filters.category) ||
          (category
            ? findCategory(model.category)?.slug === category.slug
            : model.category === filters.category)) &&
        (!filters.format || model.format === filters.format) &&
        (!filters.purpose || model.purposes?.includes(filters.purpose)) &&
        (!filters.feature || model.features?.includes(filters.feature)) &&
        (!filters.license || model.license === filters.license) &&
        (!filters.software || model.software?.includes(filters.software)),
    )
    .sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name, 'ru');
      if (filters.sort === 'size')
        return (a.file_size || 0) - (b.file_size || 0);
      return (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0);
    });
}
export function categoryCounts(models: Model[]) {
  const counts = Object.fromEntries(
    categories.map((category) => [category.slug, 0]),
  );
  for (const model of models) {
    const category = findCategory(model.category);
    if (category) counts[category.slug]++;
  }
  return counts;
}
