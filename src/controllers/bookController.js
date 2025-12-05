const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. GET ALL BOOKS (With Pagination & Search)
const getAllBooks = async (req, res) => {
  try {
    // Ambil query params (default values jika kosong)
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Filter Logic
    const filter = {};
    if (search) {
      filter.title = { contains: search }; // SQLite: default case-insensitive di like, tapi prisma contains case-sensitive di bbrp DB.
    }

    // Query Database
    const books = await prisma.book.findMany({
      where: filter,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: { categories: true }, // Tampilkan juga kategorinya
      orderBy: { createdAt: 'desc' }
    });

    // Hitung total untuk pagination info
    const totalBooks = await prisma.book.count({ where: filter });

    res.json({
      success: true,
      data: books,
      pagination: {
        total: totalBooks,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBooks / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET BOOK BY ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: { 
        categories: true,
        reviews: { // Tampilkan review juga
           include: { user: { select: { name: true } } }
        }
      }
    });

    if (!book) return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. CREATE BOOK (Admin Only)
const createBook = async (req, res) => {
  try {
    const { title, author, summary, releaseYear, categoryIds } = req.body;

    // categoryIds harus array angka, misal: [1, 2]
    const book = await prisma.book.create({
      data: {
        title,
        author,
        summary,
        releaseYear: parseInt(releaseYear),
        categories: {
          // Cara menghubungkan Many-to-Many di Prisma
          connect: categoryIds.map(id => ({ id: parseInt(id) }))
        }
      },
      include: { categories: true }
    });

    res.status(201).json({ success: true, message: 'Buku berhasil ditambahkan', data: book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal menambah buku' });
  }
};

// 4. DELETE BOOK (Admin Only)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.book.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Buku berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllBooks, getBookById, createBook, deleteBook };