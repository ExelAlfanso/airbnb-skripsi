# Breakdown UI/UX Prototipe Listing Properti

Dokumen ini merinci UI dan UX yang saat ini diimplementasikan pada Vue, Svelte, dan React reference. Fokusnya adalah struktur layar, informasi yang terlihat, interaksi pengguna, state, aksesibilitas, responsivitas, dan journey evaluasi.

## 1. Tujuan pengalaman

Pengguna harus dapat:

1. membuka katalog properti;
2. memahami jumlah dan ringkasan hasil;
3. mencari berdasarkan keyword atau lokasi;
4. mempersempit hasil dengan filter dan amenitas;
5. mengurutkan hasil;
6. memuat hasil berikutnya tanpa kehilangan hasil sebelumnya;
7. membuka detail properti;
8. menyimpan atau menghapus wishlist selama sesi;
9. kembali ke hasil dengan filter dan state yang masih masuk akal.

UX yang diuji adalah pengalaman menemukan dan mengeksplorasi properti. Booking, login, pembayaran, chat, kalender, dan peta tidak menjadi bagian alur.

## 2. Arsitektur informasi

```text
App shell
├── Skip link
├── Site header
│   └── Brand Airbnb
└── Main
    ├── Catalog view
    │   ├── Hero introduction
    │   ├── Search and primary filters
    │   ├── Advanced filters
    │   ├── Results heading
    │   ├── Status: loading/error/empty
    │   ├── Property grid
    │   └── Load more
    └── Detail view
        ├── Back to results
        ├── Detail header
        ├── Wishlist action
        ├── Image gallery
        ├── Property facts
        ├── Description
        ├── Amenities
        ├── Host card
        └── Price summary card
```

Route yang digunakan:

| Route | Tampilan | Fungsi |
| --- | --- | --- |
| `/` | Catalog view | mencari, memfilter, mengurutkan, memuat lebih banyak |
| `/?<filters>` | Catalog view dengan state filter dari URL | shareable/reloadable query state |
| `/properties/<slug>` | Detail view | membaca detail dan toggle wishlist |

## 3. Prinsip visual yang dipakai

Source CSS runtime berada di `packages/styles/styles.css`. `DESIGN.md` menjadi referensi analisis desain yang lebih luas.

### 3.1 Warna

| Token | Nilai | Peran |
| --- | --- | --- |
| `--ink` | `#222222` | teks utama, tombol gelap |
| `--muted` | `#6a6a6a` | teks sekunder |
| `--surface` | `#ffffff` | background dan kartu |
| `--surface-soft` | `#f7f7f7` | panel sekunder, skeleton |
| `--border` | `#e5e5e5` | garis pemisah ringan |
| `--border-strong` | `#b0b0b0` | border field dan tombol sekunder |
| `--brand` | `#ff385c` | brand, CTA, wishlist aktif |
| `--brand-dark` | `#c13515` | hover/error accent |
| `--brand-soft` | `#fff0f3` | background badge dan amenitas |
| `--focus` | `#1769aa` | outline keyboard |

### 3.2 Bentuk dan elevasi

- panel search: radius `1.25rem`, shadow besar;
- card image: radius `1rem`;
- detail gallery: radius `1.5rem`;
- button dan badge: radius pill `999px`;
- status panel: border dashed dan radius `1.25rem`;
- price card: shadow medium dan sticky di desktop.

### 3.3 Tipografi dan hierarki

```text
Brand/header      -> identitas dan orientasi
Hero h1           -> tujuan utama halaman
Results h2        -> jumlah hasil dan konteks katalog
Card title        -> nama properti yang dapat dipilih
Metadata          -> tipe, rating, lokasi, kapasitas
Price             -> informasi keputusan utama
Muted text        -> konteks tambahan tanpa mengalahkan CTA
```

Headline hero dan detail memakai ukuran responsif dengan `clamp`. Label field menggunakan uppercase kecil dan letter spacing agar mudah dipindai.

## 4. Breakdown layar katalog

### 4.1 Header

Elemen:

- skip link tersembunyi sampai menerima focus;
- brand berbentuk mark `A` dan teks Airbnb;
- border bawah untuk memisahkan header dari konten.

Pseudocode:

```text
render Header
    render link brand ke "/"
    render aria-label "Airbnb beranda"
    render skip link ke #main-content
END
```

Tujuan UX: pengguna tahu konteks produk dan pengguna keyboard dapat langsung melewati navigasi.

### 4.2 Hero

Konten saat ini:

- heading: `Temukan tempat singgah.`;
- copy: mencari akomodasi dengan pencarian/filter lalu membaca detail.

Pseudocode:

```text
render section.hero dengan aria-labelledby="hero-title"
    render h1#hero-title
    render paragraph penjelas tujuan
    render SearchFilters
END
```

Tujuan UX: menjelaskan tugas utama sebelum pengguna menyentuh form.

### 4.3 Search panel

Panel dibagi dua:

#### Primary search

- Cari: input `type=search`;
- Lokasi: select dari `/locations`;
- Tipe: select dari `/property-types`;
- tombol `Cari properti`.

#### Secondary controls

- Urutkan;
- disclosure `Filter lanjutan`;
- tombol `Reset filter`.

Pseudocode:

```text
render form.search-panel aria-busy=loading
    render primary fields
    render secondary sort/reset
    render advanced disclosure

ON submit:
    prevent default browser navigation
    validate/normalize draft di sisi API melalui query contract
    kirim filter ke parent
END
```

Search tidak mengirim request setiap karakter. Request terjadi saat pengguna menekan submit.

### 4.4 Filter lanjutan

Disclosure menyembunyikan detail sampai dibutuhkan sehingga panel awal tetap ringkas.

Field:

| Field | Input | Batas UI | Makna |
| --- | --- | --- | --- |
| Harga minimum | number | `min=0` | harga per malam paling rendah |
| Harga maksimum | number | `min=0` | harga per malam paling tinggi |
| Tamu minimum | number | `min=1` | kapasitas minimum |
| Kamar tidur | number | `min=1` | jumlah kamar minimum |
| Tempat tidur | number | `min=1` | jumlah tempat tidur minimum |
| Kamar mandi | number | `min=1` | jumlah kamar mandi minimum |
| Amenitas wajib | checkbox group | — | semua pilihan harus dimiliki properti |

Pseudocode:

```text
ON open "Filter lanjutan":
    tampilkan field harga, kapasitas, amenitas
    rotate indicator plus menjadi tanda close

ON check amenity:
    masukkan amenity.id ke draft.amenities

ON submit:
    parent mengirim semua field sekaligus ke API
END
```

UI membolehkan input kosong. Validasi angka dan relasi min/max menjadi tanggung jawab API, sehingga error contract tetap satu untuk semua frontend.

### 4.5 Results heading

Menampilkan:

- label `Katalog akomodasi`;
- jumlah hasil, misalnya `6 properti ditemukan`;
- halaman saat ini dan total halaman ketika metadata tersedia.

Heading jumlah memakai `aria-live="polite"` agar perubahan hasil dapat diumumkan tanpa memotong interaksi pengguna.

```text
resultLabel = pagination.total atau 0 + " properti ditemukan"
IF pagination ada:
    tampilkan "Halaman page dari max(totalPages, 1)"
END
```

### 4.6 Property grid

Desktop menampilkan tiga kolom. Pada lebar maksimum `900px` menjadi dua kolom. Pada maksimum `620px` menjadi satu kolom.

```text
FOR property IN properties:
    render PropertyCard
    key = property.id
    priority = index == 0
END
```

Grid tidak melakukan filter atau sorting di browser. Urutan dan isi datang dari API.

### 4.7 Property card

Anatomi card:

```text
PropertyCard
├── Cover image button
│   └── image atau "Foto belum tersedia"
├── Wishlist icon button
├── Eyebrow
│   ├── property type
│   └── star + rating
├── Title button
├── Location
├── Facts: tamu · kamar · tempat tidur
└── Footer
    ├── price / malam
    └── Favorit tamu (jika true)
```

Interaksi:

```text
ON click image atau title:
    buka detail berdasarkan slug

ON click wishlist:
    toggle local state berdasarkan id
    jangan buka detail
    jangan ubah hasil filter/sort
END
```

Aturan gambar:

- card pertama: `loading=eager`, `fetchpriority=high`;
- card lain: `loading=lazy`, `fetchpriority=auto`;
- dimensi `900x600` dan aspect ratio 4:3 menjaga layout;
- `alt` berasal dari `coverImage.altText`.

### 4.8 Load more

```text
IF pagination.hasMore:
    render tombol "Muat lebih banyak"
    IF loadingList:
        disable tombol
        label "Memuat..."
ELSE:
    render "Semua properti sudah ditampilkan."
END
```

Pengguna melihat hasil lama tetap ada saat halaman baru ditambahkan. Ini menjaga konteks visual dan mencegah scroll jump besar.

## 5. Breakdown layar detail

### 5.1 Detail header

Konten:

- tombol `Kembali ke hasil`;
- tipe properti dan lokasi;
- judul;
- rating dan jumlah ulasan;
- badge `Favorit tamu` jika tersedia;
- tombol `Simpan` atau `Tersimpan`.

```text
ON click "Simpan":
    aria-pressed berubah false -> true
    label berubah "Simpan" -> "Tersimpan"
    icon/warna brand aktif
END
```

### 5.2 Gallery

Desktop memakai gallery dua kolom:

- gambar cover lebih besar dan span dua baris;
- gambar lain mengisi kolom kedua.

Mobile memakai satu kolom dengan row tetap `14rem`.

```text
IF images.length > 0:
    FOR image, index IN images sorted by API:
        render alt image.altText
        IF index == 0:
            width=1400, eager, high priority
        ELSE:
            width=800, lazy, auto priority
END
```

Tidak ada lightbox atau carousel interaktif; gallery hanya menyajikan gambar.

### 5.3 Fact strip

Empat fakta utama ditampilkan sebagai blok:

- Tamu;
- Kamar;
- Tempat tidur;
- Kamar mandi.

Desktop memakai empat kolom, mobile dua kolom.

### 5.4 Description dan amenitas

```text
render section "Tentang tempat ini"
    paragraph property.description

render section "Yang tersedia"
    list setiap property.amenities
    gunakan check mark dekoratif aria-hidden
    tampilkan amenity.name sebagai teks utama
END
```

Amenitas tidak menjadi link atau tombol karena detail ini bersifat informatif.

### 5.5 Host card

Menampilkan:

- avatar host;
- label `Tuan rumah`;
- nama host;
- tahun bergabung;
- label `Superhost` jika true.

Alt avatar dibentuk sebagai `Foto profil <nama host>`.

### 5.6 Price card

Desktop price card sticky di sisi kanan. Pada viewport <= `900px`, card menjadi static dan dipindahkan sebagai row awal layout detail.

Isi:

- harga per malam;
- kota;
- kapasitas tamu;
- rating dari 5.

Card ini memberi ringkasan keputusan tanpa booking action karena transaksi berada di luar scope.

## 6. State UX

### 6.1 State matrix katalog

| State | Kondisi | UI | Aksi pemulihan |
| --- | --- | --- | --- |
| Initial loading | `loadingList=true`, properties kosong | skeleton grid | menunggu request |
| Loading append | `loadingList=true`, properties sudah ada | grid tetap, tombol disabled | menunggu page berikutnya |
| Options error | options gagal | alert error | `Coba lagi` melalui inisialisasi/opsi |
| List error | list gagal | alert error | `Coba lagi` page 1 |
| Empty | properties kosong tanpa error | pesan tidak ada hasil | `Reset filter` |
| Has more | `meta.hasMore=true` | tombol load more | request page berikutnya |
| Complete | `meta.hasMore=false` | teks semua sudah tampil | tidak ada request tambahan |

### 6.2 State matrix detail

| State | UI |
| --- | --- |
| Loading detail | status panel `Memuat detail properti...` |
| Detail error | alert error + `Kembali ke hasil` |
| Detail loaded | seluruh detail dan action wishlist |
| Stale request | response diabaikan melalui request ID |

### 6.3 State disabled

Saat list atau options loading:

```text
disabled = loadingList OR loadingOptions
form aria-busy = disabled
disable input, select, submit, reset
label submit = "Mencari..."
```

Tujuan UX: mencegah submit berulang dan perubahan draft ketika data lama masih diproses.

## 7. Interaction flow utama

### 7.1 Search

```text
1. pengguna isi Cari
2. pengguna click Cari properti
3. draft disalin menjadi filters aktif
4. URL query diperbarui
5. detail dibersihkan jika sedang terbuka
6. API diminta dengan page=1
7. heading jumlah dan grid diperbarui
```

### 7.2 Combined filter

```text
1. pengguna memilih lokasi dan tipe
2. pengguna membuka Filter lanjutan
3. pengguna mengisi harga, kapasitas, dan amenitas
4. pengguna submit
5. API menerapkan AND antar filter
6. hasil lama diganti dengan page 1
7. URL menyimpan filter yang aktif
```

### 7.3 Sorting termurah

```text
1. pengguna memilih Harga terendah
2. pengguna submit form
3. API mengurutkan pricePerNight naik
4. tie-break memakai id agar deterministik
5. card pertama menjadi item termurah sesuai query
```

### 7.4 Detail dan wishlist

```text
1. pengguna click gambar atau judul card
2. history push ke /properties/<slug>
3. detail loading ditampilkan
4. API mengembalikan detail
5. pengguna click Simpan
6. state tombol dan card berbagi nilai lokal yang sama
7. pengguna click Kembali ke hasil
8. history/query dikembalikan
```

### 7.5 Load more

```text
1. pengguna melihat page 1
2. tombol Muat lebih banyak aktif jika hasMore
3. pengguna click
4. API diminta dengan page sebelumnya + 1 dan filter sama
5. item baru ditambahkan di bawah item lama
6. tombol tetap aktif atau diganti status selesai
```

## 8. Aksesibilitas

### 8.1 Struktur semantik

- `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<form>`, `<fieldset>`, dan `<legend>` digunakan sesuai konteks;
- heading memiliki urutan visual dan label section;
- tombol dipakai untuk action, bukan `<div>` clickable;
- link brand memiliki `aria-label`.

### 8.2 Nama dan status kontrol

```text
Wishlist card:
    aria-label = "Simpan <title> ke wishlist"
    atau "Hapus <title> dari wishlist"
    aria-pressed = boolean

Wishlist detail:
    visible label = "Simpan" atau "Tersimpan"
    aria-pressed = boolean

Loading:
    role=status, aria-live=polite

Error:
    role=alert
END
```

### 8.3 Keyboard dan focus

- semua action utama berupa button atau link native;
- `:focus-visible` memiliki outline 3px;
- skip link muncul ketika focus;
- `<details>` dan `<summary>` memberi pola disclosure native;
- tidak ada tabindex positif.

### 8.4 Teks dan gambar

- gambar properti memakai alt text dataset;
- avatar host memakai alt deskriptif;
- icon hati, bintang, check mark diberi `aria-hidden` jika teks sudah tersedia;
- rating memiliki teks screen-reader `Rating` sebelum angka.

## 9. Responsivitas

```text
viewport > 900px:
    grid property 3 kolom
    form primary multi-kolom
    detail layout content + price card sticky
    gallery 2 kolom

620px < viewport <= 900px:
    grid 2 kolom
    form search field full row
    detail layout 1 kolom
    price card static

viewport <= 620px:
    header vertikal
    form semua field 1 kolom
    grid 1 kolom
    gallery 1 kolom
    detail header vertikal
    fact strip 2 kolom
    amenity list 1 kolom
END
```

Minimum layout width adalah `320px`. Body mencegah horizontal overflow.

## 10. Motion dan feedback

- image card memiliki scale hover `1.025`;
- tombol error/load-more memiliki perubahan hover dan active scale;
- skeleton memakai shimmer;
- smooth scroll dipakai saat membuka dan menutup detail;
- `prefers-reduced-motion: reduce` mematikan shimmer dan hampir semua transition;
- focus outline tetap tersedia tanpa bergantung pada motion.

## 11. UI/UX parity Vue-Svelte-React

| Area | Kontrak parity |
| --- | --- |
| Layout | class dan struktur visual sama dari `packages/styles/styles.css` |
| Label | teks Indonesia sama, termasuk status loading/error/empty |
| Query | URL dan API parameter sama |
| Card | informasi, alt, tombol, aria sama |
| Detail | urutan section dan isi sama |
| Wishlist | nilai awal API, toggle lokal, state lintas list/detail |
| Responsive | breakpoint 900px dan 620px sama |
| Motion | reduced motion dan prioritas gambar sama |
| Testing | journey TA-01 sampai TA-05 sama |

### Pseudocode parity check

```text
FOR framework IN [vue, svelte, react]:
    buka route /
    validasi hero dan form
    jalankan search
    validasi query URL dan jumlah hasil
    jalankan combined filter
    validasi card expected
    jalankan sorting
    buka detail
    toggle wishlist
    kembali ke hasil
    load more
    validasi jumlah card dan state lama
END FOR

IF output visible, URL, aria, dan response berbeda:
    catat sebagai parity defect sebelum pengukuran komparatif
END IF
```

## 12. UX evaluation mapping

| UX dimension | Bukti dari prototype |
| --- | --- |
| Findability | hero, label form, CTA search, filter lanjutan |
| Efficiency | submit gabungan, load more, hasil tetap saat append |
| Clarity | jumlah hasil, halaman, metadata card, status loading/error |
| Confidence | rating, review count, host, superhost, amenities, price summary |
| Control | reset filter, back, URL query, wishlist toggle |
| Accessibility | semantic HTML, keyboard focus, aria status, alt text |
| Visual stability | image dimensions, aspect ratio, skeleton, explicit gallery sizes |

## 13. Risiko UX yang perlu dipantau

- Pesan error opsi dan list digabung pada sebagian container; pastikan pengguna tetap tahu resource mana yang gagal jika error dipisah di masa depan.
- Wishlist lokal dapat kembali ke nilai awal setelah refresh; label penelitian harus menyebut bahwa ini bukan fitur akun.
- Search dan filter hanya submit saat tombol ditekan; pengguna yang mengharapkan live search perlu diberi affordance yang jelas melalui CTA.
- Gambar eksternal dapat lambat atau gagal; placeholder saat ini tersedia untuk cover yang null, bukan fallback image error setelah URL gagal.
- Detail tidak memakai lightbox; pengguna hanya dapat melihat gallery yang tersedia pada halaman.
- URL memakai History API manual; deep link deployment harus tetap mengembalikan SPA fallback.
- UI/UX Vue dan Svelte harus diperiksa setelah perubahan CSS agar hasil studi tidak mengandung perbedaan treatment yang tidak disengaja.

Dokumen ini tidak mendesain ulang UI dan tidak menambahkan fitur baru. Isinya hanya mem-breakdown perilaku serta keputusan UI/UX yang sudah ada.
