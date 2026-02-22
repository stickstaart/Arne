'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 1. Functie voor de LogoStrip
export async function getImagesFromFolder(folderPath: string = 'arne-portfolio/logos') {
  try {
    const results = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 100,
    })

    return results.resources.map((resource: any) => ({
      publicId: resource.public_id,
      width: resource.width,
      height: resource.height,
    }))
  } catch (error) {
    console.error('Cloudinary Logo Error:', error)
    return []
  }
}

// 2. Functie voor het PortfolioGrid
export async function getPortfolioImages(category: string) {
  try {
    // Gebruik het pad dat Junie vond
    const results = await cloudinary.api.resources({
      type: 'upload',
      prefix: `arne-portfolio/projects/${category}`,
      max_results: 50,
      context: true,
    })

    console.log(`DEBUG: Gevonden in ${category}:`, results.resources.length)

    return results.resources.map((resource: any) => ({
      publicId: resource.public_id,
      width: resource.width,
      height: resource.height,
      // Haal de titel uit de bestandsnaam (vóór de underscore)
      title: resource.context?.custom?.caption || resource.public_id.split('/').pop()?.split('_')[0] || 'Portfolio werk',
    }))
  } catch (error) {
    console.error('Cloudinary Portfolio Error:', error)
    return []
  }
}
