const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const userId = req.user.id; // Dari token
    const { bookId, rating, content } = req.body;

    // Validasi sederhana
    if (!bookId || !rating || !content) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    // Cek apakah buku ada
    const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
    }

    // (Opsional) Cek apakah user sudah pernah review buku ini (One review per book)
    const existingReview = await prisma.review.findFirst({
      where: { userId: parseInt(userId), bookId: parseInt(bookId) }
    });
    if (existingReview) {
      return res.status(409).json({ success: false, message: 'Anda sudah mereview buku ini' });
    }

    // Buat Review
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        content,
        userId: parseInt(userId),
        bookId: parseInt(bookId)
      }
    });

    res.status(201).json({ success: true, message: 'Review berhasil ditambahkan', data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan review' });
  }
};

// 2. GET REVIEWS BY BOOK ID
const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { bookId: parseInt(bookId) },
      include: {
        user: { select: { id: true, name: true } } // Tampilkan nama reviewer
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. DELETE REVIEW (With Ownership Check / BOLA Protection)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Cari review dulu
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review tidak ditemukan' });
    }

    // LOGIKA OTORISASI KRUSIAL 
    // Boleh hapus jika: (User adalah pemilik review) ATAU (User adalah Admin)
    if (review.userId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: 'Akses Ditolak: Anda bukan pemilik review ini' 
      });
    }

    // Hapus
    await prisma.review.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Review berhasil dihapus' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getReviewsByBook, deleteReview };