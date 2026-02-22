import { Category } from '@/types';

export interface Project {
  id: string;
  title: string;
  category: Category;
  cloudinaryId: string;
  description?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Philips Workshop',
    category: 'doodle',
    cloudinaryId: 'arne-portfolio/projects/doodle/philips_01',
    description: 'Live visualisatie tijdens een innovatie-sessie.'
  },
  // Voeg hier later meer toe
];
