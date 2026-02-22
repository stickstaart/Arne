'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Haalt afbeeldingen op basis van de tag (bijv. 'logo')
export async function getImagesByTag(tagName: string) {
  try {
    const results = await cloudinary.api.resources_by_tag(tagName, {
      max_results: 100,
      context: true, // Zorgt dat we metadata zoals captions meekrijgen
    });

    console.log(`Cloudinary: ${results.resources.length} items gevonden met tag '${tagName}'`);

    return results.resources.map((resource: any) => ({
      publicId: resource.public_id,
      width: resource.width,
      height: resource.height,
      title: resource.context?.custom?.caption || resource.public_id.split('/').pop()?.split('_')[0] || 'Werk',
    }));
  } catch (error) {
    console.error(`Fout bij ophalen tag ${tagName}:`, error);
    return [];
  }
}

// Deze functies roepen nu de algemene tag-functie aan
export async function getImagesFromFolder() {
  return getImagesByTag('logo');
}

export async function getPortfolioImages() {
  return getImagesByTag('portfolio-item');
}
