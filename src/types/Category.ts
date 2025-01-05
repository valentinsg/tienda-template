export interface Category {
  toLowerCase(): unknown;
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}