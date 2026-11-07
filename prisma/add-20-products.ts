import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding 20 premium products to Shopora...");

  // 1. Ensure required categories exist
  const categoryDefs = [
    { name: "Tables", slug: "tables", description: "Dining, coffee, and side tables." },
    { name: "Seating", slug: "seating", description: "Sofas, armchairs, and benches." },
    { name: "Lighting", slug: "lighting", description: "Pendants, table lamps, and floor fixtures." },
    { name: "Decor", slug: "decor", description: "Ceramics, rugs, mirrors, and sculptural accents." },
    { name: "Bedroom", slug: "bedroom", description: "Beds, nightstands, and luxury linens." },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoryDefs) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (existing) {
      categoryMap.set(cat.slug, existing.id);
    } else {
      const created = await prisma.category.create({ data: cat });
      categoryMap.set(cat.slug, created.id);
    }
  }

  // 2. 20 Realistic Luxury Home & Living Products
  const newProducts = [
    {
      name: "Razor Side Table - Walnut",
      slug: "razor-side-table-walnut",
      description: "Artisanal walnut side table featuring an open book niche, clean architectural lines, and solid brass accent hardware.",
      price: 5500,
      comparePrice: 7200,
      stock: 18,
      sku: "ST-RZR-WLN",
      brand: "Shopora Studio",
      categorySlug: "tables",
      isFeatured: true,
      rating: 4.8,
      reviewCount: 283,
      images: [
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Pico Bedside Table - Natural Oak",
      slug: "pico-bedside-table-natural-oak",
      description: "Compact solid oak nightstand with smooth soft-close drawer and lower display shelf for nighttime reads.",
      price: 2199,
      comparePrice: 5800,
      stock: 22,
      sku: "ST-PCO-OAK",
      brand: "Nordic Living",
      categorySlug: "tables",
      isFeatured: true,
      rating: 4.9,
      reviewCount: 118,
      images: [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1540518614846-7ede433c4b63?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Cedar Nightstand Table - Wenge",
      slug: "cedar-nightstand-table-wenge",
      description: "Deep espresso wenge finish bedside companion crafted with kiln-dried hardwoods and protective satin varnish.",
      price: 1799,
      comparePrice: 5900,
      stock: 15,
      sku: "ST-CDR-WNG",
      brand: "Shopora Home",
      categorySlug: "tables",
      isFeatured: true,
      rating: 4.7,
      reviewCount: 612,
      images: [
        "https://images.unsplash.com/photo-1540518614846-7ede433c4b63?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1507646873130-97ce71b8be88?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Albia Dual-Drawer Side Table",
      slug: "albia-dual-drawer-side-table",
      description: "Minimalist dual-drawer end table offering concealed bedside storage and warm natural teak woodgrain.",
      price: 4500,
      comparePrice: 6200,
      stock: 14,
      sku: "ST-ALB-DUAL",
      brand: "Artisan Atelier",
      categorySlug: "tables",
      isFeatured: true,
      rating: 4.9,
      reviewCount: 670,
      images: [
        "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Palm Tiered Side Table - White Ash",
      slug: "palm-tiered-side-table-white-ash",
      description: "Three-tier vertical accent shelf in Scandinavian white ash, ideal for compact corners and bedside lamp displays.",
      price: 2899,
      comparePrice: 8260,
      stock: 20,
      sku: "ST-PLM-WHT",
      brand: "Nordic Living",
      categorySlug: "tables",
      isFeatured: false,
      rating: 4.8,
      reviewCount: 590,
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Canna Fluted Bedside Table - Autumn Slate",
      slug: "canna-fluted-bedside-table-autumn-slate",
      description: "Contemporary fluted silhouette with premium HDHMR moisture-resistant core and champagne brushed metal legs.",
      price: 14160,
      comparePrice: 18880,
      stock: 9,
      sku: "ST-CNN-SLT",
      brand: "Shopora Luxe",
      categorySlug: "tables",
      isFeatured: true,
      rating: 4.9,
      reviewCount: 634,
      images: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1507646873130-97ce71b8be88?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Canna Bedside Table - Champagne Gold",
      slug: "canna-bedside-table-champagne-gold",
      description: "Pristine white lacquered dual-drawer nightstand crowned with gold inlay grooves and tapered cylindrical feet.",
      price: 14160,
      comparePrice: 18880,
      stock: 11,
      sku: "ST-CNN-GLD",
      brand: "Shopora Luxe",
      categorySlug: "tables",
      isFeatured: false,
      rating: 4.8,
      reviewCount: 172,
      images: [
        "https://images.unsplash.com/photo-1507646873130-97ce71b8be88?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Olive Geometric Side Table - Matte White",
      slug: "olive-geometric-side-table-white",
      description: "Sculptural architectural tiered table with asymmetrical cubbies designed for books, planters, and ambient candles.",
      price: 2699,
      comparePrice: 7650,
      stock: 16,
      sku: "ST-OLV-WHT",
      brand: "Studio Minimal",
      categorySlug: "tables",
      isFeatured: false,
      rating: 4.7,
      reviewCount: 229,
      images: [
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Kanso Sculptural Ceramic Lamp",
      slug: "kanso-sculptural-ceramic-lamp",
      description: "Organic hand-thrown ceramic lamp base finished in oatmeal clay, paired with a textured natural flax linen shade.",
      price: 3499,
      comparePrice: 5999,
      stock: 25,
      sku: "LT-KNS-CRM",
      brand: "Shopora Studio",
      categorySlug: "lighting",
      isFeatured: true,
      rating: 4.9,
      reviewCount: 310,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Aura Brass Arch Floor Lamp",
      slug: "aura-brass-arch-floor-lamp",
      description: "Curved brushed antique brass floor lamp with heavy solid marble stabilization base and warm dimmable illumination.",
      price: 8999,
      comparePrice: 14500,
      stock: 10,
      sku: "LT-ARA-BRS",
      brand: "Lumen Architecture",
      categorySlug: "lighting",
      isFeatured: true,
      rating: 5.0,
      reviewCount: 184,
      images: [
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Kyoto Low-Slung Platform Bed",
      slug: "kyoto-low-slung-platform-bed",
      description: "Japanese-inspired low-profile solid teak platform bed with extended floating side ledges and integrated headboard.",
      price: 48000,
      comparePrice: 65000,
      stock: 6,
      sku: "BD-KYT-PLT",
      brand: "Artisan Atelier",
      categorySlug: "bedroom",
      isFeatured: true,
      rating: 4.9,
      reviewCount: 94,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1540518614846-7ede433c4b63?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Verona Velvet Swivel Armchair",
      slug: "verona-velvet-swivel-armchair",
      description: "Plush olive green cotton velvet swivel lounge chair with barrel backrest and 360-degree silent concealed swivel mechanism.",
      price: 26500,
      comparePrice: 38000,
      stock: 12,
      sku: "CH-VRN-VLV",
      brand: "Shopora Luxe",
      categorySlug: "seating",
      isFeatured: true,
      rating: 4.8,
      reviewCount: 421,
      images: [
        "https://images.unsplash.com/photo-1580481077195-c3a8a30f7292?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Nordic Curved 3-Seater Sofa",
      slug: "nordic-curved-3-seater-sofa",
      description: "Organic pebble-shaped curved sofa upholstered in spill-resistant textured bouclé with high-resilience foam core.",
      price: 72000,
      comparePrice: 95000,
      stock: 5,
      sku: "SF-NRD-CRV",
      brand: "Nordic Living",
      categorySlug: "seating",
      isFeatured: true,
      rating: 4.9,
      reviewCount: 340,
      images: [
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Travertine Stone Coffee Plinth",
      slug: "travertine-stone-coffee-plinth",
      description: "Solid honed Italian travertine stone monolith coffee table with unfilled natural cavities and warm beige marbling.",
      price: 31900,
      comparePrice: 42000,
      stock: 8,
      sku: "TB-TRV-PLN",
      brand: "Shopora Studio",
      categorySlug: "tables",
      isFeatured: false,
      rating: 4.9,
      reviewCount: 156,
      images: [
        "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Sora Stoneware Textured Vase",
      slug: "sora-stoneware-textured-vase",
      description: "Hand-pinched sculptural stoneware vessel with unglazed volcanic sand texture and watertight interior glazing.",
      price: 1899,
      comparePrice: 3200,
      stock: 35,
      sku: "DC-SRA-VAS",
      brand: "Ceramic Collective",
      categorySlug: "decor",
      isFeatured: false,
      rating: 4.8,
      reviewCount: 245,
      images: [
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Artisanal Woven Jute Rug (5x7)",
      slug: "artisanal-woven-jute-rug-5x7",
      description: "Hand-braided 100% natural organic jute area rug with soft cotton backing for durable, textural underfoot comfort.",
      price: 4999,
      comparePrice: 8500,
      stock: 20,
      sku: "DC-JUT-RUG",
      brand: "Artisan Atelier",
      categorySlug: "decor",
      isFeatured: false,
      rating: 4.7,
      reviewCount: 520,
      images: [
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Edo Minimalist Arch Wall Mirror",
      slug: "edo-minimalist-arch-wall-mirror",
      description: "Full-length arched statement wall mirror encased in a slender 25mm matte black anodized aluminum metal profile.",
      price: 6499,
      comparePrice: 9999,
      stock: 15,
      sku: "DC-EDO-MRR",
      brand: "Studio Minimal",
      categorySlug: "decor",
      isFeatured: false,
      rating: 4.9,
      reviewCount: 198,
      images: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Matera Solid Teak Bookshelf",
      slug: "matera-solid-teak-bookshelf",
      description: "Open-back 5-shelf display étagère crafted from sustainably harvested plantation teak with dowel joint detailing.",
      price: 38500,
      comparePrice: 49000,
      stock: 7,
      sku: "TB-MTR-SHF",
      brand: "Shopora Home",
      categorySlug: "tables",
      isFeatured: false,
      rating: 5.0,
      reviewCount: 88,
      images: [
        "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Brutalist Cast Iron Bookends (Set of 2)",
      slug: "brutalist-cast-iron-bookends",
      description: "Heavyweight cast-iron geometric bookends hand-poured with a textured charcoal graphite powder-coat finish.",
      price: 2299,
      comparePrice: 3800,
      stock: 40,
      sku: "DC-BRT-BKE",
      brand: "Ceramic Collective",
      categorySlug: "decor",
      isFeatured: false,
      rating: 4.8,
      reviewCount: 142,
      images: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      name: "Kyoto Linen Cushion Cover Set (Pair)",
      slug: "kyoto-linen-cushion-cover-set",
      description: "Pre-washed French flax linen throw pillow covers in terracotta earth tones with hidden zipper closures.",
      price: 1499,
      comparePrice: 2800,
      stock: 50,
      sku: "DC-KYT-CSH",
      brand: "Artisan Atelier",
      categorySlug: "decor",
      isFeatured: false,
      rating: 4.7,
      reviewCount: 310,
      images: [
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80",
      ],
    },
  ];

  let addedCount = 0;
  let updatedCount = 0;

  for (const p of newProducts) {
    const categoryId = categoryMap.get(p.categorySlug) || Array.from(categoryMap.values())[0];

    const existingProduct = await prisma.product.findUnique({
      where: { slug: p.slug },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          comparePrice: p.comparePrice,
          stock: p.stock,
          sku: p.sku,
          brand: p.brand,
          categoryId,
          isFeatured: p.isFeatured,
          rating: p.rating,
          reviewCount: p.reviewCount,
          isActive: true,
        },
      });
      updatedCount++;
    } else {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          comparePrice: p.comparePrice,
          stock: p.stock,
          sku: p.sku,
          brand: p.brand,
          categoryId,
          isFeatured: p.isFeatured,
          rating: p.rating,
          reviewCount: p.reviewCount,
          isActive: true,
          images: {
            create: p.images.map((url, i) => ({ url, position: i })),
          },
        },
      });
      addedCount++;
    }
  }

  const total = await prisma.product.count();
  console.log(`Success! Added: ${addedCount}, Updated: ${updatedCount}. Total products in database: ${total}`);
}

main()
  .catch((e) => {
    console.error("Error seeding 20 products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

