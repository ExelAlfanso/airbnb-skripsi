# Architecture Decision Records

# ADR-001: Menggunakan ElysiaJS sebagai Backend API

## Status
Accepted

## Context
Backend perlu ringan, cepat, TypeScript-friendly, dan cocok digunakan dalam arsitektur monorepo. Backend juga harus dapat menyediakan API yang stabil bagi dua frontend penelitian, yaitu VueJS dan Svelte.

## Decision
Backend menggunakan ElysiaJS dengan Bun runtime sebagai backend API. ElysiaJS dipilih karena berorientasi pada TypeScript, memiliki performa tinggi, dan menyediakan integrasi yang baik dengan Eden Treaty.

## Consequences
Dampak positif:

- Setup ringan.
- Cocok dengan TypeScript.
- Performa tinggi.
- Terintegrasi dengan Eden Treaty.

Dampak negatif:

- Ekosistem lebih muda dibanding Express atau NestJS.
- Perlu memastikan kompatibilitas deployment.

# ADR-002: Menggunakan Eden Treaty untuk Type-Safe API Client

## Status
Accepted

## Context
Frontend VueJS dan Svelte harus mengonsumsi API yang sama dengan type safety. Karena kedua frontend digunakan untuk eksperimen perbandingan, struktur kontrak API perlu dijaga agar tidak terjadi perbedaan implementasi konsumsi data.

## Decision
Backend menggunakan Eden Treaty agar frontend mendapatkan contract API secara type-safe dari backend Elysia. Type `App` dari backend akan diekspor dan digunakan oleh frontend sebagai dasar pembuatan client API.

## Consequences
Dampak positif:

- Mengurangi mismatch antara backend dan frontend.
- Autocomplete dan inference TypeScript lebih baik.
- Tidak perlu code generation manual.

Dampak negatif:

- Coupling antara frontend dan backend lebih kuat.
- Perlu struktur monorepo yang rapi.

# ADR-003: Menggunakan PostgreSQL dan Drizzle ORM sebagai Data Layer

## Status
Accepted

## Context
Penelitian berfokus pada performa frontend, tetapi backend tetap membutuhkan sumber data yang terstruktur dan mendekati pola aplikasi nyata. Project sudah memiliki package `packages/db` yang mendefinisikan schema PostgreSQL menggunakan Drizzle ORM. Agar data listing, relasi entity, dan query behavior lebih eksplisit, backend sebaiknya membaca data dari PostgreSQL melalui Drizzle, bukan dari array lokal di dalam backend.

## Decision
Backend menggunakan PostgreSQL sebagai database dan Drizzle ORM sebagai query/schema layer. Schema database ditempatkan di package `packages/db`, sedangkan `apps/api` mengakses database melalui repository layer. Service layer tidak menjalankan query database secara langsung, tetapi memanggil repository untuk mengambil data properti, lokasi, tipe properti, host, fasilitas, gambar properti, dan wishlist simulation state.

## Consequences
Dampak positif:

- Struktur data lebih sesuai dengan relasi ERD.
- Query relasional, join, filter, sorting, dan pagination lebih realistis.
- Schema database dapat dikelola secara eksplisit melalui Drizzle.
- Repository layer membuat akses database lebih mudah diuji dan diganti.

Dampak negatif:

- Setup awal membutuhkan PostgreSQL dan konfigurasi `DATABASE_URL`.
- Perlu menjaga seed data dan migration agar hasil eksperimen tetap konsisten.
- Latency database dapat memengaruhi pengukuran jika environment tidak dikontrol.

# ADR-004: Backend sebagai Variabel Kontrol Penelitian

## Status
Accepted

## Context
Penelitian membandingkan VueJS dan Svelte. Agar perbandingan lebih adil, backend harus menyediakan kondisi data yang konsisten bagi kedua frontend.

## Decision
Backend Elysia digunakan sebagai data provider yang sama untuk kedua frontend. Endpoint, data PostgreSQL, seed data, response shape, filtering logic, sorting logic, dan pagination logic harus sama.

## Consequences
Dampak positif:

- Perbandingan frontend lebih adil.
- Dataset dan endpoint konsisten.
- Response shape seragam.

Dampak negatif:

- Performa backend tetap dapat memengaruhi hasil network.
- Perlu menjaga environment pengujian tetap sama.

# ADR-005: Menggunakan REST-like Endpoint dengan JSON Response

## Status
Accepted

## Context
Frontend membutuhkan data listing dan detail properti secara sederhana, stabil, dan mudah diukur. REST-like endpoint dengan JSON response cukup untuk kebutuhan prototipe dan lebih mudah digunakan dalam eksperimen frontend.

## Decision
Backend menggunakan endpoint REST-like dengan JSON response. Endpoint utama mencakup health check, daftar properti, detail properti, lokasi, tipe properti, dan fasilitas.

## Consequences
Dampak positif:

- Mudah dipahami.
- Mudah diuji.
- Cocok untuk fetch dari frontend Vue dan Svelte.

Dampak negatif:

- Tidak sefleksibel GraphQL.
- Beberapa response bisa mengalami overfetching jika tidak dirancang dengan baik.

# ADR-006: Menggunakan Pagination API untuk Pola Load More Frontend dan Wishlist Dummy

## Status
Accepted

## Context

Prototipe membutuhkan daftar properti yang dapat menampilkan data tambahan secara bertahap dan tombol wishlist untuk mensimulasikan interaksi pengguna. Kedua kebutuhan tersebut harus tetap sederhana dan tidak menambah kompleksitas backend yang tidak diperlukan untuk penelitian frontend.

## Decision

Backend menggunakan pagination berbasis `page` dan `limit` sebagai mekanisme pengambilan data. Frontend dapat menyajikannya sebagai pagination biasa atau pola `load more`. Pada pola `load more`, frontend mempertahankan hasil yang sudah dimuat dan menambahkan data dari halaman berikutnya berdasarkan `meta.hasMore`.

Wishlist disediakan sebagai state dummy melalui field `isWishlisted` pada response listing dan detail. Toggle wishlist dilakukan pada state lokal frontend. Tidak dibuat endpoint mutasi wishlist, autentikasi, atau penyimpanan permanen pada tahap prototipe.

## Consequences

Dampak positif:

- Kontrak API tetap sederhana dan dapat digunakan oleh kedua frontend.
- Pola pagination dan `load more` menghasilkan query yang deterministik.
- Wishlist cukup untuk menguji interaksi UI tanpa membangun sistem akun.
- Tidak ada operasi database tambahan untuk setiap toggle wishlist.

Dampak negatif:

- Wishlist dapat kembali ke nilai awal setelah refresh atau state lokal dihapus.
- Wishlist tidak tersinkronisasi antar-browser atau antar-frontend.
- Frontend harus menjaga agar query halaman berikutnya tetap menggunakan search, filter, dan sorting yang sama.
