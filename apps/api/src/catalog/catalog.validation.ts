import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const CATEGORIES = [
  'Дом и быт',
  'Органайзеры и хранение',
  'Декор и освещение',
  'Инструменты и мастерская',
  'Запчасти и механизмы',
  'Для 3D-принтеров',
  'Электроника и гаджеты',
  'Игрушки и головоломки',
  'Настольные игры и миниатюры',
  'Фигурки и скульптуры',
  'Косплей и реквизит',
  'Украшения и аксессуары',
  'Архитектура и макеты',
  'Транспорт и моделизм',
  'Спорт и активный отдых',
  'Обучение и наука',
  'Животные',
  'Мебель',
  'Растения',
] as const;
const LEGACY_CATEGORIES: Record<string, string> = {
  Архитектура: 'Архитектура и макеты',
  'Для дома': 'Дом и быт',
  Декор: 'Декор и освещение',
  Игрушки: 'Игрушки и головоломки',
  Игры: 'Настольные игры и миниатюры',
  Транспорт: 'Транспорт и моделизм',
};
export const PURPOSES = ['printing', 'visualization', 'engineering'];
export const FEATURES = [
  'support-free',
  'articulated',
  'multicolor',
  'assembly',
  'low-poly',
  'pbr',
  'rigged',
  'animated',
];
export const LICENSES = [
  'CC0-1.0',
  'CC-BY-4.0',
  'CC-BY-SA-4.0',
  'CC-BY-NC-4.0',
];
export const SOFTWARE = [
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
export const FORMATS = ['OBJ', 'FBX', 'GLTF', 'GLB', 'STL', 'ZIP'] as const;

export interface ModelMetadata {
  name: string;
  description: string;
  category: string;
  polygons: number;
  purposes: string[];
  tags: string[];
  features: string[];
  software: string[];
  license: string;
  dimensions: string;
  print_notes: string;
  file_contents: string;
}

function text(body: Record<string, unknown>, key: string, maxLength: number) {
  const raw = body[key];
  if (raw !== undefined && typeof raw !== 'string')
    throw new BadRequestException(`Некорректное поле ${key}.`);
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (value.length > maxLength)
    throw new BadRequestException(
      `Поле ${key}: не более ${maxLength} символов.`,
    );
  return value;
}

function list(
  body: Record<string, unknown>,
  key: string,
  maxCount: number,
  allowed?: readonly string[],
) {
  let value = body[key] ?? [];
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      throw new BadRequestException(`Некорректный список ${key}.`);
    }
  }
  if (
    !Array.isArray(value) ||
    value.length > maxCount ||
    value.some(
      (item) =>
        typeof item !== 'string' ||
        !item.trim() ||
        item.length > 40 ||
        (allowed && !allowed.includes(item)),
    )
  ) {
    throw new BadRequestException(`Проверьте значения поля ${key}.`);
  }
  return [...new Set((value as string[]).map((item) => item.trim()))];
}

export function validateModelUpload(
  file: Express.Multer.File | undefined,
  body: Record<string, unknown>,
): ModelMetadata & { format: string } {
  if (!file?.buffer?.length)
    throw new BadRequestException('Выберите файл модели.');
  const format = extname(file.originalname).slice(1).toUpperCase();
  if (!FORMATS.some((allowed) => allowed === format)) {
    throw new BadRequestException(
      'Поддерживаются OBJ, FBX, GLTF, GLB, STL и ZIP.',
    );
  }
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const description =
    typeof body.description === 'string' ? body.description.trim() : '';
  const categoryName =
    typeof body.category === 'string' ? body.category.trim() : '';
  const category = Object.prototype.hasOwnProperty.call(
    LEGACY_CATEGORIES,
    categoryName,
  )
    ? LEGACY_CATEGORIES[categoryName]
    : categoryName;
  const polygons = Number(body.polygons || 0);
  if (!name || name.length > 120) {
    throw new BadRequestException(
      'Название должно содержать от 1 до 120 символов.',
    );
  }
  if (description.length > 5000) {
    throw new BadRequestException(
      'Описание не должно превышать 5000 символов.',
    );
  }
  if (!CATEGORIES.some((allowed) => allowed === category)) {
    throw new BadRequestException('Выберите категорию из списка.');
  }
  if (!Number.isSafeInteger(polygons) || polygons < 0) {
    throw new BadRequestException(
      'Количество полигонов должно быть целым неотрицательным числом.',
    );
  }
  const license = text(body, 'license', 40);
  if (license && !LICENSES.includes(license))
    throw new BadRequestException('Выберите лицензию из списка.');
  return {
    name,
    description,
    category,
    polygons,
    format,
    purposes: list(body, 'purposes', 3, PURPOSES),
    tags: list(body, 'tags', 12),
    features: list(body, 'features', 8, FEATURES),
    software: list(body, 'software', SOFTWARE.length, SOFTWARE),
    license,
    dimensions: text(body, 'dimensions', 160),
    print_notes: text(body, 'print_notes', 2000),
    file_contents: text(body, 'file_contents', 2000),
  };
}
