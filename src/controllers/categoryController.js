const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Category (Admin Only)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name }
    });
    res.status(201).json({ success: true, message: 'Kategori dibuat', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category (Admin Only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true, message: 'Kategori dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kategori (mungkin sedang dipakai buku)' });
  }
};

module.exports = { getAllCategories, createCategory, deleteCategory };