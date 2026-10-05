import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // 1. Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Seating', slug: 'seating', description: 'Sofas, chairs, and loungers.' } }),
    prisma.category.create({ data: { name: 'Tables', slug: 'tables', description: 'Dining, coffee, and side tables.' } }),
    prisma.category.create({ data: { name: 'Lighting', slug: 'lighting', description: 'Lamps, pendants, and sconces.' } }),
    prisma.category.create({ data: { name: 'Decor', slug: 'decor', description: 'Rugs, mirrors, and accessories.' } }),
  ])

  // 2. Products
  const products = [
    {
      name: 'The Lounge Sofa',
      slug: 'the-lounge-sofa',
      description: 'A deep-seated, ultra-comfortable sofa with clean, architectural lines. Upholstered in premium textured linen.',
      price: 85000,
      comparePrice: 105000,
      stock: 12,
      categoryId: categories[0].id,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?q=80&w=800', position: 0 },
        { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800', position: 1 },
      ],
      variants: [
        { color: 'Oatmeal', size: '3-Seater', stock: 5 },
        { color: 'Charcoal', size: '3-Seater', stock: 7 },
      ]
    },
    {
      name: 'Oak Dining Table',
      slug: 'oak-dining-table',
      description: 'Solid European oak dining table with a minimalist silhouette. Comfortably seats six.',
      price: 65000,
      stock: 8,
      categoryId: categories[1].id,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800', position: 0 },
        { url: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=800', position: 1 },
      ],
    },
    {
      name: 'Ceramic Table Lamp',
      slug: 'ceramic-table-lamp',
      description: 'Hand-thrown ceramic table lamp with a natural linen shade. Casts a warm, diffused glow.',
      price: 18500,
      comparePrice: 22000,
      stock: 25,
      categoryId: categories[2].id,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800', position: 0 },
      ],
    },
    {
      name: 'Bouclé Accent Chair',
      slug: 'boucle-accent-chair',
      description: 'Sculptural accent chair upholstered in soft bouclé fabric. The perfect statement piece.',
      price: 45000,
      stock: 5,
      categoryId: categories[0].id,
      isFeatured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800', position: 0 },
      ],
    },
    {
      name: 'Marble Coffee Table',
      slug: 'marble-coffee-table',
      description: 'Low-profile coffee table featuring a honed marble top and blackened steel base.',
      price: 52000,
      stock: 4,
      categoryId: categories[1].id,
      isFeatured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800', position: 0 },
      ],
    },
    {
      name: 'Woven Wool Rug',
      slug: 'woven-wool-rug',
      description: 'Hand-woven wool rug with subtle geometric patterns. Adds warmth and texture to any space.',
      price: 32000,
      stock: 15,
      categoryId: categories[3].id,
      isFeatured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1575414003593-cea80373df9f?q=80&w=800', position: 0 },
      ],
    }
  ]

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice,
        stock: p.stock,
        categoryId: p.categoryId,
        isFeatured: p.isFeatured,
        images: {
          create: p.images
        },
        variants: p.variants ? {
          create: p.variants
        } : undefined
      }
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
