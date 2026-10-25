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
    prisma.category.create({ data: { name: 'Computer', slug: 'computer', description: 'Workspaces, desks, and computing accessories.' } }),
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
        { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1000', position: 1 },
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
        { url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1000', position: 1 },
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
        { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000', position: 1 },
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
        { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000', position: 1 },
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
        { url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=1000', position: 1 },
      ],
    },
    {
      name: 'Amber Sintered Stone Dining Table',
      slug: 'amber-sintered-stone-dining-table',
      description: 'Ultra-luxurious sintered stone dining table with anti-scratch and heat-resistant finish.',
      price: 88000,
      stock: 6,
      categoryId: categories[1].id,
      isFeatured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=1000', position: 1 },
      ],
    },
    {
      name: 'Doors Klasika Project Dora',
      slug: 'doors-klasika-project-dora',
      description: 'Classic handcrafted wooden interior decorative doors with timeless architectural moulding.',
      price: 64000,
      stock: 3,
      categoryId: categories[3].id,
      isFeatured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1000', position: 1 },
      ],
    },
    {
      name: 'TECH- Assemblers',
      slug: 'tech-assemblers',
      description: 'Ergonomic high-performance modern tech workstation desk with cable management.',
      price: 49000,
      stock: 9,
      categoryId: categories[4].id,
      isFeatured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000', position: 1 },
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
        { url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1000', position: 0 },
        { url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&q=80&w=1000', position: 1 },
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
