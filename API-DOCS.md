# Dokumentasi API Book Review

Base URL: `http://<IP_ADDRESS>:3000/api`

## Auth
- **POST** `/auth/register` - Daftar user baru.
  - Body: `name`, `email`, `password`
- **POST** `/auth/login` - Masuk sistem.
  - Body: `email`, `password`
- **GET** `/auth/me` - Cek profil sendiri (Butuh Token).

## Books
- **GET** `/books` - List buku.
  - Query: `page`, `limit`, `search`, `sortBy`, `order`
- **GET** `/books/:id` - Detail buku.
- **POST** `/books` - Tambah buku (Admin).
  - Body: `title`, `author`, `summary`, `releaseYear`, `categoryIds` (Array)
- **DELETE** `/books/:id` - Hapus buku (Admin).

## Categories
- **GET** `/categories` - List kategori.
- **POST** `/categories` - Tambah kategori (Admin).
- **DELETE** `/categories/:id` - Hapus kategori (Admin).

## Reviews
- **GET** `/reviews/book/:bookId` - Lihat review buku tertentu.
- **POST** `/reviews` - Tulis review (User Login).
  - Body: `bookId`, `rating` (1-5), `content`
- **DELETE** `/reviews/:id` - Hapus review (Pemilik/Admin).