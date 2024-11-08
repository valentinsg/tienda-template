export interface Category {
  id: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  meta_title?: string;
  meta_description?: string;
  parent?: number | null;
}