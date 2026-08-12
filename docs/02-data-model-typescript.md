# TypeScript Data Model

## Tujuan Data Model

Data model TypeScript digunakan sebagai rancangan tipe data awal untuk backend ElysiaJS dan API client Eden Treaty. Tipe ini membantu menjaga konsistensi struktur data antara backend, frontend VueJS, dan frontend Svelte.

Sumber data aktual berasal dari PostgreSQL yang didefinisikan melalui Drizzle ORM pada package `packages/db`. TypeScript data model pada dokumen ini adalah bentuk entity dan response yang diekspos oleh API, bukan pengganti schema database. Jika ada perbedaan antara field database dan response API, service layer bertanggung jawab melakukan mapping.

## Core Entity Types

```ts
export type Property = {
  id: string
  title: string
  slug: string
  description: string
  locationId: string
  propertyTypeId: string
  hostId: string
  pricePerNight: number
  rating: number
  reviewCount: number
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  isGuestFavorite: boolean
  createdAt: string
  updatedAt: string
}

export type Location = {
  id: string
  city: string
  province: string
  country: string
  displayName: string
}

export type PropertyType = {
  id: string
  name: string
  slug: string
}

export type Host = {
  id: string
  name: string
  avatarUrl: string
  joinedYear: number
  isSuperhost: boolean
}

export type Amenity = {
  id: string
  name: string
  iconName: string
}

export type PropertyImage = {
  id: string
  propertyId: string
  imageUrl: string
  altText: string
  sortOrder: number
  isCover: boolean
}

export type PropertyAmenity = {
  propertyId: string
  amenityId: string
}

export type WishlistState = {
  propertyId: string
  isWishlisted: boolean
}
```

## Response Model Types

```ts
export type PropertyListItem = {
  id: string
  title: string
  slug: string
  location: Location
  propertyType: PropertyType
  pricePerNight: number
  rating: number
  reviewCount: number
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  coverImage: PropertyImage | null
  isGuestFavorite: boolean
  isWishlisted: boolean
}

export type PropertyDetail = {
  id: string
  title: string
  slug: string
  description: string
  location: Location
  propertyType: PropertyType
  host: Host
  pricePerNight: number
  rating: number
  reviewCount: number
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  images: PropertyImage[]
  amenities: Amenity[]
  isGuestFavorite: boolean
  isWishlisted: boolean
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export type ApiErrorResponse = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
```

## Frontend State untuk Load More

Tipe berikut adalah rancangan state lokal frontend, bukan response API baru:

~~~ts
export type LoadMoreListState<T> = {
  items: T[]
  page: number
  hasMore: boolean
  isLoading: boolean
}
~~~

Aturan penggunaannya:

- `items` berisi gabungan data dari seluruh halaman yang sudah berhasil diambil.
- `page` menyimpan halaman terakhir yang berhasil dimuat.
- `hasMore` diambil dari `response.meta.hasMore`.
- `isLoading` mencegah request `load more` ganda ketika request sebelumnya belum selesai.
- Search, filter, atau sorting baru harus mengosongkan `items`, mengatur `page` kembali ke `1`, lalu mengambil data awal.

## Query Types

```ts
export type SortOption =
  | 'recommended'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'

export type PropertyQueryParams = {
  search?: string
  location?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  guests?: number
  bedrooms?: number
  beds?: number
  bathrooms?: number
  amenities?: string[]
  sort?: SortOption
  page?: number
  limit?: number
}
```

## Wishlist Dummy pada Response

Field `isWishlisted` pada `PropertyListItem` dan `PropertyDetail` menyediakan status awal untuk UI wishlist. Pada tahap prototipe, frontend boleh mengubah nilai tersebut di state lokal saat pengguna menekan tombol wishlist.

Tidak ada `userId`, session wishlist, atau endpoint `POST`, `PUT`, maupun `DELETE` khusus wishlist dalam kontrak API. Karena itu, perubahan status tidak dianggap sebagai perubahan data permanen dan dapat kembali ke nilai awal setelah refresh atau state aplikasi dihapus.

## Perbedaan PropertyListItem dan PropertyDetail

### PropertyListItem

PropertyListItem digunakan untuk response listing agar payload lebih ringan. Model ini hanya memuat field yang dibutuhkan oleh card listing, filter result, atau search result.

Field minimal:

- id
- title
- slug
- location
- propertyType
- pricePerNight
- rating
- reviewCount
- maxGuests
- bedrooms
- beds
- bathrooms
- coverImage
- isGuestFavorite
- isWishlisted

### PropertyDetail

PropertyDetail digunakan untuk response halaman detail properti. Model ini memuat informasi yang lebih lengkap, termasuk deskripsi, host, semua gambar, dan semua fasilitas.

Field minimal:

- id
- title
- slug
- description
- location
- propertyType
- host
- pricePerNight
- rating
- reviewCount
- maxGuests
- bedrooms
- beds
- bathrooms
- images
- amenities
- isGuestFavorite
- isWishlisted

Pemisahan kedua model ini penting agar listing page tidak menerima data berlebihan, sementara detail page tetap memperoleh data lengkap yang diperlukan untuk tampilan detail.
