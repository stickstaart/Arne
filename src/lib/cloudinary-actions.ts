'use server'

import { v2 as cloudinary } from 'cloudinary'
import { unstable_noStore as noStore } from 'next/cache'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Haalt afbeeldingen op basis van de tag en sorteert op 'order' metadata
export async function getImagesByTag(tagName: string) {
  // Voorkom Next.js caching zodat nieuw getagde/geordende uploads direct live verschijnen
  noStore()

  try {
    const results = await cloudinary.api.resources_by_tag(tagName, {
      max_results: 500, // Verhoogd om alle 170+ items in één keer op te halen
      context: true,    // Noodzakelijk voor Contextual Metadata (zoals order & caption)
    })

    console.log(`Cloudinary: ${results.resources.length} items gevonden met tag '${tagName}'`)

    // 1. Sorteer de resources op basis van het 'order' of 'volgorde' veld
    const sortedResources = results.resources.sort((a: any, b: any) => {
      const orderA = parseInt(a.context?.custom?.order || a.context?.custom?.volgorde || '99999', 10)
      const orderB = parseInt(b.context?.custom?.order || b.context?.custom?.volgorde || '99999', 10)

      if (orderA !== orderB) {
        return orderA - orderB // Lage nummers (1, 2, 3...) komen bovenaan
      }

      // Geen nummer ingevuld? Sorteer op meest recente uploaddatum
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    // 2. Map de gesorteerde resultaten naar het gewenste formaat
    return sortedResources.map((resource: any) => ({
      publicId: resource.public_id,
      width: resource.width,
      height: resource.height,
      title: resource.context?.custom?.caption || resource.public_id.split('/').pop()?.split('_')[0] || 'Werk',
      order: resource.context?.custom?.order || resource.context?.custom?.volgorde || null,
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
