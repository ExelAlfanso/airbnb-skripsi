# BAB I — PENDAHULUAN

## 1.1 Latar Belakang

Perkembangan aplikasi web modern menuntut antarmuka yang cepat, responsif, dan efisien dalam menggunakan sumber daya perangkat. Pada website listing properti seperti Airbnb, performa frontend menjadi penting karena halaman memuat banyak konten visual dan informasi, antara lain gambar properti, lokasi, harga, penilaian, serta kontrol pencarian dan penyaringan. Karakteristik tersebut membuat pemilihan framework frontend berpotensi memengaruhi waktu pemuatan halaman, respons interaksi, stabilitas visual, dan jumlah sumber daya yang dikirimkan ke browser.

Vue.js dan Svelte merupakan teknologi frontend yang dapat digunakan untuk membangun antarmuka web interaktif. Vue.js menggunakan sistem reaktivitas berbasis runtime dan Virtual DOM, sedangkan Svelte memindahkan sebagian besar pekerjaan framework ke tahap kompilasi untuk menghasilkan JavaScript yang dijalankan oleh browser. Perbedaan pendekatan tersebut berpotensi menghasilkan karakteristik komputasional yang berbeda, khususnya pada Core Web Vitals, ukuran JavaScript bundle, jumlah request, total resource, dan waktu respons interaksi.

Penelitian ini membangun dua prototipe website listing properti dengan fitur, desain, dataset, aset, backend, dan skenario pengujian yang setara. Prototipe pertama menggunakan Vue.js dan prototipe kedua menggunakan Svelte. Keduanya menggunakan ElysiaJS sebagai service backend bersama dan Eden Treaty sebagai klien API bertipe aman. Backend dijalankan pada Cloudflare Workers, sedangkan data dummy dikelola melalui migration Drizzle ORM. Kesamaan komponen di luar framework frontend diperlukan agar perbedaan hasil pengujian lebih layak dikaitkan dengan implementasi frontend yang dibandingkan.

Studi kasus Airbnb dipilih karena mewakili website listing yang kaya konten visual dan memiliki interaksi pencarian, penyaringan, pengurutan, pemuatan data bertahap, serta penayangan detail properti. Penelitian ini tidak membangun ulang seluruh sistem Airbnb, tetapi membuat prototipe yang cukup representatif untuk mengukur efisiensi komputasional frontend dan aspek pengalaman pengguna yang dapat diamati secara objektif, seperti kecepatan pemuatan, stabilitas visual, dan respons interaksi.

Pengukuran dilakukan pada production build kedua frontend dengan kondisi pengujian yang dikendalikan. Google Lighthouse digunakan untuk mengukur metrik laboratorium, terutama Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), dan Total Blocking Time (TBT). TBT digunakan sebagai indikator laboratorium untuk potensi keterlambatan interaksi, bukan sebagai pengganti nilai Interaction to Next Paint (INP) lapangan. Respons pencarian dan penyaringan juga diukur menggunakan skenario interaksi yang sama. Grafana k6 digunakan untuk menguji kapasitas dan kestabilan API pada lingkungan Cloudflare yang terpisah dari produksi. Hasil load test dan stress test tersebut digunakan untuk memvalidasi backend sebagai variabel kontrol, bukan untuk menentukan keunggulan Vue.js atau Svelte.

Berdasarkan rancangan tersebut, penelitian diharapkan menghasilkan perbandingan yang transparan dan dapat direproduksi mengenai karakteristik Vue.js dan Svelte dalam konteks website listing properti. Hasil penelitian tidak dimaksudkan untuk menetapkan satu framework sebagai pilihan terbaik pada semua kondisi, tetapi untuk memberikan dasar pertimbangan yang sesuai dengan ruang lingkup dan karakteristik aplikasi yang diuji.

## 1.2 Rumusan Masalah

1. Bagaimana perbedaan performa frontend antara Vue.js dan Svelte pada prototipe website listing properti berdasarkan metrik laboratorium yang berkaitan dengan Core Web Vitals?
2. Bagaimana perbandingan efisiensi sumber daya Vue.js dan Svelte berdasarkan ukuran JavaScript bundle, total resource yang dimuat, dan jumlah request browser?
3. Bagaimana perbandingan respons interaksi pengguna pada fitur pencarian dan penyaringan properti antara prototipe Vue.js dan Svelte?
4. Bagaimana perbandingan kompleksitas implementasi frontend Vue.js dan Svelte berdasarkan jumlah baris kode, file, komponen, dan dependency tambahan?
5. Bagaimana hasil perbandingan performa, efisiensi sumber daya, respons interaksi, dan kompleksitas implementasi dapat digunakan sebagai pertimbangan dalam memilih framework untuk website listing yang kaya konten visual dan interaktif?

## 1.3 Tujuan Penelitian

1. Mengukur dan membandingkan performa frontend Vue.js dan Svelte pada prototipe website listing properti berdasarkan metrik laboratorium yang berkaitan dengan Core Web Vitals.
2. Mengukur dan membandingkan efisiensi sumber daya kedua frontend berdasarkan ukuran JavaScript bundle, total resource, dan jumlah request browser.
3. Mengukur dan membandingkan respons interaksi pengguna pada fitur pencarian dan penyaringan properti dengan skenario yang setara.
4. Membandingkan kompleksitas implementasi Vue.js dan Svelte berdasarkan jumlah baris kode, file, komponen, dan dependency tambahan.
5. Menyusun hasil analisis yang dapat menjadi pertimbangan dalam memilih framework frontend untuk website listing yang kaya konten visual dan interaktif.

## 1.4 Batasan Masalah

1. Objek utama perbandingan adalah implementasi frontend menggunakan Vue.js dan Svelte. ElysiaJS, Cloudflare Workers, database, dan API yang sama diperlakukan sebagai variabel kontrol.
2. Kedua frontend wajib memiliki fitur, desain, struktur informasi, dataset, aset, dan skenario interaksi yang setara.
3. Fitur prototipe dibatasi pada daftar properti, detail properti, pencarian, filter, sorting, pagination atau *load more*, dan wishlist lokal berbasis data dummy.
4. Studi kasus Airbnb hanya digunakan sebagai referensi karakteristik website listing properti dan tidak direplikasi secara penuh.
5. Data properti, lokasi, tipe properti, fasilitas, rating, host, dan gambar merupakan data dummy atau aset yang diizinkan penggunaannya. Dataset yang sama dimuat melalui migration Drizzle ORM untuk seluruh pengujian.
6. Penelitian tidak mencakup authentication, authorization, pembayaran, transaksi booking nyata, chat, dashboard host, dashboard admin, kalender real-time, dan integrasi peta nyata.
7. Pengujian frontend dilakukan terhadap production build pada versi browser, profil perangkat, kondisi jaringan, dataset, aset, cache policy, urutan skenario, dan jumlah pengulangan yang sama.
8. Google Lighthouse digunakan untuk mengukur LCP, CLS, TBT, dan metrik pendukung pada lingkungan laboratorium. INP hanya dapat digunakan apabila tersedia data lapangan yang memadai; TBT tidak dilaporkan sebagai INP.
9. Aspek pengalaman pengguna dibatasi pada indikator objektif yang dapat direproduksi, yaitu kecepatan pemuatan, stabilitas visual, dan respons interaksi pencarian serta penyaringan. Penelitian pengguna berbasis kuesioner atau wawancara berada di luar ruang lingkup.
10. Grafana k6 digunakan untuk load test dan stress test API pada stage Cloudflare khusus pengujian. Lokasi load generator, durasi warm-up, cache policy, batas layanan Cloudflare, jumlah virtual user, dan hasil setiap pengulangan harus dicatat.
11. Hasil load test dan stress test hanya digunakan untuk memastikan API bersama cukup stabil selama eksperimen frontend. Hasil tersebut tidak digunakan sebagai bukti bahwa salah satu framework frontend lebih unggul.
12. Analisis kompleksitas implementasi dibatasi pada jumlah baris kode, file, komponen, dan dependency tambahan yang secara langsung digunakan oleh masing-masing frontend.
13. Hasil penelitian berlaku pada prototipe, dataset, perangkat, konfigurasi, dan skenario yang ditentukan serta tidak dimaksudkan untuk menentukan framework terbaik secara umum.
