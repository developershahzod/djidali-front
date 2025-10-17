import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'hunting',
    name: 'Охота',
    slug: 'hunting',
    subcategories: [
      { id: 'big-game', name: 'Крупная дичь', slug: 'big-game' },
      { id: 'bird-hunting', name: 'Охота на птиц', slug: 'bird-hunting' },
      { id: 'small-game', name: 'Мелкая дичь', slug: 'small-game' },
      { id: 'waterfowl', name: 'Водоплавающая дичь', slug: 'waterfowl' },
      { id: 'predator-hunting', name: 'Охота на хищников', slug: 'predator-hunting' },
      { id: 'sport-shooting', name: 'Спортивная стрельба', slug: 'sport-shooting' }
    ]
  }
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};

export const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string) => {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories?.find(sub => sub.slug === subcategorySlug);
};