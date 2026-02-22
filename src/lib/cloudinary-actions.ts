'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function getImagesFromFolder(folderPath: string = '') {
  try {
    // We negeren folderPath en halen gewoon ALLES op uit je account
    const results = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
    })
    console.log("CLOUD_DEBUG: Totaal aantal afbeeldingen in account:", results.resources.length)
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
  // Voor nu laten we deze even ALLES ophalen zodat je in ieder geval beeld ziet
  return getImagesFromFolder()
}
