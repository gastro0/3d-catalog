export interface Model {
  id: string;
  name: string;
  description: string;
  format: string;
  polygons: number;
  imageUrl: string | null;
  category: string;
  file_size: number;
  created_at: string;
  owner_id: string | null;
}

export type SortOption = 'date' | 'name' | 'size';
