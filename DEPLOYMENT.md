# Laporan Deployment

## Informasi Project
- **Repo GitHub:** https://github.com/Azzt17/Book-Review-API
- **Production URL:** http://54.161.153.26
- **API Base URL:** http://54.161.153.26/api
- **Health Check:** http://54.161.153.26/

## Detail AWS EC2
- **Instance ID:** i-0bc4bc8ec59113c51
- **Elastic IP:** 54.161.153.26
- **Type:** t2.micro
- **Region:** us-east-1
- **OS:** Ubuntu Server 22.04 LTS

## Langkah Deployment (Step-by-Step)

### 1. Persiapan Server & Akses SSH
Masuk ke server menggunakan Private Key yang telah diamankan permissions-nya.

    chmod 400 book-key.pem
    ssh -i "book-key.pem" ubuntu@54.161.153.26

### 2. Instalasi Dependencies
Menginstall Node.js v18, PM2, dan Nginx.
-  Install Node.js 18
    curl -fsSL [https://deb.nodesource.com/setup_18.x](https://deb.nodesource.com/setup_18.x) | sudo -E bash -
    sudo apt-get install -y nodejs

- Install PM2 Global
    sudo npm install -g pm2

- Install Nginx
    sudo apt install -y nginx

### 3. Setup Aplikasi
Clone repository dan install dependencies project.
    git clone [https://github.com/Azzt17/Book-Review-API.git](https://github.com/Azzt17/Book-Review-API.git)
    cd Book-Review-API
    npm install

### 4. Konfigurasi Environment
Buat file .env dan isi variabel berikut (nilai disesuaikan dengan production secrets):
    nano .env

# Daftar Variabel:
    - NODE_ENV (isi: production)
    - PORT (isi: 3000)
    - DATABASE_URL (isi path absolut: "file:/home/ubuntu/Book-Review-API/prisma/prod.db")
    - JWT_SECRET
    - JWT_EXPIRES_IN
    - JWT_REFRESH_SECRET
    - JWT_REFRESH_EXPIRES_IN

### 5. Setup Database
Menjalankan migrasi dan seeding data awal.
    npx prisma generate
    npx prisma migrate deploy
    npx prisma db seed

### 6. Process Management (PM2)
Menjalankan aplikasi menggunakan file konfigurasi ecosystem.config.js agar environment variables terload otomatis dan process berjalan di background.
- Start Aplikasi
    pm2 start src/app.js --name "book-api"

- Setup Startup Script (Auto-start saat server reboot)
    pm2 startup
    pm2 save`

### 7. Konfigurasi Nginx (Reverse Proxy)
Menggunakan konfigurasi Nginx yang telah disiapkan di repository untuk meneruskan Port 80 ke Port 3000.

- Copy config dari repo ke Nginx
sudo cp nginx.conf /etc/nginx/sites-available/book-api

- Aktivasi Symlink
sudo ln -s /etc/nginx/sites-available/book-api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

- Restart Nginx
sudo systemctl restart nginx

# Langkah Verifikasi
Cara memastikan deployment berhasil secara fungsional:
1. Health Check: Buka browser dan akses http://54.161.153.26/. Pastikan muncul respons JSON { "status": "UP", ... }.
2. Cek API: Akses http://54.161.153.26/api. Pastikan status 200 OK.
3. Test Login: Gunakan Postman untuk mengirim POST request ke /api/auth/login menggunakan akun testing.

# Troubleshooting (Masalah Umum)
1. 502 Bad Gateway
Penyebab: Aplikasi Node.js mati, tapi Nginx hidup. Solusi:
- Cek status PM2: pm2 list
- Cek log error: pm2 logs book-api
- Restart aplikasi: pm2 restart book-api

2. Database Error (P1012/Migration Failed)
Penyebab: Path database di .env salah format atau file tidak ditemukan. Solusi:
- Pastikan DATABASE_URL menggunakan format absolut: file:/home/ubuntu/Book-Review-API/prisma/prod.db
- Jalankan ulang migrasi: npx prisma migrate deploy

3. Permission Denied (SSH)
- Penyebab: Izin file .pem terlalu terbuka. Solusi:
- Jalankan: chmod 400 book-key.pem

#  Monitoring & Maintenance
-  Cek Status & Logs
    pm2 list             # Cek status uptime
    pm2 monit            # Monitor CPU/Memory realtime
    pm2 logs --lines 50  # Lihat 50 baris log terakhir

# Prosedur Update Aplikasi
Langkah-langkah untuk mengupdate kode terbaru dari GitHub:
1. cd ~/Book-Review-API
2. git pull origin main
3. npm install
4. npx prisma generate
5. npx prisma migrate deploy
6. pm2 restart book-api

# Akun Testing
Gunakan kredensial berikut untuk pengujian fungsional:

| Role       | Email             | Password      | Deskripsi   
| :---       | :---              | :---          | :---        
| **Admin**  | `admin@book.com`  | `admin123`    | Memiliki akses penuh(CRUD Buku, Kategori, Hapus Review siapa saja)  
| **User**   | `budi@book.com`   | `user123`     | Hanya bisa menulis review dan melihat data publik

