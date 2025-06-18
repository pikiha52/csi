# 🧾 E-Commerce Product Catalog App

Aplikasi web katalog produk menggunakan **Next.js** (Frontend), **Golang** (Backend), dan **PostgreSQL** sebagai database. Semua service dijalankan dengan **Docker Compose**.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone repository

```bash
git clone https://github.com/pikiha52/csi.git
```

### 2. Masuk ke folder `docker`

```bash
cd your-repo-name/docker
```

### 3. Jalankan dengan Docker Compose

```bash
docker compose -f docker-compose.yml up -d
```

> Pastikan port `3000`, `8080`, dan `5432` tidak sedang digunakan.

---

## 🧾 Default User Login

| Username | Password |
|----------|----------|
| johndoe  | password |

---

## 🌐 Akses Aplikasi

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080/api](http://localhost:8080/api)

---

## 📂 Struktur Proyek

```
your-repo-name/
├── backend/        # Golang Backend API
├── frontend/       # Next.js Frontend
├── docker/         # Docker setup files (compose, env, dsb)
└── README.md
```

---

## 📌 Teknologi

- ⚛️ Next.js
- 🧠 Golang
- 🐘 PostgreSQL
- 🐳 Docker & Docker Compose

---

## 🛑 Stop dan Hapus Container

```bash
docker compose -f docker-compose.yml down
```

---
