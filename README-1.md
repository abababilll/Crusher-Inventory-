# Crusher — Inventaris Barang

Aplikasi web inventaris barang dengan **backend Node.js + Express + SQLite**.  
Login, CRUD, harga dari 0, dan data tersimpan permanen di database.

![Crusher](https://img.shields.io/badge/Crusher-Inventory-3b82f6?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## Fitur

| Fitur | Keterangan |
|-------|------------|
| **Login (JWT)** | Autentikasi server-side, password di-hash |
| **Dashboard** | Statistik real-time dari database |
| **CRUD Inventaris** | Tambah, lihat, edit, hapus lewat API |
| **Harga dari 0** | Harga & stok boleh 0, diatur bebas |
| **Pencarian & Filter** | Nama, SKU, kategori, status |
| **QR Code** | Generate + scan kamera |
| **Tema Gelap** | Mode terang / gelap |
| **Export JSON** | Unduh data inventaris |

---

## Struktur File

```
crusher-inventory/
├── server.js                 # Backend Express + SQLite
├── package.json              # Dependensi Node.js
├── crusher-inventory.html    # Frontend
├── crusher.db                # Database (otomatis dibuat)
└── README.md
```

---

## Instalasi Node.js

### Termux (Android)
```bash
pkg update && pkg upgrade -y
pkg install nodejs -y
node -v
npm -v
```

> Pakai **sql.js** (SQLite murni JavaScript) — tidak perlu compile native.

### Windows
Download LTS dari [nodejs.org](https://nodejs.org) → install → cek:
```bash
node -v
npm -v
```

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

### macOS
```bash
brew install node
node -v
```

---

## Menjalankan Aplikasi

```bash
# 1. Masuk ke folder project
cd folder-crusher

# 2. Install dependensi
npm install

# 3. Jalankan server
npm start
# atau: node server.js
```

Buka browser:
```
http://localhost:3000
```

### Login
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/login` | Login → dapat token JWT |
| GET | `/api/me` | Data user (butuh token) |
| GET | `/api/items` | Daftar barang |
| GET | `/api/items/:id` | Detail barang |
| POST | `/api/items` | Tambah barang |
| PUT | `/api/items/:id` | Edit barang |
| DELETE | `/api/items/:id` | Hapus barang |
| GET | `/api/stats` | Statistik dashboard |

Header autentikasi:
```
Authorization: Bearer <token>
```

---

## Database (SQLite)

File: `crusher.db` (otomatis dibuat saat server pertama kali jalan)

**Tabel `users`** — akun login  
**Tabel `items`** — inventaris barang

Field barang:
- name, sku, category
- qty (integer ≥ 0)
- price (real ≥ 0) — **boleh 0**
- location, note
- created_at, updated_at

Reset data: hapus file `crusher.db` lalu restart server.

---

## Cara Kerja

```
Browser (HTML/JS)
      ↓  fetch + JWT
Express API (server.js)
      ↓
SQLite (crusher.db)
```

- Frontend tidak lagi pakai LocalStorage untuk barang
- Semua data CRUD lewat API
- Password di-hash dengan bcrypt
- Token JWT berlaku 7 hari

---

## QR Code

- Generate QR per barang (tombol ikon QR)
- Scan QR untuk buka detail barang
- Untuk kamera: jalankan lewat `http://localhost` (bukan `file://`)

---

## Upload ke GitHub

```bash
git init
git add .
git commit -m "Crusher Inventory - Node.js + Express + SQLite"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Jangan commit `crusher.db` dan `node_modules/`. Contoh `.gitignore`:

```
node_modules/
crusher.db
crusher.db-*
*.local.html.bak
```

---

## Teknologi

- **Backend:** Node.js, Express, sql.js (SQLite), bcryptjs, jsonwebtoken, cors
- **Frontend:** HTML, CSS, Vanilla JS
- **Database:** SQLite

---

**Crusher v1.0** — Inventaris barang dengan backend nyata.
