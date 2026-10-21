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
  purposes?: string[];
  tags?: string[];
  features?: string[];
  software?: string[];
  license?: string;
  dimensions?: string;
  print_notes?: string;
  file_contents?: string;
}

export type SortOption = 'date' | 'name' | 'size';
