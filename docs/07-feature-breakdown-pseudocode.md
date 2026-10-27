# Breakdown Fitur dan Pseudocode

Dokumen ini merinci fitur yang saat ini ada di workspace `behance-skripsi` berdasarkan source code, kontrak API, test, dan batasan skripsi. Pseudocode di bawah menjelaskan alur perilaku; pseudocode bukan kode siap jalan.

## 1. Ruang lingkup dan pembagian sistem

### 1.1 Produk yang dibangun

Workspace terdiri atas:

| Bagian | Fungsi |
| --- | --- |
| Vue frontend | Treatment frontend untuk penelitian, port lokal `3000` |
| Svelte frontend | Treatment frontend untuk penelitian, port lokal `5173` |
| React frontend | Implementasi reference/parity, port lokal `3002` |
| API Elysia | Sumber data dan kontrak yang dipakai semua frontend |
| Database package | Schema SQLite/D1, migrasi, dan seed katalog yang sama |
| Lighthouse dashboard | Membaca dan membandingkan artifact Lighthouse di browser lokal |
| Analisis Python | Statistik deskriptif dan inferensial untuk pasangan run Vue-Svelte |
| Skripsi LaTeX | Manuskrip, metodologi, hasil, dan interpretasi penelitian |

### 1.2 Alur umum

```text
Pengguna membuka frontend
  -> frontend membaca URL dan filter awal
  -> frontend mengambil opsi filter dan halaman properti dari API
  -> API membaca snapshot repository
  -> API memvalidasi, mencari, memfilter, mengurutkan, dan mem-paginate data
  -> frontend menampilkan kartu dan status UI
  -> pengguna dapat membuka detail, memuat halaman berikutnya, atau toggle wishlist lokal
```

### 1.3 Aturan parity penelitian

Vue dan Svelte harus memiliki perilaku terlihat yang sama untuk:

- dataset, API, label, route, default filter, dan nilai awal wishlist;
- pencarian, filter, sorting, pagination/load more, detail, dan kembali ke hasil;
- loading, error, empty state, retry, keyboard access, dan nama aksesibel;
- browser, viewport, cache, API, aset, dan urutan pengujian ketika diukur.

React adalah reference/parity implementation. React tidak masuk kesimpulan utama Vue versus Svelte kecuali metode penelitian diubah.

### 1.4 Di luar ruang lingkup

Fitur berikut tidak disediakan oleh prototipe:

- authentication dan authorization;
- booking nyata, pembayaran, dan ketersediaan realtime;
- chat;
- dashboard host/admin;
- submission review;
- peta realtime;
- wishlist akun yang persisten atau sinkron antarperangkat;
- algoritme rekomendasi kompleks.

## 2. Model data katalog

### 2.1 Entity

Entity pada `packages/db/schemas/index.ts`:

- `locations`: kota, provinsi, negara, dan label lokasi;
- `propertyTypes`: nama dan slug tipe properti;
- `hosts`: identitas host, avatar, tahun bergabung, status superhost;
- `amenities`: fasilitas dan nama ikon;
- `properties`: properti, harga, rating, jumlah ulasan, kapasitas, dan metadata;
- `propertyImages`: gambar, alt text, urutan, dan penanda cover;
- `propertyAmenities`: relasi many-to-many properti dan amenitas;
- `wishlistStates`: nilai wishlist awal per properti.

### 2.2 Inisialisasi database lokal

```text
FUNCTION createLocalPropertyCatalogRepository()
    buat SQLite database in-memory
    aktifkan foreign_keys
    ambil semua file migrasi .sql
    urutkan file migrasi berdasarkan nama
    UNTUK setiap migrasi:
        eksekusi SQL migrasi
    eksekusi packages/db/seeds/catalog.sql
    buat Drizzle repository dari database
    RETURN repository
END FUNCTION
```

Catatan: implementasi aktif memakai SQLite in-memory untuk development. Dokumen blueprint lama menyebut PostgreSQL, tetapi source code dan migrasi sekarang memakai SQLite/D1.

### 2.3 Snapshot repository

```text
FUNCTION getSnapshot()
    secara paralel SELECT semua tabel katalog
    RETURN {
        amenities,
        hosts,
        locations,
        properties,
        propertyAmenities,
        propertyImages,
        propertyTypes,
        wishlistStates
    }
END FUNCTION
```

Repository hanya mengembalikan data. Validasi query, filter, sorting, pagination, dan mapping response berada di service.

## 3. Fitur API

### 3.1 Komposisi aplikasi dan CORS

```text
FUNCTION createApp(repository)
    buat Elysia app
    pasang CORS untuk GET dan OPTIONS
    pasang systemModule
    pasang propertyCatalogModule(repository)
    RETURN app
END FUNCTION
```

API mengekspor `app` dan type `App`. Type tersebut dipakai Eden Treaty untuk client type-safe di frontend.

### 3.2 Endpoint sistem

#### `GET /`

```text
WHEN GET /
    RETURN { name: "@airbnb-skripsi/api", status: "ok" }
END
```

#### `GET /health`

```text
WHEN GET /health
    RETURN { status: "ok" }
END
```

#### Route tidak dikenal

```text
WHEN request path tidak memiliki route
    RETURN HTTP 404
END
```

### 3.3 Endpoint opsi filter

Endpoint:

- `GET /locations`
- `GET /property-types`
- `GET /amenities`

```text
FUNCTION listCatalogOptions()
    locations = repository snapshot.locations
    propertyTypes = repository snapshot.propertyTypes
    amenities = repository snapshot.amenities
    RETURN masing-masing array sesuai endpoint
END FUNCTION
```

Frontend memuat ketiganya secara paralel saat katalog dibuka.

### 3.4 Parsing dan validasi query `GET /properties`

Default:

- `page = 1`;
- `limit = 12` di API;
- `sort = recommended`.

Nilai valid:

- `page >= 1`;
- `1 <= limit <= 50`;
- `minPrice >= 0`;
- `maxPrice >= 0` dan `maxPrice >= minPrice`;
- `guests`, `bedrooms`, `beds`, `bathrooms >= 1`;
- `sort` salah satu `recommended`, `price_asc`, `price_desc`, `rating_desc`;
- `amenities` dapat berupa array atau string dipisah koma.

```text
FUNCTION parsePropertyQuery(rawQuery)
    minPrice = parseOptionalNumber(rawQuery.minPrice, minimum=0)
    maxPrice = parseOptionalNumber(rawQuery.maxPrice, minimum=0)
    IF ada error:
        RETURN BAD_REQUEST(field, reason)

    IF minPrice dan maxPrice ada DAN maxPrice < minPrice:
        RETURN BAD_REQUEST("maxPrice", "maxPrice must be greater than or equal to minPrice")

    guests = parseOptionalNumber(rawQuery.guests, minimum=1)
    bedrooms = parseOptionalNumber(rawQuery.bedrooms, minimum=1)
    beds = parseOptionalNumber(rawQuery.beds, minimum=1)
    bathrooms = parseOptionalNumber(rawQuery.bathrooms, minimum=1)
    page = parseOptionalNumber(rawQuery.page, minimum=1) ATAU 1
    limit = parseOptionalNumber(rawQuery.limit, minimum=1, maximum=50) ATAU 12
    sort = parseSort(rawQuery.sort) ATAU "recommended"

    IF salah satu parser gagal:
        RETURN BAD_REQUEST

    RETURN query ter-normalisasi dengan string kosong menjadi undefined
END FUNCTION
```

Format error:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid query parameter",
    "details": {
      "field": "maxPrice",
      "reason": "maxPrice must be greater than or equal to minPrice"
    }
  }
}
```

### 3.5 Search teks

Search bersifat case-insensitive dan mencari pada judul properti, kota, provinsi, negara, display name lokasi, nama tipe, dan slug tipe.

```text
FUNCTION matchesSearch(property, location, propertyType, search)
    IF search kosong:
        RETURN true
    keyword = trim(search).toLowerCase()
    searchableValues = [
        property.title,
        location.city,
        location.province,
        location.country,
        location.displayName,
        propertyType.name,
        propertyType.slug
    ]
    RETURN ada value yang trim(value).toLowerCase().contains(keyword)
END FUNCTION
```

### 3.6 Filter lokasi dan tipe

```text
FUNCTION matchesLocation(location, requested)
    IF requested kosong:
        RETURN true
    target = normalize(requested)
    RETURN normalize(location.id) == target
        OR normalize(location.city) == target
        OR normalize(location.displayName) == target
END FUNCTION

FUNCTION matchesType(propertyType, requested)
    IF requested kosong:
        RETURN true
    target = normalize(requested)
    RETURN normalize(propertyType.id) == target
        OR normalize(propertyType.slug) == target
END FUNCTION
```

### 3.7 Filter harga

Batas harga bersifat inklusif.

```text
FUNCTION matchesPrice(property, query)
    IF query.minPrice ada DAN property.pricePerNight < query.minPrice:
        RETURN false
    IF query.maxPrice ada DAN property.pricePerNight > query.maxPrice:
        RETURN false
    RETURN true
END FUNCTION
```

### 3.8 Filter kapasitas

Semua filter kapasitas berarti minimum yang harus dipenuhi properti.

```text
FUNCTION matchesCapacity(property, query)
    RETURN property.maxGuests >= query.guests jika guests ada
       DAN property.bedrooms >= query.bedrooms jika bedrooms ada
       DAN property.beds >= query.beds jika beds ada
       DAN property.bathrooms >= query.bathrooms jika bathrooms ada
END FUNCTION
```

### 3.9 Filter amenitas dengan AND

Jika beberapa amenitas diminta, properti harus memiliki semuanya.

```text
FUNCTION matchesAmenities(snapshot, propertyId, requestedAmenities)
    IF requestedAmenities tidak ada:
        RETURN true

    propertyAmenityIds = semua amenity untuk propertyId
    amenityTokens = gabungkan id, name, dan iconName setiap amenity

    FOR requested IN requestedAmenities:
        IF tidak ada token yang sama setelah normalize:
            RETURN false
    RETURN true
END FUNCTION
```

### 3.10 Menggabungkan semua filter

```text
FUNCTION matchesQuery(snapshot, property, query)
    location = cari relasi property.locationId
    propertyType = cari relasi property.propertyTypeId

    RETURN matchesSearch(property, location, propertyType, query.search)
       AND matchesLocation(location, query.location)
       AND matchesType(propertyType, query.type)
       AND matchesPrice(property, query)
       AND matchesCapacity(property, query)
       AND matchesAmenities(snapshot, property.id, query.amenities)
END FUNCTION
```

Jika relasi wajib tidak ada, service melempar error relasi katalog yang hilang agar data seed tidak diam-diam menghasilkan response rusak.

### 3.11 Sorting deterministik

```text
FUNCTION sortProperties(properties, sort)
    salin properties agar input tidak berubah

    IF sort == price_asc:
        urutkan pricePerNight naik, lalu id naik
    ELSE IF sort == price_desc:
        urutkan pricePerNight turun, lalu id naik
    ELSE IF sort == rating_desc:
        urutkan rating turun, lalu id naik
    ELSE:
        urutkan:
            isGuestFavorite turun
            rating turun
            reviewCount turun
            createdAt menurun
            id naik

    RETURN hasil terurut
END FUNCTION
```

### 3.12 Pagination dan listing response

```text
FUNCTION listProperties(repository, rawQuery)
    query = parsePropertyQuery(rawQuery)
    IF query invalid:
        RETURN HTTP 400 dengan ApiErrorResponse

    snapshot = repository.getSnapshot()
    filtered = filter semua snapshot.properties dengan matchesQuery
    sorted = sortProperties(filtered, query.sort)

    total = panjang sorted
    totalPages = ceil(total / query.limit)
    start = (query.page - 1) * query.limit
    pageItems = sorted.slice(start, start + query.limit)

    RETURN {
        data: map setiap item dengan toListItem(snapshot, item),
        meta: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
            hasMore: query.page < totalPages
        }
    }
END FUNCTION
```

### 3.13 Mapping list item

```text
FUNCTION toListItem(snapshot, property)
    RETURN {
        id, title, slug,
        location: relasi location,
        propertyType: relasi propertyType,
        pricePerNight, rating, reviewCount,
        maxGuests, bedrooms, beds, bathrooms,
        coverImage: image dengan isCover=true atau null,
        isGuestFavorite,
        isWishlisted: nilai awal dari wishlistStates atau false
    }
END FUNCTION
```

### 3.14 Detail properti berdasarkan ID atau slug

```text
FUNCTION getPropertyDetail(repository, identifier)
    snapshot = repository.getSnapshot()
    property = cari property dengan id == identifier ATAU slug == identifier

    IF property tidak ditemukan:
        RETURN HTTP 404 {
            error: { code: "PROPERTY_NOT_FOUND", message: "Property not found" }
        }

    images = semua gambar property, urutkan sortOrder naik
    amenities = semua amenity yang terhubung melalui propertyAmenities

    RETURN {
        id, title, slug, description,
        location, propertyType, host,
        pricePerNight, rating, reviewCount,
        maxGuests, bedrooms, beds, bathrooms,
        images, amenities, isGuestFavorite,
        isWishlisted: nilai awal atau false
    }
END FUNCTION
```

## 4. Fitur bersama frontend

Fungsi katalog berikut diduplikasi secara sengaja di Vue, Svelte, dan React agar masing-masing app dapat dibuild dan diuji secara mandiri dengan kontrak API yang sama.

### 4.1 Default filter

```text
FUNCTION createDefaultFilters()
    RETURN {
        search: "",
        location: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        guests: "",
        bedrooms: "",
        beds: "",
        bathrooms: "",
        amenities: [],
        sort: "recommended"
    }
END FUNCTION
```

Setiap pemanggilan menghasilkan array amenitas baru agar perubahan satu form tidak membocorkan state ke form lain.

### 4.2 Memuat opsi katalog

```text
FUNCTION fetchCatalogOptions()
    secara paralel GET /locations
    secara paralel GET /property-types
    secara paralel GET /amenities

    IF salah satu response error atau data null:
        throw "Gagal memuat <resource>. Coba lagi."

    RETURN { locations, propertyTypes, amenities }
END FUNCTION
```

### 4.3 Membangun query API

```text
FUNCTION buildQuery(filters, page, limit)
    query = { page, limit, sort: filters.sort }
    UNTUK setiap field teks/numerik:
        jika trim(value) tidak kosong:
            query[field] = trim(value)
    IF filters.amenities tidak kosong:
        query.amenities = join(filters.amenities, ",")
    RETURN query
END FUNCTION
```

Limit halaman frontend saat ini:

- Vue: `6` item per request;
- Svelte: `6` item per request;
- React: `4` item per request.

Perbedaan React ini harus dianggap ketika membandingkan journey atau parity. API sendiri tetap default `12` jika limit tidak dikirim.

### 4.4 Parsing filter dari URL

```text
FUNCTION parseCatalogFilters(searchParams)
    filters = createDefaultFilters()
    baca search, location, type, minPrice, maxPrice,
         guests, bedrooms, beds, bathrooms
    amenities = split parameter amenities dengan koma
    trim setiap amenity
    buang string kosong
    deduplikasi amenity

    IF sort termasuk daftar yang didukung:
        filters.sort = sort
    ELSE:
        filters.sort = "recommended"

    RETURN filters
END FUNCTION
```

### 4.5 Menyimpan filter ke URL

```text
FUNCTION createCatalogSearchParams(filters, currentParams)
    salin currentParams
    hapus semua key filter yang dikelola katalog
    tambahkan hanya value non-empty
    IF amenities ada:
        set amenities sebagai id dipisah koma
    IF sort != "recommended":
        set sort
    RETURN params
END FUNCTION
```

Parameter query lain yang bukan milik katalog dipertahankan.

### 4.6 Route detail

```text
FUNCTION createPropertyPath(slug)
    RETURN "/properties/" + encodeURIComponent(slug)
END FUNCTION

FUNCTION parsePropertySlug(pathname)
    IF pathname cocok /properties/<segment>:
        coba decodeURIComponent(segment)
        RETURN hasil trim jika tidak kosong
    RETURN null
END FUNCTION
```

Router dibuat dengan History API, bukan library router.

### 4.7 Format harga dan gambar

```text
FUNCTION formatPrice(value)
    RETURN Intl.NumberFormat("id-ID", currency IDR, tanpa pecahan).format(value)
END FUNCTION

FUNCTION optimizeImage(url, width=900)
    separator = url memiliki "?" ? "&" : "?"
    RETURN url + separator + "auto=format&fit=crop&w=" + width + "&q=78"
END FUNCTION
```

URL gambar berasal dari dataset eksternal yang sama. Parameter optimasi ditambahkan tanpa mengganti sumber gambar.

### 4.8 Unwrap response Eden

```text
FUNCTION unwrap(result, resource)
    IF result.error ada ATAU result.data == null:
        throw Error("Gagal memuat " + resource + ". Coba lagi.")
    RETURN result.data
END FUNCTION
```

## 5. Fitur katalog pada frontend

### 5.1 Inisialisasi halaman

```text
ON frontend mount:
    slug = parsePropertySlug(window.location.pathname)
    IF slug ada:
        buka detail(slug, updateUrl=false)
    ELSE:
        filters = parseCatalogFilters(window.location.search)
        secara paralel:
            loadCatalogOptions()
            loadPropertyList(reset=true, page=1)
END
```

Vue memasang/menghapus listener `popstate` pada lifecycle component. Svelte menggunakan `<svelte:window onpopstate>`. React memasang listener melalui `useEffect`.

### 5.2 State utama

```text
STATE options = { amenities: [], locations: [], propertyTypes: [] }
STATE filters = createDefaultFilters()
STATE properties = []
STATE pagination = null
STATE selectedSlug = null
STATE detail = null
STATE wishlistStates = map/dictionary propertyId -> boolean
STATE loadingOptions, loadingList, loadingDetail = false
STATE optionsError, listError, detailError = null
STATE listRequestId = 0
STATE detailRequestId = 0
```

Request ID mencegah response lama menimpa hasil request terbaru.

### 5.3 Memuat daftar properti

```text
FUNCTION loadPropertyList(activeFilters, page, append)
    requestId = increment listRequestId
    loadingList = true
    listError = null

    TRY:
        response = fetchPropertyPage(activeFilters, page)
        IF requestId bukan request terbaru:
            RETURN

        IF append:
            properties = properties + response.data
        ELSE:
            properties = response.data

        pagination = response.meta
        mergeWishlist(response.data)
    CATCH error:
        IF requestId masih terbaru:
            listError = messageFrom(error)
    FINALLY:
        IF requestId masih terbaru:
            loadingList = false
END FUNCTION
```

### 5.4 Search, filter, dan reset

Form menyimpan draft lokal. Submit baru menjalankan query.

```text
ON submit search form:
    nextFilters = salin draft form
    filters = nextFilters
    update URL dengan nextFilters
    clear detail
    loadPropertyList(nextFilters, page=1, append=false)
END

ON reset filter:
    submit createDefaultFilters()
END
```

Field yang tersedia:

- search keyword;
- lokasi;
- tipe properti;
- sorting;
- harga minimum dan maksimum;
- tamu minimum;
- jumlah kamar tidur;
- jumlah tempat tidur;
- jumlah kamar mandi;
- amenitas wajib.

### 5.5 Sorting

Opsi yang ditampilkan:

```text
SORT_OPTIONS = [
    { label: "Rekomendasi", value: "recommended" },
    { label: "Harga terendah", value: "price_asc" },
    { label: "Harga tertinggi", value: "price_desc" },
    { label: "Rating tertinggi", value: "rating_desc" }
]
```

Sorting tidak langsung memutasi data di browser. Nilainya dikirim ke API saat form disubmit, lalu hasil dimulai ulang dari halaman 1.

### 5.6 Load more

```text
ON click "Muat lebih banyak":
    IF pagination == null OR pagination.hasMore == false:
        jangan request
    nextPage = pagination.page + 1
    loadPropertyList(filters, nextPage, append=true)

IF response.meta.hasMore == true:
    tampilkan tombol
ELSE:
    tampilkan "Semua properti sudah ditampilkan."
```

Saat query berubah, hasil lama diganti dan page kembali ke 1. Data halaman berikutnya ditambahkan, bukan menggantikan data lama.

### 5.7 Kartu properti

```text
FOR setiap property pada properties:
    tampilkan coverImage jika ada
    jika coverImage null:
        tampilkan placeholder "Foto belum tersedia"
    tampilkan tipe, rating, judul, lokasi
    tampilkan maxGuests, bedrooms, beds
    tampilkan harga per malam dalam Rupiah
    jika isGuestFavorite:
        tampilkan badge "Favorit tamu"
    sediakan tombol gambar dan judul untuk membuka detail
    sediakan tombol hati untuk toggle wishlist
END FOR
```

Kartu pertama memakai loading/fetch priority tinggi. Kartu lain memakai lazy loading. Ukuran gambar eksplisit dipasang untuk membantu stabilitas layout.

### 5.8 Membuka detail

```text
FUNCTION openProperty(slug, updateUrl=true)
    requestId = increment detailRequestId
    selectedSlug = slug
    detail = null
    detailError = null
    loadingDetail = true

    IF updateUrl:
        simpan URL katalog pada history.state
        pushState ke /properties/<encoded-slug>

    scroll ke atas dengan smooth behavior

    TRY:
        detail = fetchPropertyDetail(slug)
        IF requestId bukan request terbaru:
            RETURN
        mergeWishlist([detail])
    CATCH error:
        IF requestId masih terbaru:
            detailError = messageFrom(error)
    FINALLY:
        IF requestId masih terbaru:
            loadingDetail = false
END FUNCTION
```

### 5.9 Halaman detail

```text
IF loadingDetail:
    tampilkan "Memuat detail properti..."
ELSE IF detailError:
    tampilkan error dan tombol "Kembali ke hasil"
ELSE:
    tampilkan tombol kembali
    tampilkan tipe dan lokasi
    tampilkan judul, rating, jumlah ulasan, badge favorit
    tampilkan tombol wishlist
    tampilkan gallery semua gambar berdasarkan sortOrder
    tampilkan ringkasan tamu, kamar, tempat tidur, kamar mandi
    tampilkan deskripsi
    tampilkan daftar amenitas
    tampilkan host, avatar, tahun bergabung, status superhost
    tampilkan kartu harga, lokasi, kapasitas, rating
END IF
```

Gambar pertama detail memakai width 1400 dan eager/high priority. Gambar berikutnya memakai width 800 dan lazy loading. Avatar host memakai width 144.

### 5.10 Kembali dari detail

```text
FUNCTION closeDetail()
    IF history.state.catalogUrl tersedia:
        history.back()
        RETURN

    pushState ke "/"
    restore filters dari URL
    clear detail
    initialize katalog
    scroll ke atas
END FUNCTION
```

### 5.11 Sinkronisasi browser history

```text
ON popstate:
    slug = parsePropertySlug(window.location.pathname)
    IF slug ada:
        openProperty(slug, updateUrl=false)
    ELSE:
        restore filters dari query URL
        clear detail
        loadPropertyList(page=1, append=false)
END
```

### 5.12 Wishlist lokal

Nilai awal berasal dari API, tetapi toggle tidak mengirim request mutasi.

```text
FUNCTION mergeWishlist(items)
    FOR item IN items:
        IF item.id belum ada pada wishlistStates:
            wishlistStates[item.id] = item.isWishlisted
END FUNCTION

FUNCTION toggleWishlist(propertyId)
    wishlistStates[propertyId] = NOT (wishlistStates[propertyId] OR false)
END FUNCTION
```

State yang sama dipakai card dan detail selama sesi frontend aktif. Refresh, penghapusan state, atau pindah ke frontend lain boleh mengembalikan nilai awal API.

### 5.13 Loading, error, empty, dan retry

```text
IF loadingList AND properties kosong:
    tampilkan skeleton grid
ELSE IF listError atau optionsError:
    tampilkan alert error dan tombol "Coba lagi"
ELSE IF properties kosong:
    tampilkan "Tidak ada properti yang cocok dengan filter ini."
    tampilkan tombol "Reset filter"
ELSE:
    tampilkan property grid dan kontrol load more
END IF
```

Error detail memiliki state sendiri agar kegagalan detail tidak menghapus state katalog.

### 5.14 Aksesibilitas dan responsivitas

```text
render:
    sediakan skip link ke #main-content
    gunakan heading dan section yang berlabel
    gunakan label terlihat pada field
    gunakan aria-live untuk jumlah hasil dan loading
    gunakan role=alert untuk error
    gunakan aria-pressed pada wishlist dan filter tab
    gunakan alt text dari dataset untuk gambar
    sediakan focus-visible dan navigasi keyboard
    hormati reduced motion pada CSS
END
```

## 6. Fitur dashboard Lighthouse

Dashboard pada `apps/lighthouse-dashboard` memproses file lokal di browser. File tidak dikirim ke server.

### 6.1 Memilih folder artifact

```text
ON user memilih folder:
    ambil semua File
    pilih file dengan nama *.report.json atau lhr.json
    abaikan manifest dan file lain
    parse semua kandidat secara paralel
    simpan report valid
    simpan pesan error untuk report yang gagal
    urutkan report berdasarkan fetchTime terbaru
END
```

### 6.2 Menentukan framework report

```text
FUNCTION inferFramework(path, url)
    cari segment folder "vue", "svelte", atau "react"
    IF ditemukan:
        RETURN framework dari folder

    baca port URL:
        3000 -> vue
        5173 -> svelte
        3002 -> react

    IF tidak dikenali:
        throw error
END FUNCTION
```

### 6.3 Validasi dan parsing report Lighthouse

```text
FUNCTION parseLighthouseReport(text, fileName, path)
    root = JSON.parse(text)
    IF root tidak memiliki audits dan categories:
        throw "bukan report Lighthouse lengkap"

    baca lighthouseVersion, fetchTime, URL
    IF metadata tidak lengkap:
        throw "metadata report tidak lengkap"

    framework = inferFramework(path, URL)
    baca score performance, accessibility, best-practices, SEO
    baca audit numericValue untuk:
        FCP, LCP, Speed Index, TBT, CLS
    baca resource-summary untuk:
        total transfer, JavaScript transfer, request count
    baca runWarnings
    kumpulkan audit berskor < 1 sebagai actionable audits
    RETURN LighthouseRun
END FUNCTION
```

### 6.4 Metric definition dan status

Metrik yang ditampilkan:

- Performance score;
- FCP;
- LCP;
- Speed Index;
- TBT;
- CLS;
- total transfer;
- JavaScript transfer;
- request count.

```text
FUNCTION metricStatus(value, definition)
    IF value null atau threshold good null:
        RETURN neutral

    IF direction == higher:
        IF value >= good: RETURN good
        IF value >= warning: RETURN needs-improvement
        RETURN poor

    IF value <= good: RETURN good
    IF value <= warning: RETURN needs-improvement
    RETURN poor
END FUNCTION
```

Threshold utama repository:

| Metrik | Good/budget |
| --- | ---: |
| Performance score | >= 90 |
| FCP | <= 1800 ms |
| LCP | <= 2500 ms |
| Speed Index | <= 3400 ms |
| TBT | <= 200 ms |
| CLS | <= 0,10 |
| JavaScript transfer | warning > 150 KB |

### 6.5 Median dan comparison table

```text
FUNCTION median(values)
    IF values kosong:
        RETURN null
    sorted = salin dan urutkan numeric naik
    IF jumlah ganjil:
        RETURN nilai tengah
    RETURN rata-rata dua nilai tengah
END FUNCTION

FOR setiap metricDefinition:
    FOR framework IN [vue, svelte, react]:
        values = semua nilai metric dari report framework
        middle = median(values)
        minimum = min(values) jika ada
        maximum = max(values) jika ada
        tampilkan middle, rentang, dan n
        tandai status dari middle
END FOR
```

Vue dan Svelte ditandai `treatment`. React ditandai `reference` dan tidak digunakan dalam kesimpulan utama penelitian.

### 6.6 Run browser dan detail report

```text
state reports = []
state selectedId = ""
state frameworkFilter = "all"

ON filter framework:
    tampilkan semua report atau hanya framework terpilih

ON pilih run:
    tampilkan URL, waktu fetch, score kategori,
    metrik lengkap, audit actionable, warning,
    versi Lighthouse, form factor, dan nama file

FOR setiap actionable audit maksimal 12:
    tampilkan score, title, displayValue/category
    saat detail dibuka, tampilkan description dan audit id
END
```

## 7. Fitur pengukuran performa terkontrol

### 7.1 Lighthouse per framework

```text
FUNCTION runLighthouseConfig(framework)
    build production frontend
    start API dan preview frontend
    jalankan Lighthouse desktop sebanyak 20 run
    gunakan URL frontend sesuai framework
    terapkan budget yang sama
    tulis report ke artifacts/lighthouse/<framework>
END FUNCTION
```

### 7.2 Paired Lighthouse Vue-Svelte

```text
FUNCTION runPairedLighthouse(pairCount=20)
    build Vue dan Svelte production
    start kedua server dengan API yang sama
    check journey TA-01 sampai TA-05 pada kedua framework
    FOR pairId dari 1 sampai pairCount:
        IF pairId ganjil:
            order = [vue, svelte]
        ELSE:
            order = [svelte, vue]

        FOR framework IN order:
            jalankan Lighthouse pada route /
            validasi runtime error, finalUrl, dan lima audit utama
            simpan report pair-<id>-<framework>.json

        tulis manifest dengan pair_id, order, dan lokasi kedua report
    simpan journey-checks.json
END FUNCTION
```

Pair harus berasal dari blok dan kondisi yang sama. Batch terpisah atau report React tidak boleh dimasukkan ke inferensi Vue-Svelte.

### 7.3 Journey fungsional TA-01 sampai TA-05

```text
TA-01:
    search Kaliurang
    buka filter lanjutan
    set tamu minimum 4
    submit
    pastikan Kabin Kayu Tenang di Kaliurang tampil

TA-02:
    pilih lokasi Canggu
    pilih tipe Villa
    set harga maksimum 1.500.000
    set tamu minimum 6
    centang Private Pool dan Wi-Fi
    submit
    pastikan Villa Tropis dengan Kolam Renang tampil

TA-03:
    pilih sorting harga terendah
    submit
    pastikan item pertama Guesthouse Nyaman untuk Remote Work

TA-04:
    search Senggigi dan tamu minimum 10
    buka detail Villa Pantai Senggigi untuk Grup
    simpan ke wishlist
    kembali ke hasil
    pastikan tombol card menunjukkan state tersimpan

TA-05:
    pastikan 6 card awal tampil
    click Muat lebih banyak
    pastikan request page=2 berhasil
    pastikan 6 card tambahan ditambahkan
    pastikan card halaman pertama tetap ada
END
```

### 7.4 Scripted session INP

```text
FUNCTION measureScenario(framework, scenario)
    buka browser context baru 390x844
    aktifkan mobile context dan CPU throttle 4x
    buka production frontend
    tunggu 6 properti dan tombol search siap
    pasang PerformanceObserver untuk Event Timing >= 16 ms

    IF scenario == search:
        isi Canggu
        ukur click submit sampai hasil 2 properti tampil
    ELSE IF scenario == advanced-filter:
        pilih Senggigi, Villa, tamu 6
        ukur check Kitchen sampai hasil 1 properti tampil
    ELSE:
        ukur click wishlist sampai aria-pressed true

    ambil durasi maksimum tiap interactionId
    jika tidak ada entry:
        RETURN inpMs=16 dan belowReportingThreshold=true
    RETURN durasi terbesar
END FUNCTION
```

Script menjalankan 3 run per scenario, menggilir urutan framework dan urutan scenario, lalu menyimpan median, kuartil, IQR, min, dan max. Ini adalah scripted session INP laboratorium, bukan field INP populasi.

## 8. Fitur analisis statistik Python

### 8.1 Membaca pasangan report

```text
FUNCTION loadPairedReports(manifestPath)
    pairs = baca manifest.json
    validasi jumlah pasangan utama = 20
    validasi pair_id berurutan dan unik

    FOR pair IN pairs:
        baca report Vue dan Svelte
        IF salah satu hilang:
            throw "pasangan tidak lengkap"
        validasi report dapat dibaca
    RETURN pasangan lengkap
END FUNCTION
```

### 8.2 Ekstraksi dan statistik deskriptif

```text
FOR setiap pair dan framework:
    ekstrak FCP, LCP, Speed Index, TBT, CLS
    ekstrak JavaScript transfer, total transfer, request count
    simpan pair_id, framework, scenario, metric, value

FOR setiap metric dan framework:
    hitung n, mean, SD, median, Q1, Q3, IQR, min, max
    simpan descriptive.csv
END FOR
```

### 8.3 Selisih berpasangan

```text
FOR setiap scenario dan metric utama:
    pivot data berdasarkan pair_id
    validasi setiap pair memiliki Vue dan Svelte
    differences = Vue_values - Svelte_values
    meanDifference = mean(differences)
END FOR
```

Interpretasi tanda:

- `difference > 0`: nilai Vue lebih tinggi;
- untuk FCP, LCP, Speed Index, TBT, dan CLS, nilai lebih rendah lebih baik;
- resource transfer dan request count juga dibaca sebagai biaya yang lebih rendah lebih baik.

### 8.4 Pemilihan uji

```text
FUNCTION analyzeMetric(differences)
    jika selisih tidak konstan:
        shapiroP = ShapiroWilk(differences)
    jika selisih mendekati normal (shapiroP > 0.05):
        test = paired t-test terhadap mean 0
        pRaw = hasil p-value
    ELSE:
        test = paired permutation test dua arah
        pRaw = sign-flip permutation p-value

    ci = bootstrap percentile 95% dengan resampling pasangan utuh
    effect = meanDifference / SD(differences) jika SD != 0
    RETURN n, meanDifference, SD, ci, test, statistic, pRaw, Cohen dz
END FUNCTION
```

### 8.5 Permutasi berpasangan

```text
FUNCTION pairedPermutationPValue(differences, resamples=100000)
    observed = abs(mean(differences))
    FOR setiap resample:
        pilih sign +1 atau -1 untuk setiap pasangan
        simulated = abs(mean(sign * differences))
    p = (jumlah simulated >= observed + 1) / (resamples + 1)
    RETURN p
END FUNCTION
```

Label Vue dan Svelte hanya ditukar di dalam pasangan. Ini menjaga korespondensi blok eksperimen.

### 8.6 Bootstrap interval dan koreksi Holm

```text
FUNCTION pairedCI(differences, resamples=20000)
    FOR setiap resample:
        ambil ulang differences dengan replacement
        simpan mean resample
    RETURN percentile 2.5% dan 97.5%
END FUNCTION

FUNCTION holmAdjust(pValues)
    urutkan p-value dari kecil ke besar
    FOR rank, p IN urutan:
        adjusted = max(adjusted sebelumnya, (m - rank) * p)
        batasi maksimum 1
    kembalikan adjusted ke index awal
END FUNCTION
```

Keputusan:

```text
IF pHolm < 0.05:
    decision = "Tolak H0"
ELSE:
    decision = "Gagal menolak H0"
END IF
```

Notebook juga membuat Q-Q plot untuk FCP, LCP, dan Speed Index serta CSV yang dipakai `export_thesis_charts.py`.

### 8.7 Chart untuk skripsi

```text
FUNCTION exportThesisCharts()
    baca descriptive.csv dan inferential.csv
    buat bar mean +/- SD untuk FCP, LCP, Speed Index
    buat bar transfer JavaScript dan total transfer
    buat bar mean selisih Vue - Svelte dengan bootstrap CI
    simpan PNG ke apps/skripsi-exel/img
END FUNCTION
```

## 9. Evaluasi UX dalam metodologi skripsi

Bagian ini adalah fitur/prosedur penelitian, bukan endpoint aplikasi.

### 9.1 Skenario tugas pengguna

Tugas harus mencakup:

- mencari lokasi dan kapasitas tamu;
- memakai kombinasi filter;
- mengurutkan harga termurah;
- membuka detail, menyimpan wishlist, dan kembali;
- memuat halaman berikutnya.

```text
FOR setiap responden:
    tentukan urutan prototipe A-B atau B-A secara seimbang
    pada setiap prototipe:
        moderator memberi tujuan tugas tanpa mengajarkan langkah
        responden menyelesaikan tugas
        moderator mencatat berhasil/gagal, waktu, error, dan observasi
        responden mengisi UEQ setelah rangkaian tugas
        rekam Think Aloud selama pelaksanaan jika sesi menggunakannya
END FOR
```

### 9.2 UEQ

```text
FOR setiap responden dan prototipe:
    ambil 26 jawaban UEQ skala 1..7
    konversi sesuai polaritas item ke -3..+3
    hitung enam skala:
        Attractiveness
        Perspicuity
        Efficiency
        Dependability
        Stimulation
        Novelty
    simpan score per skala

FOR setiap skala dan prototipe:
    hitung n, mean, SD, median, IQR, min, max
    hitung selisih Vue - Svelte per responden secara deskriptif
END FOR
```

Metodologi aktif melaporkan UEQ secara deskriptif; tidak menggabungkannya menjadi SUS atau satu skor total.

### 9.3 Think Aloud

```text
FOR setiap rekaman sesi:
    transkrip ucapan dan observasi tindakan
    tandai ekspektasi, kebingungan, error, dan strategi pemulihan
    kelompokkan temuan berdasarkan tugas/fitur
    catat bukti dan dampak terhadap penyelesaian tugas
    rangkum masalah UX lintas Vue dan Svelte
END FOR
```

## 10. Peta source, caller, test, dan artifact

| Fitur | Source utama | Test/validasi terkait |
| --- | --- | --- |
| Default filter, URL, format harga/gambar | `apps/airbnb-*/src/catalog.*` | `catalog.test.ts` setiap frontend |
| Search/filter/sort/load more/detail/wishlist | `*/components/PropertyExplorer*` | `property-explorer.test.*`, paired journeys |
| Card dan grid | `*/components/PropertyCard*`, `PropertyGrid*` | journey dan integration test |
| Form filter | `*/components/SearchFilters*` | integration test dan journey |
| Detail | `*/components/PropertyDetail*` | detail flow integration test |
| Query, mapping, pagination | `apps/api/src/modules/property-catalog/service.ts` | `apps/api/test/property-catalog.test.ts` |
| Route dan schema response | `apps/api/src/modules/property-catalog/index.ts`, `model.ts` | API route tests |
| Health, app info, CORS | `apps/api/src/modules/system/*`, `create-app.ts` | `system.test.ts` |
| SQLite local repository dan Worker D1 | `local-repository.ts`, `cloudflare-app.ts`, `worker.ts` | `worker.test.ts` |
| Schema, migrasi, seed | `packages/db/schemas`, `migrations`, `seeds/catalog.sql` | API integration terhadap repository |
| Dashboard Lighthouse | `apps/lighthouse-dashboard/src/app.tsx`, `lighthouse.ts` | `lighthouse.test.ts` |
| Paired Lighthouse | `tests/performance/run-paired-lighthouse.cjs`, `paired-journeys.cjs` | `journey-checks.json`, manifest, report JSON |
| Scripted INP | `tests/performance/inp/inp.spec.ts` | `artifacts/inp/results.json` |
| Statistik dan chart | `apps/pengujian_python/analisis_pengujian.ipynb`, `export_thesis_charts.py` | `descriptive.csv`, `inferential.csv`, PNG chart |

## 11. Fitur pendukung dan deployment

### 11.1 Client Cloudflare R2

Package `packages/r2` menyediakan utilitas object storage, tetapi katalog saat ini memakai URL gambar eksternal sehingga R2 belum menjadi jalur runtime katalog.

```text
FUNCTION getR2Config(env)
    validasi R2_ACCOUNT_ID
    validasi R2_ACCESS_KEY_ID
    validasi R2_SECRET_ACCESS_KEY
    validasi R2_BUCKET
    baca R2_PUBLIC_BASE_URL jika ada
    RETURN konfigurasi R2
END FUNCTION

FUNCTION createR2Client(config)
    RETURN S3-compatible client dengan endpoint account R2
END FUNCTION

FUNCTION createObjectKey(folder, fileName)
    hapus slash awal/akhir folder dan fileName
    IF folder ada:
        RETURN folder + "/" + fileName
    RETURN fileName
END FUNCTION
```

Operasi object yang tersedia:

```text
createUploadUrl(key, contentType, expiresIn=900)
    buat signed PUT URL

createDownloadUrl(key, expiresIn=900)
    buat signed GET URL

getPublicObjectUrl(key)
    jika publicBaseUrl tidak ada, RETURN null
    gabungkan base URL dengan key

objectExists(key)
    jalankan HEAD object
    jika berhasil RETURN true
    jika error RETURN false

deleteObject(key)
    jalankan DELETE object
END
```

### 11.2 Deployment Alchemy dan Cloudflare

```text
FUNCTION deployStack()
    provision Cloudflare D1 CatalogDatabase
    jalankan migrasi dari packages/db/migrations
    import packages/db/seeds/catalog.sql
    provision API Worker dengan binding DB
    provision Website Vite Vue dengan VITE_API_URL = API URL
    provision Website Vite Svelte dengan VITE_API_URL = API URL
    provision Website Vite React dengan VITE_API_URL = API URL
    RETURN URL dan identifier resource
END FUNCTION
```

Worker membuat repository Drizzle D1 dari binding `DB`, lalu menggunakan komposisi API yang sama dengan server lokal. Deployment tidak boleh dijalankan ke resource Cloudflare tanpa otorisasi eksplisit.

## 12. Risiko parity dan batas interpretasi

- Limit Vue/Svelte saat ini 6, sedangkan React 4; jangan memakai React sebagai treatment ketiga tanpa revisi metode.
- API default limit 12 berbeda dari limit frontend; ini normal selama setiap frontend mengirim limit eksplisit yang sama untuk studi Vue-Svelte.
- Wishlist hanya state sesi frontend dan tidak memiliki endpoint mutasi.
- Gambar eksternal dapat menambah variasi network pada Lighthouse.
- TBT adalah proxy lab untuk responsivitas; scripted INP juga bukan field INP populasi.
- 20 pasangan Lighthouse adalah replikasi teknis pada konfigurasi laboratorium, bukan sampel semua perangkat/pengguna.
- Dokumen blueprint awal yang menyebut PostgreSQL atau response `/health` dengan field `service` perlu dibaca sebagai rancangan lama; perilaku aktual mengikuti source code saat ini.

Dokumen ini sengaja tidak menambahkan authentication, booking, pembayaran, chat, peta, calendar realtime, persistence wishlist, atau fitur admin karena semuanya berada di luar scope yang ditetapkan.

## 13. Perbandingan implementasi kode Vue dan Svelte

Bagian ini membandingkan cara fitur yang sama ditulis pada treatment Vue dan Svelte. Perbandingan berfokus pada struktur, alur data, reaktivitas, dan konsekuensi pemeliharaan. Perbandingan ini tidak menyimpulkan bahwa satu framework lebih baik hanya dari jumlah baris atau gaya syntax.

### 13.1 Peta file yang dibandingkan

| Tanggung jawab | Vue | Svelte | Perilaku yang harus sama |
| --- | --- | --- | --- |
| API client, filter, URL, formatter | `apps/airbnb-vue-app/src/catalog.ts` | `apps/airbnb-svelte-app/src/catalog.ts` | query, default, parsing URL, format harga, optimasi gambar |
| Orkestrasi katalog | `components/PropertyExplorer.vue` | `components/PropertyExplorer.svelte` | load options/list/detail, history, request guard, state UI |
| Form search/filter | `components/SearchFilters.vue` | `components/SearchFilters.svelte` | field, label, submit, reset, disabled state |
| Grid | `components/PropertyGrid.vue` | `components/PropertyGrid.svelte` | key item, priority card pertama, forwarding action |
| Card | `components/PropertyCard.vue` | `components/PropertyCard.svelte` | cover, metadata, price, favorite, wishlist, open detail |
| Detail | `components/PropertyDetail.vue` | `components/PropertyDetail.svelte` | gallery, facts, description, amenity, host, price, wishlist |
| Integration test | `src/components/property-explorer.test.ts` | `src/components/property-explorer.test.ts` | journey search, filter, detail, URL/popstate, wishlist |

`catalog.ts` pada kedua frontend hampir sama secara algoritme. Perbedaan utama berada pada cara framework menghubungkan state dan markup.

### 13.2 Bentuk component

#### Vue

```text
<script setup lang="ts">
    import dependency
    defineProps<Props>()
    defineEmits<Emits>()
    state dan function
</script>

<template>
    markup Vue
</template>
```

Vue memakai Single File Component dengan `script setup`, template deklaratif, `defineProps`, dan `defineEmits`.

#### Svelte

```text
<script lang="ts">
    import dependency
    let { props }: Props = $props()
    state dan function dengan runes
</script>

markup Svelte
```

Svelte menyatukan markup dengan script dan menggunakan `$props()` serta runes `$state`/`$derived`.

### 13.3 Reaktivitas state utama

| Konsep | Vue | Svelte |
| --- | --- | --- |
| Data API besar | `shallowRef` dan assignment `.value` | `$state.raw` dan assignment ulang |
| Nilai turunan | `computed` | `$derived` |
| Initial load | `onMounted` | `onMount` |
| Listener history | `onMounted` + `onUnmounted` | `<svelte:window onpopstate={...}>` |
| Wishlist | `Map<string, boolean>` baru setiap toggle | `Record<string, boolean>` baru setiap toggle |
| Form draft | `reactive` object | `$state` object |

Pseudocode ekuivalen:

```text
Vue:
    properties = shallowRef([])
    properties.value = response.data
    resultLabel = computed(() => pagination.value.total + " properti ditemukan")

Svelte:
    properties = $state.raw([])
    properties = response.data
    resultLabel = $derived(`${pagination?.total ?? 0} properti ditemukan`)
```

Kedua implementasi memilih replacement root untuk response API. Ini menghindari proxying mendalam pada payload katalog yang hanya dibaca oleh template.

### 13.4 Props dan komunikasi parent-child

#### Vue: props down, events up

```text
Parent:
    <PropertyCard
        :property="property"
        :wishlisted="wishlistStates.get(property.id)"
        @open="openProperty"
        @toggle-wishlist="toggleWishlist"
    />

Child:
    props = defineProps<Props>()
    emit = defineEmits<Emits>()
    saat click:
        emit("open", property.slug)
END
```

#### Svelte: props down, callback props up

```text
Parent:
    <PropertyCard
        property={property}
        wishlisted={wishlistStates[property.id]}
        openProperty={openProperty}
        toggleWishlist={toggleWishlist}
    />

Child:
    let { property, wishlisted, openProperty, toggleWishlist } = $props()
    saat click:
        openProperty(property.slug)
END
```

Vue menggunakan event component yang dinamai eksplisit. Svelte menggunakan function callback sebagai prop. Hasil observable sama: child tidak mengubah state katalog secara langsung.

### 13.5 Form filter

| Perilaku | Vue | Svelte |
| --- | --- | --- |
| Salin initial filter | `reactive(copyFilters(props.initialFilters))` | `$state(untrack(() => copyFilters(initialFilters)))` |
| Input teks/select | `v-model="draft.field"` | `bind:value={draft.field}` |
| Checkbox amenitas | `v-model="draft.amenities"` | `bind:group={draft.amenities}` |
| Submit | `@submit.prevent="submit"` | `onsubmit={submit}` lalu `event.preventDefault()` |
| Reset | `Object.assign(draft, defaults)` | `draft = createDefaultFilters()` |
| Kirim hasil | `emit("search", copyDraft())` | `search(copyDraft())` |

Pseudocode bersama:

```text
ON user mengubah field:
    update draft lokal

ON submit:
    cegah browser reload
    buat copy draft agar child tidak mengirim object mutable
    kirim filter ke PropertyExplorer

ON reset:
    ganti draft dengan default
    minta parent load page 1
END
```

`untrack` di Svelte menjaga initial draft hanya mengambil snapshot awal prop. Di Vue, `copyFilters` juga dipanggil saat setup dan form di-remount menggunakan key baru ketika URL berubah.

### 13.6 Conditional rendering dan list rendering

| Kebutuhan | Vue | Svelte |
| --- | --- | --- |
| Detail/list toggle | `v-if`, `v-else-if`, `v-else` | `{#if}`, `{:else if}`, `{:else}` |
| Kartu | `v-for` | `{#each ... (property.id)}` |
| Detail image | `v-for` dengan `:key` | keyed each dengan `(image.id)` |
| Reset form component | `:key="filterFormKey"` | `{#key filterFormKey}` |
| Conditional class | `:class="{ active: wishlisted }"` | `class={[base, wishlisted && active]}` |

Keduanya menggunakan identity key yang stabil (`property.id`, `image.id`). Svelte menggunakan keyed each secara eksplisit; Vue menggunakan `:key` di `v-for`.

### 13.7 Lifecycle dan browser history

```text
Vue:
    onMounted:
        addEventListener("popstate", handlePopState)
        baca pathname
        initialize atau openProperty
    onUnmounted:
        removeEventListener("popstate", handlePopState)

Svelte:
    onMount:
        baca pathname
        initialize atau openProperty
    <svelte:window onpopstate={handlePopState} />
```

Perbedaan penting: Svelte mendelegasikan lifecycle listener window ke elemen khusus framework, sedangkan Vue mengelola add/remove listener manual.

Alur history keduanya sama:

```text
ON open card:
    simpan URL katalog dalam history.state
    pushState ke /properties/<slug>
    fetch detail

ON back:
    jika catalogUrl ada:
        history.back()
    ELSE:
        pushState ke /
        load katalog

ON popstate:
    jika pathname memiliki slug:
        fetch detail tanpa pushState baru
    ELSE:
        parse query URL
        load catalog page 1
END
```

### 13.8 Async loading dan stale response guard

Implementasi Vue dan Svelte memakai pola request ID yang sama.

```text
FUNCTION loadPropertyList(...)
    requestId = ++listRequestId
    loading = true
    response = await fetch...

    IF requestId != listRequestId:
        abaikan response lama
    ELSE:
        commit properties dan pagination
END FUNCTION

FUNCTION openProperty(...)
    requestId = ++detailRequestId
    detail = null
    response = await fetch...

    IF requestId != detailRequestId:
        abaikan response lama
    ELSE:
        commit detail
END FUNCTION
```

Guard ini penting ketika pengguna submit filter atau membuka detail beberapa kali sebelum request sebelumnya selesai.

### 13.9 Wishlist: perbedaan struktur data

```text
Vue:
    wishlistStates: Map<string, boolean>
    next = new Map(current)
    next.set(id, !current.get(id))
    wishlistStates = next

Svelte:
    wishlistStates: Record<string, boolean>
    wishlistStates = {
        ...wishlistStates,
        [id]: !wishlistStates[id]
    }
```

Perilaku sama: state diubah lokal, tidak ada request mutasi, dan state dibagikan antara card serta detail selama sesi aktif. Bentuk `Map` versus object adalah perbedaan internal yang tidak boleh mengubah output atau journey.

### 13.10 Perbandingan struktur komponen

| Komponen | Vue | Svelte | Penilaian parity |
| --- | --- | --- | --- |
| `PropertyExplorer` | state `shallowRef`, `computed`, lifecycle hooks, template sections | state runes, `$derived`, `onMount`, `<svelte:window>`, markup blocks | alur async dan status harus identik |
| `SearchFilters` | `reactive` + `defineEmits` | `$state` + callback props | field dan nilai submit harus identik |
| `PropertyGrid` | `v-for`, emits forwarding | keyed each, callback forwarding | urutan dan key item harus identik |
| `PropertyCard` | template directive dan typed emits | markup blocks dan typed callbacks | label, alt, aria, priority harus identik |
| `PropertyDetail` | `v-if`/`v-for` dan typed emits | `{#if}`/`{#each}` dan callbacks | isi, urutan, dan hierarchy harus identik |

### 13.11 Ringkasan biaya implementasi yang dapat dibandingkan

```text
Untuk perbandingan kode yang sah:
    bandingkan feature set yang sama
    bandingkan source file dan dependency yang sama-sama diperlukan
    catat kode framework-specific secara terpisah
    jangan menyimpulkan framework dari LOC saja
    ukur bundle dan runtime melalui production build
    validasi output dengan test journey yang sama
END
```

Hal yang dapat dihitung atau didiskusikan:

- jumlah file komponen dan utility;
- jumlah baris implementasi setelah formatter yang sama;
- jumlah dependency framework yang dikirim ke browser;
- ukuran JavaScript transfer;
- jumlah request dan metrik Lighthouse;
- kompleksitas alur state, async, dan routing manual;
- hasil test parity pada journey yang sama.

Hal yang harus dikontrol:

- jangan menilai `v-model` dan `bind:value` sebagai dua fitur berbeda;
- jangan menghitung test atau fixture hanya di satu framework sebagai fitur UI;
- jangan mengubah desain atau API untuk memendekkan kode salah satu treatment;
- jangan mengukur React sebagai treatment ketiga dalam hipotesis Vue-Svelte.
