'use server'

import { v2 as cloudinary } from 'cloudinary'
import { unstable_noStore as noStore } from 'next/cache'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Haalt afbeeldingen op basis van de tag (bijv. 'portfolio-item' of 'logo')
export async function getImagesByTag(tagName: string) {
  // Voorkom Next.js caching zodat getagde uploads direct live verschijnen
  noStore()

  try {
    const results = await cloudinary.api.resources_by_tag(tagName, {
      max_results: 100,
      context: true, // Zorgt dat we metadata zoals captions meekrijgen
    })

    console.log(`Cloudinary: ${results.resources.length} items gevonden met tag '${tagName}'`)

    return results.resources.map((resource: any) => ({
      publicId: resource.public_id,
      width: resource.width,
      height: resource.height,
      title: resource.context?.custom?.caption || resource.public_id.split('/').pop()?.split('_')[0] || 'Werk',
    }))
  } catch (error) {
    console.error(`Fout bij ophalen tag ${tagName}:`, error)
    return []
  }
}

export async function getImagesFromFolder() {
  return getImagesByTag('logo')
}

export async function getPortfolioImages() {
  return getImagesByTag('portfolio-item')
}
