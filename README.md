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

## ⚙️ Instalasi & Deployment (Metode Native/PM2)

Ini adalah metode deployment utama untuk memenuhi requirement **Process Management (PM2)** dan **Reverse Proxy (Nginx)**.

1.  **Persiapan Environment**
    Pastikan Node.js v18+, NPM, dan PM2 Global sudah terinstall.
    ```bash
    npm install -g pm2
    ```

2.  **Instalasi Dependencies**
    ```bash
    git clone [https://github.com/Azzt17/Book-Review-API.git](https://github.com/Azzt17/Book-Review-API.git)
    cd Book-Review-API
    npm install
    ```

3.  **Setup Database**
    Pastikan file `.env` sudah dikonfigurasi dengan path absolut ke database SQLite.
    ```bash
    npx prisma generate
    npx prisma migrate deploy
    npx prisma db seed
    ```

4.  **Menjalankan Aplikasi (PM2)**
    Menggunakan konfigurasi `ecosystem.config.js` yang telah disediakan.
    ```bash
    # Start Aplikasi
    pm2 start ecosystem.config.js

    # Monitoring
    pm2 monit
    ```

---

## 🐳 Deployment Alternatif (Docker)

Repositori ini juga mendukung deployment berbasis container untuk kemudahan distribusi.

1.  **Build Image**
    ```bash
    docker build -t book-api .
    ```

2.  **Run Container**
    ```bash
    docker run -d -p 3000:3000 --env-file .env --name my-book-api book-api
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