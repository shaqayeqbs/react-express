import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  // Seed products
  const products = [
    {
      name: "Premium Wireless Headphones",
      description:
        "High-quality wireless headphones with active noise cancellation and 30-hour battery life",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      inStock: true,
      category: "Audio",
      rating: 4.8,
      reviews: 1243,
      brand: "AudioPro",
      sku: "APH-001",
      variants: {
        create: [
          { name: "Black", available: true, stock: 15 },
          { name: "White", available: true, stock: 8 },
          { name: "Silver", available: true, stock: 12 },
        ],
      },
    },
    {
      name: "Smart Watch Series 5",
      description:
        "Advanced fitness tracking with heart rate monitor, GPS, and health monitoring",
      price: 399.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      inStock: true,
      category: "Wearables",
      rating: 4.6,
      reviews: 892,
      brand: "TechWatch",
      sku: "TW-SW5-001",
      variants: {
        create: [
          { name: "42mm", available: true, stock: 20 },
          { name: "46mm", available: true, stock: 15 },
        ],
      },
    },
    {
      name: "Mechanical Keyboard RGB",
      description:
        "Premium mechanical keyboard with customizable RGB lighting and hot-swappable switches",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop",
      inStock: false,
      category: "Accessories",
      rating: 4.9,
      reviews: 567,
      brand: "KeyMaster",
      sku: "KM-RGB-001",
      variants: {
        create: [
          { name: "Brown Switch", available: false, stock: 0 },
          { name: "Blue Switch", available: false, stock: 0 },
          { name: "Red Switch", available: false, stock: 0 },
        ],
      },
    },
    {
      name: "Ultra HD Webcam 4K",
      description:
        "Professional 4K webcam with auto-focus, low-light correction, and dual microphones",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop",
      inStock: true,
      category: "Cameras",
      rating: 4.7,
      reviews: 423,
      brand: "WebCamPro",
      sku: "WCP-4K-001",
      variants: {
        create: [
          { name: "1080p", available: true, stock: 25 },
          { name: "4K", available: true, stock: 18 },
        ],
      },
    },
    {
      name: "Portable SSD 1TB",
      description:
        "Fast and reliable external storage with USB-C, read speeds up to 1050MB/s",
      price: 179.99,
      image:
        "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&h=500&fit=crop",
      inStock: true,
      category: "Storage",
      rating: 4.9,
      reviews: 1876,
      brand: "StoragePlus",
      sku: "SP-SSD-1TB",
      variants: {
        create: [
          { name: "512GB", available: true, stock: 30 },
          { name: "1TB", available: true, stock: 22 },
          { name: "2TB", available: true, stock: 10 },
        ],
      },
    },
    {
      name: "Wireless Gaming Mouse",
      description:
        "High-precision gaming mouse with 16000 DPI, RGB lighting, and programmable buttons",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
      inStock: true,
      category: "Accessories",
      rating: 4.8,
      reviews: 923,
      brand: "GameGear",
      sku: "GG-WM-001",
      variants: {
        create: [
          { name: "Black", available: true, stock: 40 },
          { name: "White", available: true, stock: 35 },
        ],
      },
    },
    {
      name: "USB-C Hub 7-in-1",
      description:
        "Versatile USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop",
      inStock: false,
      category: "Accessories",
      rating: 4.5,
      reviews: 312,
      brand: "HubMaster",
      sku: "HM-7IN1-001",
      variants: {
        create: [
          { name: "Space Gray", available: false, stock: 0 },
          { name: "Silver", available: false, stock: 0 },
        ],
      },
    },
    {
      name: "Laptop Stand Adjustable",
      description:
        "Ergonomic adjustable laptop stand for better posture with cooling ventilation",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
      inStock: true,
      category: "Accessories",
      rating: 4.6,
      reviews: 654,
      brand: "ErgoDesk",
      sku: "ED-LS-001",
      variants: {
        create: [
          { name: "Aluminum", available: true, stock: 50 },
          { name: "Wood", available: true, stock: 28 },
        ],
      },
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
