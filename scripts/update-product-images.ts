import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productImagesMapping: Record<string, string[]> = {
  'The Lounge Sofa': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1000',
  ],
  'Oak Dining Table': [
    'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1000',
  ],
  'Ceramic Table Lamp': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000',
  ],
  'Bouclé Accent Chair': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000',
  ],
  'Marble Coffee Table': [
    'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=1000',
  ],
  'Amber Sintered Stone Dining Table': [
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=1000',
  ],
  'Doors Klasika Project Dora': [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1000',
  ],
  'TECH- Assemblers': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000',
  ],
  'Woven Wool Rug': [
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&q=80&w=1000',
  ],
}

async function main() {
  console.log('Fetching products from database...')
  const products = await prisma.product.findMany()

  for (const product of products) {
    const urls = productImagesMapping[product.name]
    if (!urls || urls.length === 0) {
      console.log(`No images defined for: ${product.name}`)
      continue
    }

    // Remove old images for this product if any
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })

    // Insert new distinct images
    for (let i = 0; i < urls.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: urls[i],
          position: i,
        }
      })
    }

    console.log(`Updated images for: "${product.name}" (${urls.length} images)`)
  }

  console.log('Product image update completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
