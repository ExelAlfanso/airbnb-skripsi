# Eden Treaty Contract Plan dan Struktur Folder Backend

## Eden Treaty Contract Plan

Backend ElysiaJS harus mengekspor type `App` agar dapat digunakan oleh Eden Treaty pada frontend VueJS dan Svelte. Tujuannya adalah agar kedua frontend mendapatkan type-safe API client dari kontrak backend yang sama.

Contoh konsep backend:

```ts
export const app = new Elysia()
  .use(propertyRoutes)
  .use(locationRoutes)
  .use(amenityRoutes)

export type App = typeof app
```

Frontend VueJS dan Svelte dapat menggunakan type `App` tersebut untuk membuat client API.

Contoh konsep penggunaan di frontend:

```ts
import { treaty } from '@elysiajs/eden'
import type { App } from '@repo/api'

export const api = treaty<App>('http://localhost:3000')
```

Dokumen ini tidak mendefinisikan implementasi penuh. Potongan di atas hanya menjelaskan kontrak arsitektur yang harus dijaga saat backend mulai dikembangkan.

## Implikasi untuk Monorepo

Agar Eden Treaty dapat digunakan dengan baik, package backend perlu mengekspos type `App` melalui entry package. Dengan demikian, frontend dapat melakukan import type dari package API tanpa perlu mengakses file internal secara langsung.

Prinsip yang perlu dijaga:

- Backend menjadi sumber kebenaran kontrak API.
- Frontend hanya mengonsumsi type public dari package API.
- Struktur package harus stabil agar import antar workspace tidak mudah rusak.
- Perubahan endpoint harus dianggap sebagai perubahan kontrak yang berdampak pada dua frontend.

Data yang dikembalikan endpoint berasal dari PostgreSQL melalui Drizzle ORM. Backend Elysia tidak menyimpan dataset lokal sebagai sumber utama. Akses database dilakukan lewat repository layer agar route tetap tipis dan service layer tidak bergantung langsung pada detail query.

## Rekomendasi Struktur Folder Backend

```txt
apps/api/
|-- src/
|   |-- index.ts
|   |-- app.ts
|   |-- db/
|   |   `-- client.ts
|   |-- routes/
|   |   |-- health.route.ts
|   |   |-- property.route.ts
|   |   |-- location.route.ts
|   |   |-- property-type.route.ts
|   |   `-- amenity.route.ts
|   |-- services/
|   |   |-- property.service.ts
|   |   |-- location.service.ts
|   |   |-- property-type.service.ts
|   |   `-- amenity.service.ts
|   |-- repositories/
|   |   |-- property.repository.ts
|   |   |-- location.repository.ts
|   |   |-- property-type.repository.ts
|   |   |-- amenity.repository.ts
|   |   `-- wishlist.repository.ts
|   |-- schemas/
|   |   |-- property.schema.ts
|   |   |-- query.schema.ts
|   |   `-- error.schema.ts
|   |-- mappers/
|   |   |-- property.mapper.ts
|   |   `-- pagination.mapper.ts
|   `-- types/
|       |-- property.type.ts
|       `-- api-response.type.ts
|-- package.json
`-- tsconfig.json
```

## Fungsi Tiap Folder

### src/index.ts

Entry point runtime Bun. File ini bertanggung jawab menjalankan server, menentukan port, dan memanggil app Elysia yang sudah didefinisikan di `app.ts`.

### src/app.ts

Tempat komposisi utama Elysia app. File ini menggabungkan route module dan mengekspor `app` serta type `App` untuk Eden Treaty.

### src/db

Berisi konfigurasi client database untuk `apps/api`. File `client.ts` membuat koneksi PostgreSQL dan instance Drizzle dengan schema dari `packages/db`. Folder ini hanya mengurus wiring database, bukan business logic.

### src/routes

Berisi definisi endpoint HTTP. Route sebaiknya hanya menangani request, validasi input, response status, dan pemanggilan service.

### src/services

Berisi business logic ringan seperti validasi alur, normalisasi query, pemilihan repository method, pagination policy, dan mapping entity menjadi response model. Service tidak boleh menulis query SQL/Drizzle secara langsung.

### src/repositories

Berisi akses data ke PostgreSQL melalui Drizzle ORM. Repository bertanggung jawab membuat query, join, where clause, sorting, limit, offset, dan operasi count. Folder ini menjadi batas utama antara business logic API dan detail database.

`wishlist.repository.ts` bersifat opsional untuk menyediakan nilai awal `WishlistState` jika seed database digunakan. Pada prototipe, toggle wishlist dilakukan di state lokal frontend sehingga tidak ada repository atau endpoint mutasi wishlist yang wajib diimplementasikan.

### src/schemas

Berisi schema validasi request, query parameter, response, dan error. Schema ini penting untuk menjaga kontrak API tetap eksplisit dan konsisten.

### src/mappers

Berisi fungsi mapping dari hasil query Drizzle ke response API seperti `PropertyListItem`, `PropertyDetail`, dan `PaginatedResponse`. Mapper membantu menjaga repository fokus pada query dan service fokus pada alur bisnis.

### src/types

Berisi type TypeScript yang digunakan lintas route, service, dan frontend melalui Eden Treaty.

## Hubungan dengan packages/db

Package `packages/db` menjadi tempat schema Drizzle dan konfigurasi migration. Schema yang sudah ada mencakup:

- `amenities`
- `hosts`
- `locations`
- `properties`
- `propertyAmenities`
- `propertyImages`
- `propertyTypes`
- `wishlistStates`

`wishlistStates` hanya digunakan sebagai data awal atau response state bila diperlukan. Tabel tersebut bukan berarti wishlist sudah menjadi fitur akun permanen; persistence, authentication, dan operasi mutasi wishlist berada di luar scope prototipe.

Backend `apps/api` sebaiknya mengimpor schema dari `packages/db`, bukan mendefinisikan ulang table di dalam API package. Jika ada perubahan struktur tabel, perubahan dilakukan di `packages/db`, lalu repository di `apps/api` menyesuaikan query.

## Catatan Implementasi Tahap Berikutnya

Implementasi backend sebaiknya dimulai dari koneksi database dan health route. Setelah itu, buat repository untuk data referensi seperti locations, property-types, dan amenities. Lanjutkan dengan service dan route untuk data referensi, kemudian implementasikan listing properties dengan query behavior yang sudah didefinisikan, lalu detail property berdasarkan ID.
