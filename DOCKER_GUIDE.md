# Panduan Instalasi & Menjalankan Proyek dengan Docker 🐳

Sistem Informasi Manajemen Skripsi & Bebas Pustaka UPA Perpustakaan Universitas Riau telah dikonfigurasi penuh dengan arsitektur multi-container Docker:
1. **Frontend**: React + Vite + Tailwind CSS yang dibundel ke production dan disajikan oleh **Nginx Alpine** (Port `80`). Nginx sekaligus menjadi Reverse Proxy untuk meneruskan permintaan `/api/` langsung ke Backend.
2. **Backend**: Node.js Express REST API (Port `5000`).
3. **Database**: MariaDB 10.11 / MySQL (Port `3306`) lengkap dengan skema otomatis `docker/db/init.sql` dan volume data persisten.

---

## 1. Prasyarat: Instalasi Docker

Sebelum menjalankan, pastikan komputer Anda sudah terpasang Docker:
- **Untuk Windows**: Unduh dan pasang **[Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)** (pastikan fitur WSL 2 diaktifkan).
- **Untuk Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt update
  sudo apt install -y docker.io docker-compose
  sudo systemctl enable --now docker
  ```
- **Untuk macOS**: Unduh dan pasang **Docker Desktop for Mac**.

---

## 2. Langkah Menjalankan Proyek (Cukup 1 Perintah)

### Langkah A: Siapkan File Konfigurasi Environment
Salin file template `.env.example` menjadi `.env`:
```bash
# Di Windows PowerShell:
Copy-Item .env.example .env

# Di Linux / Git Bash / macOS:
cp .env.example .env
```
*(Nilai default sudah disesuaikan langsung, Anda bisa langsung memakainya tanpa perlu mengubah apapun).*

### Langkah B: Jalankan Seluruh Sistem dengan Docker Compose
Buka terminal di direktori proyek ini, lalu jalankan:

```bash
docker-compose up -d --build
```

Docker akan secara otomatis:
1. Mengunduh image MariaDB dan menyiapkan database `manajemen_skripsi` secara otomatis dari [init.sql](file:///d:/Sistem%20Manajemen%20Skripsi/docker/db/init.sql).
2. Membangun image Backend Node.js dan mengoneksikannya ke container database.
3. Melakukan kompilasi build frontend React dan menyajikannya lewat web server Nginx.

---

## 3. Akses Aplikasi di Browser

Setelah perintah selesai berjalan, buka browser:
- **Aplikasi Web (Frontend)**: [http://localhost](http://localhost) (atau port yang Anda tentukan di `.env`)
- **Backend API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Database MySQL**: Host `localhost`, Port `3306`, User `root`, Password `rootpassword`, Database `manajemen_skripsi`.

---

## 4. Perintah Berguna Lainnya

### Melihat Log Realtime:
```bash
# Semua service
docker-compose logs -f

# Hanya Backend API
docker-compose logs -f backend

# Hanya Database
docker-compose logs -f db
```

### Memeriksa Status Container:
```bash
docker-compose ps
```

### Menghentikan Container:
```bash
docker-compose down
```

### Menghentikan dan Menghapus Seluruh Data Volume Database:
```bash
docker-compose down -v
```

### Membangun Ulang Setelah Perubahan Kode:
```bash
docker-compose up -d --build
```
