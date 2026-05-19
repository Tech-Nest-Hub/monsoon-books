// coverImage → Book.coverImage
// images     → create BookImage rows
await prisma.book.create({
  data: {
    ...formData,
    coverImage,
    images: {
      create: images.map((url, i) => ({ url, order: i })),
    },
  },
});