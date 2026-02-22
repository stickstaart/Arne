export type Category = 'doodle' | 'wildkunst';

export interface CloudinaryResource {
  publicId: string;
  width: number;
  height: number;
  title?: string;
}

export interface Project {
  id: string;
  title: string;
  category: Category;
  cloudinaryId: string;
  description?: string;
}

export interface ProjectPreview extends Pick<Project, 'id' | 'title' | 'category' | 'cloudinaryId'> {}
