'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
    console.error('Cloudinary Error:', error)
    return []
  }
}

export async function getPortfolioImages(category: string) {
  try {
    const results = await cloudinary.api.resources({
      type: 'upload',
      prefix: `arne-portfolio/projects/${category}`,
      max_results: 50,
    })
    return results.resources.map((resource: any) => ({
      publicId: resource.public_id,
      width: resource.width,
      height: resource.height,
      title: resource.public_id.split('/').pop()?.split('_')[0] || 'Werk',
    }))
  } catch (error) {
    console.error('Portfolio Error:', error)
    return []
  }
}
