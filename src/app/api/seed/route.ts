import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

const sampleBooks = [
  {
    title: "Land of Dawn",
    author: "MLBB",
    description: "An epic fantasy novel filled with adventure, mystery, and magical creatures. Join our heroes as they embark on a journey to save the land from darkness.",
    price: 100,
    originalPrice: 150,
    language: "English",
    publisher: "Fantasy Press",
    edition: "1st",
    stock: 25,
    coverImage: "https://via.placeholder.com/300x400?text=Land+of+Dawn",
  },
  {
    title: "Echoes of Torment",
    author: "Aakash",
    description: "A gripping psychological thriller that will keep you on the edge of your seat. Dark secrets unfold as the protagonist discovers the truth.",
    price: 100,
    originalPrice: 120,
    language: "English",
    publisher: "Dark Tales",
    edition: "1st",
    stock: 18,
    coverImage: "https://via.placeholder.com/300x400?text=Echoes+of+Torment",
  },
  {
    title: "The Silent Garden",
    author: "Priya Sharma",
    description: "A beautiful coming-of-age story about a girl who discovers a magical garden hidden in her grandmother's estate. Nature and magic intertwine beautifully.",
    price: 250,
    originalPrice: 350,
    language: "English",
    publisher: "Literary House",
    edition: "2nd",
    stock: 32,
    coverImage: "https://via.placeholder.com/300x400?text=The+Silent+Garden",
  },
  {
    title: "Code of Shadows",
    author: "Rajesh Kumar",
    description: "A thrilling cyber-thriller about hackers, artificial intelligence, and the battle for digital supremacy. Perfect for tech enthusiasts.",
    price: 199,
    originalPrice: 299,
    language: "English",
    publisher: "Tech Noir",
    edition: "1st",
    stock: 45,
    coverImage: "https://via.placeholder.com/300x400?text=Code+of+Shadows",
  },
  {
    title: "Whispers of the Mountains",
    author: "Ananya Patel",
    description: "An inspiring memoir about self-discovery and the challenges of climbing both literal and metaphorical mountains. A story of resilience and courage.",
    price: 175,
    originalPrice: 225,
    language: "English",
    publisher: "Adventure Works",
    edition: "1st",
    stock: 28,
    coverImage: "https://via.placeholder.com/300x400?text=Whispers+Mountains",
  },
  {
    title: "Dancing with Stars",
    author: "Meera Singh",
    description: "A romantic novel that takes you through the glittering world of ballroom dancing, passion, and unexpected love. Beautifully written.",
    price: 180,
    originalPrice: 280,
    language: "English",
    publisher: "Romance Tales",
    edition: "1st",
    stock: 35,
    coverImage: "https://via.placeholder.com/300x400?text=Dancing+with+Stars",
  },
  {
    title: "Quantum Dreams",
    author: "Dr. Vikram Singh",
    description: "An exploration of quantum mechanics through the lens of science fiction. Mind-bending concepts presented in an engaging narrative.",
    price: 320,
    originalPrice: 420,
    language: "English",
    publisher: "Science Mind",
    edition: "3rd",
    stock: 22,
    coverImage: "https://via.placeholder.com/300x400?text=Quantum+Dreams",
  },
  {
    title: "The Last Kingdom",
    author: "Nicholas Blackwell",
    description: "Epic historical fiction set in medieval times. Political intrigue, battles, and the struggle for power in a kingdom on the brink of collapse.",
    price: 290,
    originalPrice: 390,
    language: "English",
    publisher: "Historical Press",
    edition: "2nd",
    stock: 40,
    coverImage: "https://via.placeholder.com/300x400?text=The+Last+Kingdom",
  },
  {
    title: "Lighthouse Hearts",
    author: "Emma Richardson",
    description: "A cozy mystery novel featuring a lighthouse keeper who uncovers secrets about the town she just moved to. Perfect for mystery lovers.",
    price: 145,
    originalPrice: 195,
    language: "English",
    publisher: "Mystery House",
    edition: "1st",
    stock: 38,
    coverImage: "https://via.placeholder.com/300x400?text=Lighthouse+Hearts",
  },
  {
    title: "The Philosophy of Dreams",
    author: "Prof. David Chen",
    description: "A profound exploration of consciousness, dreams, and the nature of reality. Perfect for those who love philosophical deep dives.",
    price: 285,
    originalPrice: 385,
    language: "English",
    publisher: "Mind Expansion",
    edition: "1st",
    stock: 19,
    coverImage: "https://via.placeholder.com/300x400?text=Philosophy+Dreams",
  },
  {
    title: "Sunset in Paris",
    author: "Catherine Dubois",
    description: "A romantic getaway to Paris becomes a life-changing adventure when two strangers meet by chance. Love, art, and passion bloom.",
    price: 160,
    originalPrice: 220,
    language: "English",
    publisher: "Romance Tales",
    edition: "1st",
    stock: 42,
    coverImage: "https://via.placeholder.com/300x400?text=Sunset+in+Paris",
  },
  {
    title: "Cyberpunk Requiem",
    author: "Alex Sterling",
    description: "A dystopian sci-fi novel set in a neon-lit megacity where corporations rule and humanity fights for freedom. Intense and action-packed.",
    price: 210,
    originalPrice: 310,
    language: "English",
    publisher: "Future Press",
    edition: "1st",
    stock: 50,
    coverImage: "https://via.placeholder.com/300x400?text=Cyberpunk+Requiem",
  },
  {
    title: "Ancient Scrolls",
    author: "Prof. Marcus Troy",
    description: "An academic work exploring ancient civilizations, lost knowledge, and archaeological mysteries. Educational and captivating.",
    price: 340,
    originalPrice: 440,
    language: "English",
    publisher: "Academic Press",
    edition: "2nd",
    stock: 26,
    coverImage: "https://via.placeholder.com/300x400?text=Ancient+Scrolls",
  },
  {
    title: "The Forgotten Island",
    author: "Sarah Evergreen",
    description: "An adventure tale of exploration, survival, and discovery on a mysterious island filled with wonders and dangers.",
    price: 195,
    originalPrice: 275,
    language: "English",
    publisher: "Adventure Works",
    edition: "1st",
    stock: 33,
    coverImage: "https://via.placeholder.com/300x400?text=Forgotten+Island",
  },
  {
    title: "Digital Horizons",
    author: "James Mitchell",
    description: "A comprehensive guide to digital transformation and the future of technology in business. Practical and insightful.",
    price: 350,
    originalPrice: 450,
    language: "English",
    publisher: "Tech Futures",
    edition: "1st",
    stock: 29,
    coverImage: "https://via.placeholder.com/300x400?text=Digital+Horizons",
  },
  {
    title: "Midnight in Tokyo",
    author: "Yuki Tanaka",
    description: "A noir detective story set in the neon streets of Tokyo. Mystery, danger, and redemption collide in this page-turner.",
    price: 170,
    originalPrice: 270,
    language: "English",
    publisher: "Dark Tales",
    edition: "1st",
    stock: 37,
    coverImage: "https://via.placeholder.com/300x400?text=Midnight+Tokyo",
  },
  {
    title: "The Golden Path",
    author: "Maharishi Ramesh",
    description: "A spiritual journey towards enlightenment through ancient wisdom and modern understanding. Inspirational and transformative.",
    price: 220,
    originalPrice: 320,
    language: "English",
    publisher: "Spiritual Press",
    edition: "1st",
    stock: 41,
    coverImage: "https://via.placeholder.com/300x400?text=The+Golden+Path",
  },
]

export async function POST(req: NextRequest) {
  try {
    // Create or get default category
    const category = await prisma.category.upsert({
      where: { name: "Books" },
      update: {},
      create: { name: "Books" },
    })

    // Create books
    let created = 0
    for (const book of sampleBooks) {
      try {
        await prisma.book.create({
          data: {
            ...book,
            categoryId: category.id,
            status: "AVAILABLE",
          },
        })
        created++
      } catch (e) {
        // Book might already exist, skip
        console.log(`Skipped: ${book.title}`)
      }
    }

    return NextResponse.json(
      { message: `${created} books added successfully!` },
      { status: 200 }
    )
  } catch (error) {
    console.error("[POST /api/seed]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
