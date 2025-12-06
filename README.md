# Book Review API 📚

Aplikasi REST API backend untuk mengelola resensi buku, kategori, dan pengguna. Proyek ini dibangun sebagai Tugas Akhir Mata Kuliah Pemrograman Web.

## 🚀 Fitur Utama

- **Autentikasi & Otorisasi:** Register, Login (JWT), dan Role-Based Access Control (Admin/User).
- **Manajemen Buku:** CRUD Buku dengan fitur Search, Pagination, dan Sorting.
- **Manajemen Kategori:** Pengelompokan buku berdasarkan genre (Many-to-Many).
- **Sistem Resensi:** User dapat memberikan rating dan review pada buku.
- **Keamanan:** Proteksi terhadap BOLA (Broken Object Level Authorization), Hash Password (Bcrypt), Security Headers (Helmet), dan Rate Limiting.
- **Validasi Data:** Input validasi ketat menggunakan Joi.

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** SQLite (Dev) / PostgreSQL (Prod)
- **ORM:** Prisma
- **Validation:** Joi
- **Containerization:** Docker

## 📂 Struktur Folder

Aplikasi ini menggunakan arsitektur **MVC (Model-View-Controller)**:

- `src/controllers`: Logika bisnis.
- `src/routes`: Definisi endpoint API.
- `src/middleware`: Autentikasi, validasi, dan error handling.
- `src/validators`: Schema validasi Joi.
- `src/utils`: Fungsi bantuan (Hashing, Token).
- `prisma/`: Schema database dan seeder.

## ⚙️ Cara Menjalankan (Local)

1.  **Clone Repository**
    ```bash
    git clone https://github.com/Azzt17/Book-Review-API/
    cd book-review-api
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3. **Setup Environment Variables**
   Duplikat file `.env.example` menjadi `.env`, lalu isi variabelnya:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET=rahasia_super_panjang_dan_aman
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=rahasia_refresh_super_panjang
   JWT_REFRESH_EXPIRES_IN=7d
    ```

4.  **Database Migration & Seeding**
    ```bash
    # Buat tabel
    npx prisma migrate dev --name init

    # Isi data awal (Admin & Buku Sampel)
    npx prisma db seed
    ```

5.  **Jalankan Server**
    ```bash
    npm run dev
    ```

## 🐳 Cara Menjalankan (Docker)

Jika Anda memiliki Docker, Anda tidak perlu install Node.js secara manual.

1.  **Build Image**
    ```bash
    docker build -t book-review-api .
    ```

2.  **Run Container**
    ```bash
    docker run -p 3000:3000 --env-file .env --name my-book-api book-review-api
    ```

## 🧪 Akun Testing (Seeder)

Gunakan akun berikut untuk pengujian di Postman (Password telah di-hash di database, gunakan password mentah ini untuk login):

| Role       | Email             | Password      | Deskripsi   
| :---       | :---              | :---          | :---        
| **Admin**  | `admin@book.com`  | `admin123`    | Memiliki akses penuh(CRUD Buku, Kategori, Hapus Review siapa saja)  
| **User**   | `budi@book.com`   | `user123`     | Hanya bisa menulis review dan melihat data publik

## 📖 Dokumentasi API

Daftar lengkap endpoint API, parameter, dan contoh request dapat dilihat di file:
👉 **[API-DOCS.md](./API-DOCS.md)**

## ☁️ Deployment

Informasi mengenai deployment ke AWS EC2 dapat dilihat di file:
👉 **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---
**Tugas Project Akhir Backend - Pemrograman Web**