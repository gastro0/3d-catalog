export interface Model {
    id: string;
    name: string;
    format: string;
    polygons: number;
    imageUrl?: string;
    category?: string;
}

export interface CategoryType {
    name: string;
    gradient: string;
}

export type SortOption = "date" | "popularity" | "size";
