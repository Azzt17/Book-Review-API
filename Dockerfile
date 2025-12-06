# Gunakan image Node.js berbasis Debian (lebih stabil untuk Prisma)
FROM node:18-slim

# Install OpenSSL yang dibutuhkan Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy dependency definition
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy folder prisma
COPY prisma ./prisma/

# Copy seluruh source code
COPY . .

# Generate Prisma Client (PENTING: dilakukan di dalam container)
RUN npx prisma generate

EXPOSE 3000

# Jalankan migrasi database lalu start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]