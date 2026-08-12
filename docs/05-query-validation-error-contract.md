# Query Behavior, Validation Rules, dan Error Contract

## Query Behavior GET /properties

Endpoint `GET /properties` harus memiliki perilaku query yang deterministik agar kedua frontend memperoleh hasil yang sama untuk kombinasi parameter yang sama.

### Search

Search mencari berdasarkan:

- title
- city
- province
- country
- property type

Search bersifat case-insensitive. Input search sebaiknya diproses dengan normalisasi dasar seperti trim whitespace dan lowercase comparison.

### Location Filter

Filter location dapat mencocokkan:

- location id
- city
- displayName

Pencocokan location sebaiknya case-insensitive untuk city dan displayName.

### Type Filter

Filter type dapat mencocokkan:

- propertyType id
- propertyType slug

Slug digunakan agar frontend dapat mengirim parameter yang stabil dan mudah dibaca.

### Price Filter

- minPrice menyaring property dengan `pricePerNight >= minPrice`.
- maxPrice menyaring property dengan `pricePerNight <= maxPrice`.

Jika minPrice dan maxPrice diberikan bersamaan, backend harus menerapkan keduanya.

### Capacity Filter

- guests menyaring property dengan `maxGuests >= guests`.
- bedrooms menyaring property dengan `bedrooms >= bedrooms`.
- beds menyaring property dengan `beds >= beds`.
- bathrooms menyaring property dengan `bathrooms >= bathrooms`.

Filter kapasitas menggunakan logika minimum agar properti yang lebih besar tetap termasuk dalam hasil.

### Amenity Filter

Jika amenities diberikan, properti harus memiliki semua amenity yang diminta. Logika yang digunakan adalah AND, bukan OR.

Contoh: jika parameter amenities berisi `wifi,pool`, maka properti harus memiliki Wi-Fi dan pool sekaligus.

### Sorting

- recommended: urutan default berdasarkan isGuestFavorite, rating, dan reviewCount.
- price_asc: harga termurah ke termahal.
- price_desc: harga termahal ke termurah.
- rating_desc: rating tertinggi ke terendah.

Sorting recommended harus deterministik. Jika beberapa properti memiliki skor yang sama, backend dapat menggunakan `createdAt` atau `id` sebagai tie-breaker.

### Pagination

- page dimulai dari 1.
- limit default 12.
- limit maksimal 50.
- response harus mengembalikan total, totalPages, dan hasMore.

Pagination diterapkan setelah search, filter, dan sorting selesai dilakukan.

### Load More pada Frontend

Load more menggunakan endpoint dan pagination yang sama, bukan mekanisme query baru.

- Request pertama mengambil `page=1`.
- Request berikutnya mengambil `page + 1` dengan seluruh parameter search, filter, dan sorting yang sama.
- Frontend menggabungkan `data` dari response berikutnya ke hasil yang sudah ditampilkan.
- Frontend hanya boleh meminta halaman berikutnya jika `meta.hasMore` bernilai `true`.
- Request tambahan tidak boleh mengganti hasil lama atau mengulang halaman yang sudah berhasil dimuat.
- Jika query berubah, frontend harus mengosongkan hasil lama dan mengulang dari `page=1`.
- Saat tidak ada hasil tambahan, response tetap menggunakan array `data` dan `meta.hasMore = false`.

Karena sorting harus deterministik, tie-breaker pada sorting juga penting untuk mencegah item berpindah antar halaman saat frontend melakukan beberapa request `load more`.

## Wishlist Dummy

Wishlist dummy merupakan state UI dan bukan bagian dari query filtering atau sorting.

- Nilai awal wishlist diberikan melalui field `isWishlisted` pada response properti.
- Toggle dilakukan secara lokal di frontend.
- Toggle wishlist tidak mengubah hasil pencarian, filter, sorting, atau pagination.
- Tidak ada validasi `userId` dan tidak ada error contract khusus untuk toggle wishlist.
- State tidak wajib bertahan setelah refresh dan tidak disinkronkan antar sesi, browser, atau frontend penelitian.

## Validation Rules

Aturan validasi query adalah sebagai berikut:

- page harus number positif.
- limit harus number positif dan maksimal 50.
- minPrice tidak boleh negatif.
- maxPrice tidak boleh negatif.
- maxPrice harus lebih besar atau sama dengan minPrice.
- guests harus number positif.
- bedrooms harus number positif.
- beds harus number positif.
- bathrooms harus number positif.
- sort hanya boleh salah satu dari enum yang disediakan.
- amenities dapat berupa array string atau comma-separated string.

## Error Contract

Backend harus menggunakan format error response yang konsisten untuk semua endpoint.

```ts
type ApiErrorResponse = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
```

### 400 Bad Request

Digunakan ketika query parameter tidak valid.

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid query parameter",
    "details": {
      "field": "minPrice",
      "reason": "minPrice must be a positive number"
    }
  }
}
```

Contoh kondisi:

- page bernilai 0 atau negatif.
- limit lebih besar dari 50.
- minPrice bernilai negatif.
- maxPrice lebih kecil dari minPrice.
- sort tidak termasuk enum yang didukung.

### 404 Not Found

Digunakan ketika property ID tidak ditemukan.

```json
{
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property not found"
  }
}
```

### 500 Internal Server Error

Digunakan ketika terjadi error tidak terduga.

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Unexpected server error"
  }
}
```

## Catatan Konsistensi Error

Frontend VueJS dan Svelte harus menerima bentuk error yang sama. Oleh karena itu, backend tidak boleh mengembalikan error dalam format yang berbeda antar endpoint.
