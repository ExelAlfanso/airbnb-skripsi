# API Contracts

## Prinsip API Contract

API contract dirancang agar frontend VueJS dan Svelte menggunakan endpoint, query parameter, response shape, dan error format yang sama. Kontrak ini menjadi dasar implementasi backend ElysiaJS dan client Eden Treaty pada tahap berikutnya.

## GET /health

### Tujuan

Mengecek status backend.

### Response 200

```json
{
  "status": "ok",
  "service": "property-api"
}
```

## GET /properties

### Tujuan

Mengambil daftar properti untuk listing page dan search page.

### Query Parameters

| Parameter | Type | Required | Keterangan |
| --- | --- | --- | --- |
| search | string | No | Keyword pencarian properti atau lokasi. |
| location | string | No | Location id, city, atau displayName. |
| type | string | No | PropertyType id atau slug. |
| minPrice | number | No | Harga minimum per malam. |
| maxPrice | number | No | Harga maksimum per malam. |
| guests | number | No | Jumlah minimum kapasitas tamu. |
| bedrooms | number | No | Jumlah minimum kamar tidur. |
| beds | number | No | Jumlah minimum tempat tidur. |
| bathrooms | number | No | Jumlah minimum kamar mandi. |
| amenities | string[] | No | Daftar amenity id atau slug/nama yang diminta. |
| sort | SortOption | No | Opsi sorting. |
| page | number | No | Nomor halaman, dimulai dari 1. |
| limit | number | No | Jumlah item per halaman. |

### Default Query

- page = 1
- limit = 12
- sort = "recommended"

### SortOption

```ts
type SortOption = 'recommended' | 'price_asc' | 'price_desc' | 'rating_desc'
```

### Response 200

```ts
PaginatedResponse<PropertyListItem>
```

### Contoh Response JSON

```json
{
  "data": [
    {
      "id": "prop_001",
      "title": "Villa Tropis dengan Kolam Renang",
      "slug": "villa-tropis-kolam-renang",
      "location": {
        "id": "loc_bali_canggu",
        "city": "Canggu",
        "province": "Bali",
        "country": "Indonesia",
        "displayName": "Canggu, Bali"
      },
      "propertyType": {
        "id": "type_villa",
        "name": "Villa",
        "slug": "villa"
      },
      "pricePerNight": 1250000,
      "rating": 4.87,
      "reviewCount": 128,
      "maxGuests": 6,
      "bedrooms": 3,
      "beds": 3,
      "bathrooms": 2,
      "coverImage": {
        "id": "img_001_cover",
        "propertyId": "prop_001",
        "imageUrl": "https://example.com/images/prop_001_cover.jpg",
        "altText": "Tampilan depan villa tropis dengan kolam renang",
        "sortOrder": 1,
        "isCover": true
      },
      "isGuestFavorite": true,
      "isWishlisted": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4,
    "hasMore": true
  }
}
```

### Perilaku Load More pada Frontend

Endpoint ini juga menjadi sumber data untuk pola `load more`. Tidak ada endpoint khusus untuk mengambil data tambahan.

- Request awal menggunakan `GET /properties?page=1&limit=12` beserta parameter search, filter, dan sorting yang aktif.
- Request berikutnya menaikkan nilai `page`, misalnya `page=2`, dengan parameter lainnya tetap sama.
- Frontend menambahkan isi `data` dari response baru ke daftar yang sudah ada.
- `meta.hasMore` harus digunakan untuk menghentikan request dan menyembunyikan atau menonaktifkan tombol `Load more` ketika bernilai `false`.
- Ketika parameter query berubah, frontend harus membuang data lama dan memulai request baru dari `page=1`.

## GET /properties/:id

### Tujuan

Mengambil detail properti berdasarkan ID.

### Path Parameter

| Parameter | Type | Required | Keterangan |
| --- | --- | --- | --- |
| id | string | Yes | ID properti. |

### Response 200

```ts
PropertyDetail
```

### Contoh Response JSON

```json
{
  "id": "prop_001",
  "title": "Villa Tropis dengan Kolam Renang",
  "slug": "villa-tropis-kolam-renang",
  "description": "Villa tropis untuk keluarga dengan area terbuka, kolam renang pribadi, dan akses mudah ke pusat Canggu.",
  "location": {
    "id": "loc_bali_canggu",
    "city": "Canggu",
    "province": "Bali",
    "country": "Indonesia",
    "displayName": "Canggu, Bali"
  },
  "propertyType": {
    "id": "type_villa",
    "name": "Villa",
    "slug": "villa"
  },
  "host": {
    "id": "host_001",
    "name": "Made Pratama",
    "avatarUrl": "https://example.com/avatars/host_001.jpg",
    "joinedYear": 2019,
    "isSuperhost": true
  },
  "pricePerNight": 1250000,
  "rating": 4.87,
  "reviewCount": 128,
  "maxGuests": 6,
  "bedrooms": 3,
  "beds": 3,
  "bathrooms": 2,
  "images": [
    {
      "id": "img_001_cover",
      "propertyId": "prop_001",
      "imageUrl": "https://example.com/images/prop_001_cover.jpg",
      "altText": "Tampilan depan villa tropis dengan kolam renang",
      "sortOrder": 1,
      "isCover": true
    },
    {
      "id": "img_001_living",
      "propertyId": "prop_001",
      "imageUrl": "https://example.com/images/prop_001_living.jpg",
      "altText": "Ruang keluarga villa",
      "sortOrder": 2,
      "isCover": false
    }
  ],
  "amenities": [
    {
      "id": "amenity_pool",
      "name": "Private Pool",
      "iconName": "waves"
    },
    {
      "id": "amenity_wifi",
      "name": "Wi-Fi",
      "iconName": "wifi"
    }
  ],
  "isGuestFavorite": true,
  "isWishlisted": false
}
```

### Response 404

```ts
ApiErrorResponse
```

```json
{
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property not found"
  }
}
```

## Wishlist Dummy

Wishlist dummy tidak memiliki endpoint khusus. Status awal dikirim sebagai field `isWishlisted` pada response `GET /properties` dan `GET /properties/:id`.

Frontend bertanggung jawab untuk:

- Menampilkan status wishlist pada card listing dan halaman detail.
- Melakukan toggle status secara lokal ketika tombol wishlist ditekan.
- Menggunakan state lokal yang sama agar perubahan dari listing dapat terlihat pada detail, dan sebaliknya, selama aplikasi aktif.
- Tidak menganggap toggle sebagai penyimpanan permanen.

Backend tidak menerima atau menyimpan `userId` untuk wishlist pada tahap ini. Tidak ada kontrak `POST`, `PUT`, atau `DELETE` untuk wishlist. Status dapat kembali ke nilai awal setelah refresh, penghapusan state aplikasi, atau perpindahan ke frontend penelitian lainnya.

## GET /locations

### Tujuan

Mengambil daftar lokasi untuk filter.

### Response 200

```ts
Location[]
```

### Contoh Response JSON

```json
[
  {
    "id": "loc_bali_canggu",
    "city": "Canggu",
    "province": "Bali",
    "country": "Indonesia",
    "displayName": "Canggu, Bali"
  },
  {
    "id": "loc_bandung_lembang",
    "city": "Lembang",
    "province": "Jawa Barat",
    "country": "Indonesia",
    "displayName": "Lembang, Jawa Barat"
  }
]
```

## GET /property-types

### Tujuan

Mengambil daftar tipe properti untuk filter.

### Response 200

```ts
PropertyType[]
```

### Contoh Response JSON

```json
[
  {
    "id": "type_villa",
    "name": "Villa",
    "slug": "villa"
  },
  {
    "id": "type_apartment",
    "name": "Apartment",
    "slug": "apartment"
  }
]
```

## GET /amenities

### Tujuan

Mengambil daftar fasilitas untuk filter.

### Response 200

```ts
Amenity[]
```

### Contoh Response JSON

```json
[
  {
    "id": "amenity_pool",
    "name": "Private Pool",
    "iconName": "waves"
  },
  {
    "id": "amenity_wifi",
    "name": "Wi-Fi",
    "iconName": "wifi"
  }
]
```
