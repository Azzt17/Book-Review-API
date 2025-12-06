const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. Bersihkan Database (Hapus data lama)
  // Urutan penghapusan penting karena relasi (Child dulu baru Parent)
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('🧹 Database cleaned');

  // 2. Hash Password
  const salt = await bcrypt.genSalt(10);
  const passwordUser = await bcrypt.hash('user123', salt);
  const passwordAdmin = await bcrypt.hash('admin123', salt);

  // 3. Buat Users (1 Admin, 2 User Biasa)
  const admin = await prisma.user.create({
    data: { name: 'Super Admin', email: 'admin@book.com', password: passwordAdmin, role: 'ADMIN' }
  });

  const user1 = await prisma.user.create({
    data: { name: 'Budi Pembaca', email: 'budi@book.com', password: passwordUser, role: 'USER' }
  });

  const user2 = await prisma.user.create({
    data: { name: 'Siti Kritikus', email: 'siti@book.com', password: passwordUser, role: 'USER' }
  });

  console.log('👤 Users created');

  // 4. Buat Categories
  const catFilsafat = await prisma.category.create({ data: { name: 'Filsafat' } });
  const catSejarah = await prisma.category.create({ data: { name: 'Sejarah' } });
  const catFiksi = await prisma.category.create({ data: { name: 'Fiksi' } });

  console.log('🏷️ Categories created');

  // 5. Buat Books
  const book1 = await prisma.book.create({
    data: {
      title: 'Dunia Sophie',
      author: 'Jostein Gaarder',
      summary: 'Novel tentang sejarah filsafat',
      releaseYear: 1991,
      categories: { connect: [{ id: catFilsafat.id }, { id: catFiksi.id }] }
    }
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      summary: 'Riwayat singkat umat manusia',
      releaseYear: 2011,
      categories: { connect: [{ id: catSejarah.id }] }
    }
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'Laut Bercerita',
      author: 'Leila S. Chudori',
      summary: 'Novel sejarah kelam 1998',
      releaseYear: 2017,
      categories: { connect: [{ id: catFiksi.id }, { id: catSejarah.id }] }
    }
  });

  console.log('📚 Books created');

  // 6. Buat Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      content: 'Buku yang mengubah cara pandang saya!',
      userId: user1.id,
      bookId: book1.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 4,
      content: 'Sangat informatif tapi agak tebal.',
      userId: user2.id,
      bookId: book2.id
    }
  });

  console.log('💬 Reviews created');
  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });