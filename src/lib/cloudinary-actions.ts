'use server'

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResource } from '@/types';

const CLOUDINARY_CONFIG = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
};

cloudinary.config(CLOUDINARY_CONFIG);

const DEFAULT_FOLDER = 'arne-portfolio';

/**
 * Fetch all resources from a specific Cloudinary folder.
 */
export async function getResourcesFromFolder(folderPath: string = ''): Promise<CloudinaryResource[]> {
  try {
    const results = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 50,
      context: true,
    });

    return results.resources.map((resource: any) => ({
      publicId: resource.public_id,
      width: resource.width,
      height: resource.height,
      title: resource.context?.custom?.caption || 'Portfolio werk',
    }));
  } catch (error) {
    console.error(`CLOUDINARY ERROR (folder: ${folderPath}):`, error);
    return [];
  }
}

/**
 * Specifically fetch portfolio images for a given category.
 */
export async function getPortfolioImages(category: string): Promise<CloudinaryResource[]> {
  const folder = `${DEFAULT_FOLDER}/projects/${category}`;
  return getResourcesFromFolder(folder);
}

/**
 * Fetch logos for the LogoStrip.
 */
export async function getLogoResources(): Promise<CloudinaryResource[]> {
  // Assuming logos are in a specific folder or have a naming convention
  const allImages = await getResourcesFromFolder(DEFAULT_FOLDER);
  return allImages.filter((img) =>
    img.publicId.toLowerCase().includes('logo') ||
    img.publicId.toLowerCase().includes('pica')
  );
}
