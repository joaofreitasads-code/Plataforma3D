import categoriesData from './categories.json';

export interface Category {
  id: string;
  title: string;
  image: string;
  filterQuery: string;
  sectionId?: string;
  count: number;
}

export const CATEGORIES: Category[] = categoriesData as Category[];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function searchCategories(query: string): Category[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATEGORIES;
  return CATEGORIES.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.filterQuery.toLowerCase().includes(q)
  );
}
