# Dokumentasi Teknis Backend Tahap Awal

## Backend Overview

Backend prototipe website listing properti Airbnb-like dirancang menggunakan ElysiaJS, Bun runtime, TypeScript, Eden Treaty, PostgreSQL, Drizzle ORM, dan arsitektur monorepo. Pada tahap awal, backend berperan sebagai data provider yang sama untuk dua frontend penelitian, yaitu VueJS dan Svelte.

Data utama backend bersumber dari PostgreSQL yang diakses melalui Drizzle ORM. Definisi schema database berada di package `packages/db`, sedangkan backend Elysia di `apps/api` menggunakan repository layer untuk menjalankan query dan service layer untuk mengatur business logic ringan seperti search, filter, sorting, pagination, dan mapping response.

Backend menyediakan data properti, lokasi, tipe properti, fasilitas, host, gambar properti, dan detail properti. Backend juga mendukung kebutuhan interaksi listing seperti pencarian, filter, sorting, dan pagination.

Dalam konteks penelitian skripsi, backend bukan objek utama yang dibandingkan. Objek utama penelitian adalah performa dan efisiensi sumber daya frontend framework VueJS dan Svelte. Oleh karena itu, backend diposisikan sebagai variabel kontrol agar kedua frontend menggunakan kondisi akses data yang sama.

Backend harus memastikan kedua frontend memperoleh:

- Dataset yang sama.
- Database schema dan seed data yang sama.
- Endpoint yang sama.
- Response shape yang sama.
- Filtering logic yang sama.
- Sorting logic yang sama.
- Pagination logic yang sama.

Dengan pendekatan ini, perbedaan hasil pengukuran diharapkan lebih merepresentasikan karakteristik frontend framework, bukan variasi dari sumber data atau perilaku backend.

## Scope Fitur Prototipe Frontend

Prototipe yang dikembangkan hanya mencakup fitur utama website listing properti. Kedua frontend penelitian, yaitu VueJS dan Svelte, harus mengimplementasikan alur dan fitur berikut dengan sumber data serta kontrak API yang sama:

- Halaman daftar properti.
- Halaman detail properti.
- Pencarian properti berdasarkan keyword atau lokasi.
- Filter properti berdasarkan parameter yang tersedia pada API.
- Sorting berdasarkan opsi yang tersedia pada API.
- Pagination atau pola `load more` pada halaman daftar properti.
- Wishlist dummy untuk mensimulasikan interaksi pengguna.

### Perilaku Load More

`Load more` adalah perilaku presentasi pada frontend, sedangkan backend tetap menggunakan pagination berbasis `page` dan `limit`. Implementasinya mengikuti aturan berikut:

- Request awal menggunakan `page = 1` dan `limit` sesuai default API.
- Saat pengguna menekan tombol `Load more`, frontend meminta halaman berikutnya dengan seluruh parameter search, filter, dan sorting yang sedang aktif.
- Data dari halaman berikutnya ditambahkan ke daftar yang sudah tampil, bukan menggantikan daftar sebelumnya.
- Nilai `meta.hasMore` menjadi sumber kebenaran untuk menentukan apakah tombol `Load more` masih ditampilkan atau diaktifkan.
- Saat search, filter, atau sorting berubah, daftar harus di-reset dan request dimulai kembali dari `page = 1`.
- Tidak ada endpoint khusus `load more`; frontend menggunakan endpoint `GET /properties` yang sama.

### Perilaku Wishlist Dummy

Wishlist pada tahap prototipe hanya digunakan untuk mensimulasikan interaksi UI, seperti menekan tombol hati pada card listing atau halaman detail. Wishlist bukan fitur akun atau transaksi permanen.

- Status awal wishlist direpresentasikan oleh field `isWishlisted` pada response listing dan detail.
- Pengguna dapat melakukan toggle status wishlist secara lokal pada frontend.
- State wishlist harus dapat digunakan oleh halaman daftar dan halaman detail selama aplikasi frontend masih aktif.
- Tidak ada kewajiban login, identitas pengguna, endpoint mutasi wishlist, atau sinkronisasi antar-browser dan antar-frontend.
- Status dapat kembali ke nilai awal setelah refresh atau saat state aplikasi dihapus.
- Penyimpanan permanen, daftar wishlist pengguna, dan sinkronisasi lintas perangkat berada di luar scope prototipe.

## Scope Backend

### In Scope

Backend tahap awal mencakup:

- Data properti.
- Data detail properti.
- Data lokasi.
- Data tipe properti.
- Data fasilitas.
- Data host.
- Search properti berdasarkan keyword atau lokasi.
- Filter properti berdasarkan lokasi.
- Filter properti berdasarkan tipe properti.
- Filter properti berdasarkan harga minimum.
- Filter properti berdasarkan harga maksimum.
- Filter properti berdasarkan jumlah tamu.
- Filter properti berdasarkan jumlah kamar tidur.
- Filter properti berdasarkan jumlah tempat tidur.
- Filter properti berdasarkan jumlah kamar mandi.
- Filter properti berdasarkan fasilitas.
- Sorting berdasarkan rekomendasi.
- Sorting berdasarkan harga termurah.
- Sorting berdasarkan harga termahal.
- Sorting berdasarkan rating tertinggi.
- Pagination.
- Metadata pagination untuk mendukung pola `load more` pada frontend.
- Nilai awal `isWishlisted` pada response listing dan detail untuk wishlist dummy.
- Response format yang konsisten.
- Error response yang konsisten.
- API contract untuk digunakan oleh Eden Treaty.

### Out of Scope

Backend tahap awal tidak mencakup:

- Authentication.
- Authorization.
- Payment.
- Real booking transaction.
- Chat.
- Host dashboard.
- Admin dashboard.
- Review submission.
- Real-time availability calendar.
- Real map integration.
- Wishlist permanen berbasis akun, endpoint toggle wishlist, dan sinkronisasi lintas perangkat.
- Recommendation algorithm kompleks.
- Optimasi database production tingkat lanjut.
- Email notification.

## Prinsip Pengembangan Tahap Awal

Backend pada tahap ini harus diperlakukan sebagai blueprint implementasi. Fokus utamanya adalah mendefinisikan struktur data PostgreSQL melalui Drizzle ORM, kontrak API, perilaku query, dan keputusan arsitektur sebelum kode backend dikembangkan lebih lanjut.

Implementasi backend pada tahap berikutnya sebaiknya mengikuti dokumen ini agar kontrak antara backend, frontend VueJS, dan frontend Svelte tetap stabil selama proses eksperimen penelitian.
