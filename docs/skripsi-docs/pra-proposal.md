# LAPORAN PRAPROPOSAL SKRIPSI

<div align="center">

## Analisis Perbandingan Performa Framework Frontend VueJS dan Svelte pada Prototipe Website Listing Properti Berbasis Studi Kasus Airbnb Berdasarkan Segi Komputasional dan *User Experience*

<br><br><br>

**Disusun oleh:**  
**Exel Boy Alfanso**  
**NIM: 235150201111019**

<br><br><br>

**PROGRAM STUDI TEKNIK INFORMATIKA**  
**DEPARTEMEN TEKNIK INFORMATIKA**  
**FAKULTAS ILMU KOMPUTER**  
**UNIVERSITAS BRAWIJAYA**  
**MALANG**  
**2026**

</div>

---

## DAFTAR ISI

- [DAFTAR GAMBAR](#daftar-gambar)
- [DAFTAR TABEL](#daftar-tabel)
- [BAB 1 PENDAHULUAN](#bab-1-pendahuluan)
  - [1.1 Identitas Mahasiswa](#11-identitas-mahasiswa)
  - [1.2 Keminatan dan Bidang Penelitian](#12-keminatan-dan-bidang-penelitian)
  - [1.3 Jenis Penelitian](#13-jenis-penelitian)
  - [1.4 Judul/Topik Skripsi](#14-judultopik-skripsi)
  - [1.5 Latar Belakang](#15-latar-belakang)
  - [1.6 Rumusan Masalah](#16-rumusan-masalah)
  - [1.7 Tujuan](#17-tujuan)
  - [1.8 Batasan Masalah](#18-batasan-masalah)
- [BAB 2 LANDASAN KEPUSTAKAAN](#bab-2-landasan-kepustakaan)
  - [2.1 Website Responsif](#21-website-responsif)
  - [2.2 Framework Frontend](#22-framework-frontend)
  - [2.3 Vue.js](#23-vuejs)
  - [2.4 Svelte](#24-svelte)
  - [2.5 Core Web Vitals](#25-core-web-vitals)
  - [2.6 Efisiensi Sumber Daya](#26-efisiensi-sumber-daya)
  - [2.7 ElysiaJS dan Eden Treaty](#27-elysiajs-dan-eden-treaty)
  - [2.8 Website Listing Properti](#28-website-listing-properti)
  - [2.9 Pengujian Perangkat Lunak](#29-pengujian-perangkat-lunak)
  - [2.10 Web Performance Testing](#210-web-performance-testing)
  - [2.11 User Experience](#211-user-experience)
  - [2.12 Usability Testing](#212-usability-testing)
  - [2.13 Vitest](#213-vitest)
  - [2.14 Playwright](#214-playwright)
  - [2.15 Google Lighthouse](#215-google-lighthouse)
  - [2.16 Browser Developer Tools](#216-browser-developer-tools)
- [BAB 3 METODOLOGI PENELITIAN](#bab-3-metodologi-penelitian)
  - [3.1 Persiapan dan Pengembangan Aplikasi](#31-persiapan-dan-pengembangan-aplikasi)
  - [3.2 Validasi Kesetaraan Fitur](#32-validasi-kesetaraan-fitur)
  - [3.3 Pengujian Performa Komputasional](#33-pengujian-performa-komputasional)
  - [3.4 Evaluasi User Experience dan Usability](#34-evaluasi-user-experience-dan-usability)
  - [3.5 Analisis Komparatif pada Production Build](#35-analisis-komparatif-pada-production-build)
  - [3.6 Tahapan Penelitian](#36-tahapan-penelitian)
- [DAFTAR REFERENSI](#daftar-referensi)

## DAFTAR GAMBAR

- [Gambar 3.1 Flowchart Tahapan Skripsi](#gambar-31-flowchart-tahapan-skripsi)

## DAFTAR TABEL

- [Tabel 3.1 Aspek dan Metrik Penelitian](#tabel-31-aspek-dan-metrik-penelitian)
- [Tabel 3.2 Instrumen dan Alat Pengukuran](#tabel-32-instrumen-dan-alat-pengukuran)

---

# BAB 1 PENDAHULUAN

## 1.1 Identitas Mahasiswa

| Identitas | Keterangan |
|---|---|
| Nama | Exel Boy Alfanso |
| NIM | 235150201111019 |
| Program Studi | Teknik Informatika |
| Departemen | Teknik Informatika |

## 1.2 Keminatan dan Bidang Penelitian

Keminatan yang diambil dalam skripsi ini adalah MGM (Multimedia, Game, dan Mobile). Bidang penelitian secara khusus mencakup pengembangan aplikasi web, performa antarmuka web responsif, evaluasi framework frontend modern pada perangkat bergerak, serta pengukuran *user experience* dan *usability* pada prototipe website listing properti.

## 1.3 Jenis Penelitian

Penelitian ini merupakan penelitian implementatif dengan pendekatan pengembangan dan eksperimen komparatif. Penelitian menghasilkan artefak berupa prototipe *mobile web* listing properti yang dikembangkan dalam dua versi frontend, yaitu Vue.js dan Svelte. Kedua frontend menggunakan *service backend* yang sama berbasis ElysiaJS dengan Eden Treaty sebagai *type-safe API client*.

Setelah prototipe dikembangkan, dilakukan pengujian kesetaraan fungsi, pengukuran performa komputasional, dan evaluasi pengalaman pengguna. Pengukuran komputasional menggunakan Core Web Vitals, metrik laboratorium pendukung, efisiensi sumber daya, respons interaksi, dan kompleksitas implementasi. Evaluasi pengguna dilakukan melalui pengujian berbasis tugas serta kuesioner UEQ dan SUS. Hasil kedua kelompok pengujian dianalisis untuk mengetahui apakah perbedaan karakteristik teknis kedua framework juga menghasilkan perbedaan yang dapat diamati atau dirasakan pengguna.

## 1.4 Judul/Topik Skripsi

**Analisis Perbandingan Performa Framework Frontend VueJS dan Svelte pada Prototipe Website Listing Properti Berbasis Studi Kasus Airbnb Berdasarkan Segi Komputasional dan *User Experience*.**

## 1.5 Latar Belakang

Perkembangan aplikasi web modern menuntut website untuk memiliki performa yang cepat, responsif, dan efisien dalam penggunaan sumber daya. Pada website berbasis listing properti seperti Airbnb, performa frontend menjadi aspek penting karena halaman menampilkan banyak data visual, seperti gambar properti, informasi lokasi, harga, dan rating, serta mendukung interaksi pencarian dan penyaringan. Kondisi tersebut membuat pemilihan framework frontend berpotensi memengaruhi waktu muat halaman, respons interaksi, stabilitas visual, dan jumlah sumber daya yang dikirimkan ke browser.

Vue.js dan Svelte merupakan dua framework frontend yang digunakan untuk membangun antarmuka web interaktif. Vue.js menggunakan sistem reaktivitas berbasis *runtime* dan Virtual DOM, sedangkan Svelte memindahkan sebagian pekerjaan framework ke tahap kompilasi untuk menghasilkan JavaScript yang dijalankan oleh browser. Perbedaan pendekatan tersebut berpotensi menghasilkan karakteristik komputasional yang berbeda, khususnya pada Core Web Vitals, ukuran JavaScript *bundle*, jumlah *request*, total sumber daya, dan waktu respons interaksi.

Core Web Vitals mencakup Largest Contentful Paint (LCP), Interaction to Next Paint (INP), dan Cumulative Layout Shift (CLS). Ketiga metrik tersebut masing-masing merepresentasikan kecepatan pemuatan konten utama, responsivitas interaksi, dan stabilitas visual. Meskipun metrik performa berorientasi pada pengguna, nilai teknis tersebut belum sepenuhnya menjelaskan keberhasilan pengguna ketika menyelesaikan tugas maupun persepsi pengguna terhadap sebuah aplikasi. Oleh karena itu, pengukuran komputasional perlu dilengkapi dengan evaluasi *user experience* dan *usability*.

Dalam penelitian ini dibuat dua prototipe website listing properti yang memiliki fitur, desain, dataset, aset, dan backend yang sama. Kedua prototipe dikembangkan menggunakan Vue.js dan Svelte sebagai frontend, sedangkan ElysiaJS digunakan sebagai *service backend* yang menyediakan data melalui API. Eden Treaty digunakan untuk mendukung komunikasi API yang *type-safe* antara frontend dan backend. Penggunaan backend, data, dan skenario pengujian yang sama diperlukan agar penelitian berfokus pada perbedaan karakteristik kedua implementasi frontend.

Studi kasus Airbnb dipilih karena mewakili website listing properti yang kaya konten visual dan memiliki interaksi pencarian, penyaringan, pengurutan, pemuatan data bertahap, penayangan detail properti, serta penyimpanan wishlist. Penelitian ini tidak membangun ulang seluruh sistem Airbnb, melainkan membuat prototipe yang cukup representatif untuk mengukur performa komputasional dan pengalaman penggunaan.

Evaluasi pengalaman pengguna dilakukan melalui skenario tugas yang sama pada kedua prototipe. Efektivitas dan efisiensi penggunaan diukur melalui tingkat keberhasilan tugas, waktu penyelesaian, kesalahan, dan jalur interaksi. Persepsi pengguna diukur menggunakan User Experience Questionnaire (UEQ) dan System Usability Scale (SUS). Dengan menggabungkan data teknis dan data pengguna, penelitian diharapkan dapat menjelaskan apakah perbedaan karakteristik komputasional juga berdampak pada pengalaman penggunaan dalam konteks prototipe yang diuji.

## 1.6 Rumusan Masalah

1. Bagaimana perbedaan performa frontend antara Vue.js dan Svelte berdasarkan Core Web Vitals dan metrik laboratorium pendukung?
2. Bagaimana perbandingan efisiensi sumber daya berdasarkan ukuran JavaScript *bundle*, total sumber daya, dan jumlah *request* browser?
3. Bagaimana perbandingan respons interaksi pada fitur pencarian dan penyaringan properti?
4. Bagaimana perbandingan kompleksitas implementasi berdasarkan jumlah baris kode, file, komponen, dan *dependency* tambahan?
5. Bagaimana perbandingan *user experience* dan *usability* kedua prototipe berdasarkan UEQ, SUS, keberhasilan tugas, waktu penyelesaian, dan kesalahan pengguna?
6. Bagaimana hubungan hasil pengukuran komputasional dan evaluasi pengguna dapat menjadi pertimbangan pemilihan framework frontend untuk website listing yang kaya konten visual dan interaktif?

## 1.7 Tujuan

1. Mengukur dan membandingkan performa frontend Vue.js dan Svelte berdasarkan Core Web Vitals dan metrik laboratorium pendukung.
2. Mengukur dan membandingkan efisiensi sumber daya kedua frontend.
3. Mengukur dan membandingkan respons interaksi pada fitur pencarian dan penyaringan.
4. Membandingkan kompleksitas implementasi Vue.js dan Svelte.
5. Mengukur dan membandingkan *user experience* dan *usability* kedua prototipe berdasarkan UEQ, SUS, keberhasilan tugas, waktu penyelesaian, dan kesalahan pengguna.
6. Menganalisis keterkaitan hasil pengukuran komputasional dan evaluasi pengguna sebagai dasar pertimbangan pemilihan framework frontend.

## 1.8 Batasan Masalah

1. Objek utama perbandingan adalah frontend Vue.js dan Svelte. ElysiaJS, Eden Treaty, database, dan API bersama diperlakukan sebagai variabel kontrol.
2. Kedua frontend memiliki fitur, desain, struktur informasi, dataset, aset, dan skenario interaksi yang setara.
3. Fitur dibatasi pada daftar dan detail properti, pencarian, filter, *sorting*, pagination atau *load more*, dan wishlist lokal.
4. Airbnb hanya digunakan sebagai referensi karakteristik website listing properti.
5. Data merupakan data dummy atau aset yang diizinkan penggunaannya.
6. Penelitian tidak mencakup autentikasi, pembayaran, pemesanan nyata, percakapan, dashboard, kalender waktu nyata, dan peta nyata.
7. Pengujian dilakukan pada *production build* dengan browser, perangkat, jaringan, viewport, dataset, aset, cache, urutan skenario, dan jumlah pengulangan yang dikendalikan.
8. Lighthouse mengukur LCP, CLS, TBT, FCP, Speed Index, dan skor performa. TBT tidak dilaporkan sebagai INP.
9. INP diukur melalui instrumentasi browser pada sesi terkontrol dan tidak diklaim sebagai data lapangan populasi.
10. Efisiensi sumber daya dibatasi pada ukuran JavaScript *bundle*, total *transferred size*, jumlah *request*, serta aktivitas *scripting* dan *rendering*.
11. Kompleksitas implementasi dibatasi pada jumlah baris kode, file, komponen, dan *dependency* tambahan.
12. Evaluasi pengguna dibatasi pada tugas pencarian, filter, pengurutan, detail, dan wishlist dengan instrumen UEQ dan SUS.
13. Partisipan pernah menggunakan website atau aplikasi pencarian akomodasi/properti.
14. Hasil berlaku pada prototipe, konfigurasi, partisipan, dan skenario penelitian serta tidak menentukan framework terbaik secara umum.

---

# BAB 2 LANDASAN KEPUSTAKAAN

## 2.1 Website Responsif

Website responsif merupakan website yang dirancang agar tampilan dan tata letaknya dapat menyesuaikan berbagai ukuran layar, termasuk desktop, tablet, dan perangkat bergerak. Pada tampilan mobile, website responsif perlu memperhatikan penyusunan konten, ukuran elemen interaktif, keterbacaan teks, navigasi, dan efisiensi sumber daya agar tetap nyaman digunakan. Dalam penelitian ini, responsivitas mobile menjadi konteks utama karena prototipe listing properti diuji pada viewport perangkat bergerak yang dikendalikan.

## 2.2 Framework Frontend

Framework frontend merupakan kerangka kerja untuk membangun antarmuka pengguna pada aplikasi web. Framework membantu pengembang menyusun komponen, mengelola keadaan aplikasi, mengatur interaksi pengguna, dan membangun tampilan web modern. Ferreira, Borges, dan Valente (2022) menjelaskan bahwa framework frontend JavaScript digunakan untuk membangun antarmuka web modern berbasis komponen. Sofi'ie dan Qoiriah (2023) juga menyatakan bahwa framework frontend dapat membantu proses pengembangan, pengelolaan kode, performa, dan konsistensi aplikasi.

## 2.3 Vue.js

Vue.js adalah framework frontend JavaScript untuk membangun antarmuka web berbasis komponen. Ferreira, Borges, dan Valente (2022) menjelaskan Vue sebagai *progressive framework* yang mendukung pengelolaan antarmuka secara deklaratif dan reaktif. Vue memproses perubahan data melalui sistem reaktivitas pada *runtime*. Komponen mendeklarasikan hubungan antara keadaan aplikasi dan tampilan, kemudian Vue memperbarui bagian antarmuka yang terpengaruh ketika keadaan berubah. Dalam penelitian ini, Vue.js digunakan sebagai salah satu implementasi frontend pada prototipe website listing properti.

## 2.4 Svelte

Svelte adalah framework frontend berbasis komponen yang menggunakan pendekatan *compiler-based*. Svelte mengompilasi komponen pada saat proses *build* menjadi JavaScript yang secara langsung memperbarui elemen antarmuka. Pendekatan tersebut berpotensi mengurangi bagian *runtime framework* yang dikirimkan ke browser dan menghasilkan kode yang lebih spesifik terhadap kebutuhan komponen. Dalam penelitian ini, Svelte digunakan untuk membangun prototipe kedua dengan fitur, desain, data, dan perilaku yang disetarakan dengan implementasi Vue.js.

## 2.5 Core Web Vitals

Core Web Vitals merupakan kelompok metrik untuk menilai aspek pengalaman pengguna pada website berdasarkan pemuatan, responsivitas, dan stabilitas visual. Metrik yang digunakan adalah Largest Contentful Paint (LCP), Interaction to Next Paint (INP), dan Cumulative Layout Shift (CLS) (Google, 2026a).

### 2.5.1 Largest Contentful Paint

Largest Contentful Paint mengukur waktu render elemen gambar, teks, atau video terbesar yang terlihat pada viewport. LCP merepresentasikan kecepatan pemuatan konten utama. Google menetapkan nilai 2,5 detik atau kurang sebagai ambang pengalaman yang baik pada persentil ke-75 kunjungan halaman.

### 2.5.2 Interaction to Next Paint

Interaction to Next Paint mengukur responsivitas halaman dengan mengamati latensi interaksi pengguna sampai browser menampilkan pembaruan visual berikutnya. Nilai INP 200 milidetik atau kurang dikategorikan baik. Karena INP merupakan metrik lapangan yang diringkas dari interaksi selama masa hidup halaman, penelitian ini membedakan pengukuran sesi terkontrol dari data lapangan populasi.

### 2.5.3 Cumulative Layout Shift

Cumulative Layout Shift mengukur akumulasi pergeseran tata letak tak terduga selama halaman digunakan. Nilai CLS 0,1 atau kurang dikategorikan baik. Pada website listing yang banyak memuat gambar, dimensi aset dan perilaku pemuatan konten perlu dikendalikan agar pergeseran visual tidak menjadi variabel pengganggu.

## 2.6 Efisiensi Sumber Daya

Efisiensi sumber daya berkaitan dengan jumlah sumber daya yang dibutuhkan aplikasi web untuk dimuat dan dijalankan di browser. Aspek ini dianalisis melalui ukuran JavaScript *bundle*, total *transferred size*, jumlah *request*, dan waktu kerja *main thread*. Ukuran sumber daya dapat memengaruhi waktu pengunduhan, parsing, kompilasi, dan eksekusi JavaScript, terutama pada perangkat bergerak dan kondisi jaringan terbatas.

## 2.7 ElysiaJS dan Eden Treaty

ElysiaJS merupakan framework backend berbasis Bun dan TypeScript yang digunakan untuk membangun *service API*. Dalam penelitian ini, ElysiaJS digunakan sebagai backend bersama agar kedua frontend mengakses endpoint, dataset, dan struktur respons yang sama. Eden Treaty digunakan sebagai *type-safe API client* agar kontrak tipe komunikasi frontend dan backend konsisten. Backend tidak menjadi objek utama perbandingan dan kestabilannya diperlakukan sebagai variabel kontrol.

## 2.8 Website Listing Properti

Website listing properti menampilkan kumpulan properti dalam bentuk katalog atau grid. Website jenis ini umumnya memiliki fitur pencarian, filter, pengurutan, pagination atau *load more*, wishlist, dan halaman detail. Karakteristik tersebut sesuai untuk menguji framework frontend karena melibatkan pemuatan konten visual, pengelolaan daftar data, perubahan keadaan antarmuka, dan interaksi pengguna yang berulang.

## 2.9 Pengujian Perangkat Lunak

Pengujian perangkat lunak digunakan untuk memvalidasi kesetaraan kedua implementasi sebelum pengukuran komparatif. Pengujian bukan indikator langsung keunggulan suatu framework, tetapi menjadi kontrol agar perbedaan hasil tidak disebabkan oleh fitur yang rusak atau perilaku yang tidak setara.

### 2.9.1 Unit Testing

*Unit testing* dilakukan pada bagian kecil sistem, seperti fungsi, modul, atau logika komponen, secara terpisah dari keseluruhan aplikasi. Dalam penelitian ini, *unit testing* memvalidasi logika pencarian, filter, pengurutan, pagination, wishlist, dan pemformatan data properti pada implementasi Vue.js dan Svelte.

### 2.9.2 Integration Testing

*Integration testing* memastikan modul atau komponen yang saling terhubung dapat bekerja bersama. Pengujian mencakup interaksi frontend dengan backend, pemrosesan data API, dan kesesuaian data yang ditampilkan. Dalam penelitian ini, *integration testing* memvalidasi bahwa prototipe Vue.js dan Svelte dapat mengambil, mengolah, dan menampilkan data dari ElysiaJS dengan hasil yang setara.

### 2.9.3 End-to-End Testing

*End-to-end testing* mensimulasikan alur penggunaan aplikasi secara menyeluruh dari sisi pengguna. Azizullah, Rahayudi, dan Priyambadha (tanpa tahun) menjelaskan bahwa pengujian end-to-end mensimulasikan skenario pengguna dari awal hingga akhir. Dalam penelitian ini, pengujian mencakup membuka halaman listing, melakukan pencarian, menerapkan filter, mengurutkan hasil, membuka detail, dan menggunakan wishlist.

## 2.10 Web Performance Testing

*Web performance testing* adalah proses pengukuran perilaku aplikasi web ketika dimuat dan digunakan dalam kondisi yang ditentukan. Pengukuran dapat dilakukan secara laboratorium maupun lapangan. Penelitian ini berfokus pada eksperimen laboratorium terkontrol agar hasil kedua *production build* dapat direproduksi.

Setiap pengujian dilakukan berulang, urutan pengujian Vue.js dan Svelte diselang-seling, dan hasil dilaporkan menggunakan nilai pusat serta ukuran variasi. Total Blocking Time digunakan sebagai metrik laboratorium untuk mengukur waktu halaman terblokir oleh *long task* antara First Contentful Paint dan Time to Interactive (Google, 2026b), bukan sebagai pengganti nilai INP lapangan.

## 2.11 User Experience

*User experience* mencakup persepsi dan respons pengguna sebelum, selama, dan setelah menggunakan suatu sistem. Dalam penelitian ini, pengalaman pengguna diukur menggunakan User Experience Questionnaire (UEQ). UEQ mengukur enam skala, yaitu *attractiveness*, *perspicuity*, *efficiency*, *dependability*, *stimulation*, dan *novelty* (Schrepp, 2023). Instrumen ini mencakup kualitas pragmatis dan hedonis yang tidak seluruhnya dapat dijelaskan oleh metrik performa browser.

UEQ diberikan menggunakan versi bahasa yang tersedia dari sumber resmi. Urutan butir, pasangan atribut, dan prosedur transformasi skor mengikuti panduan UEQ agar validitas instrumen tidak berubah. Hasil dilaporkan per skala.

## 2.12 Usability Testing

*Usability testing* merupakan evaluasi sistem melalui penggunaan oleh partisipan yang sesuai dalam konteks dan tujuan tertentu. ISO 9241-11 menjelaskan usability sebagai hasil penggunaan sistem oleh pengguna tertentu untuk mencapai tujuan tertentu dengan efektivitas, efisiensi, dan kepuasan dalam konteks penggunaan tertentu (ISO, 2018). Efektivitas diukur melalui keberhasilan penyelesaian tugas dan kesalahan; efisiensi melalui waktu penyelesaian serta jalur interaksi; sedangkan kepuasan diukur menggunakan System Usability Scale (SUS).

SUS merupakan kuesioner sepuluh butir untuk memberikan penilaian umum terhadap usability suatu sistem (Brooke, 1996). Skor setiap respons dikonversi sesuai aturan SUS dan dikalikan 2,5 sehingga menghasilkan rentang 0–100. Nilai tersebut merupakan skor usability, bukan persentase keberhasilan.

Dalam penelitian komparatif, setiap partisipan menggunakan kedua prototipe dengan urutan yang diseimbangkan. Setengah partisipan memulai dari Vue.js dan setengah lainnya dari Svelte. Kedua aplikasi ditampilkan sebagai Versi A dan Versi B agar identitas framework tidak memengaruhi penilaian. Skenario tugas dibuat setara, tetapi nilai target dapat dibedakan untuk mengurangi efek hafalan.

## 2.13 Vitest

Vitest adalah framework pengujian untuk aplikasi JavaScript atau TypeScript. Vitest digunakan untuk menguji fungsi pengolahan data pada prototipe Vue.js dan Svelte sehingga logika kedua implementasi menghasilkan keluaran yang setara.

## 2.14 Playwright

Playwright adalah alat otomasi pengujian end-to-end pada aplikasi web dan mendukung Chromium, Firefox, serta WebKit. Playwright digunakan untuk memastikan fitur dan alur interaksi prototipe Vue.js dan Svelte berjalan setara pada viewport mobile sebelum pengukuran performa dan evaluasi pengguna.

## 2.15 Google Lighthouse

Google Lighthouse merupakan alat audit otomatis yang menghasilkan metrik performa laboratorium. Dalam penelitian ini, Lighthouse dijalankan pada *production build* kedua frontend dengan konfigurasi yang ditetapkan. Metrik yang diambil meliputi LCP, CLS, TBT, FCP, Speed Index, dan skor performa. Setiap kondisi diuji berulang dan hasil tidak disimpulkan dari satu kali eksekusi.

## 2.16 Browser Developer Tools

Browser Developer Tools digunakan untuk mengamati aktivitas jaringan dan eksekusi browser. Panel Network digunakan untuk memperoleh total *transferred size*, jumlah *request*, tipe sumber daya, dan status cache. Panel Performance digunakan untuk mengamati aktivitas *scripting*, *rendering*, *painting*, dan *long task*. Data disimpan bersama informasi versi browser, perangkat, viewport, dan konfigurasi jaringan.

---

# BAB 3 METODOLOGI PENELITIAN

## 3.1 Persiapan dan Pengembangan Aplikasi

Tahap persiapan dan pengembangan dilakukan dengan menyiapkan frontend Vue.js, frontend Svelte, dan *service backend* ElysiaJS. Kedua frontend dikembangkan sebagai prototipe website responsif listing properti dengan fitur daftar properti, detail properti, pencarian, filter, pengurutan, pagination atau *load more*, dan wishlist lokal. Backend digunakan sebagai sumber data bersama agar kedua aplikasi mengakses endpoint, dataset, dan struktur respons yang setara.

Tampilan kedua frontend disesuaikan agar memiliki struktur informasi, layout, konten, aset, dan alur penggunaan yang sebanding, terutama pada viewport mobile. Versi framework, browser, sistem operasi, konfigurasi *build*, dan *dependency* dicatat.

## 3.2 Validasi Kesetaraan Fitur

Validasi kesetaraan fitur dilakukan sebelum pengukuran performa dan evaluasi pengguna. Vitest digunakan untuk menguji logika pencarian, filter, pengurutan, pagination, wishlist, dan pemformatan data. Playwright digunakan untuk menguji alur penggunaan melalui browser.

Pengujian menggunakan skenario, dataset, dan viewport yang sama. Apabila ditemukan perbedaan hasil atau perilaku, implementasi diperbaiki hingga kedua frontend memenuhi kriteria penerimaan yang sama. Hanya *commit* yang telah melewati validasi yang digunakan dalam eksperimen.

## 3.3 Pengujian Performa Komputasional

Kedua aplikasi dibangun dalam mode produksi dan dijalankan terhadap backend serta dataset yang sama. Pengujian dilakukan pada mesin, versi browser, viewport, profil CPU, kondisi jaringan, dan kebijakan cache yang tetap. Urutan eksekusi Vue.js dan Svelte diselang-seling untuk mengurangi bias akibat perubahan kondisi mesin.

Google Lighthouse digunakan untuk mengukur LCP, CLS, TBT, FCP, Speed Index, dan skor performa. Pengukuran diulang dalam jumlah yang sama untuk setiap frontend. Nilai median digunakan sebagai ringkasan utama dan disertai ukuran variasi seperti rentang antarkuartil. INP atau latensi interaksi sesi diukur melalui instrumentasi browser pada skenario pencarian dan filter; TBT tidak dilaporkan sebagai INP.

Efisiensi sumber daya dianalisis melalui hasil *production build* dan Browser Developer Tools. Data yang dikumpulkan meliputi ukuran JavaScript *bundle*, total *transferred size*, jumlah *request*, dan aktivitas *main thread*. Kompleksitas implementasi dihitung menggunakan aturan inklusi yang sama. Berkas hasil *build*, kode hasil generasi, *dependency*, *fixture*, dan pengujian dikeluarkan dari perhitungan baris kode aplikasi kecuali dinyatakan lain.

## 3.4 Evaluasi User Experience dan Usability

Evaluasi dilakukan pada *production build* aktual agar partisipan mengalami respons masing-masing framework, bukan prototipe statis. Partisipan dipilih berdasarkan kriteria pernah menggunakan website atau aplikasi pencarian akomodasi/properti. Jumlah partisipan final ditentukan melalui *power analysis* berdasarkan desain berpasangan dan estimasi efek dari uji pilot.

Penelitian menggunakan desain *within-subject counterbalanced*. Setiap partisipan menguji kedua aplikasi. Setengah partisipan memperoleh urutan Vue.js–Svelte dan setengah lainnya Svelte–Vue. Nama framework disamarkan menjadi Versi A dan Versi B. Perangkat, browser, jaringan, viewport, serta kondisi awal cache dibuat sama bagi setiap kondisi.

Skenario tugas mencakup:

1. mencari properti pada lokasi yang ditentukan;
2. menerapkan kriteria filter tertentu;
3. mengurutkan hasil dan memilih properti yang sesuai;
4. membuka halaman detail dan menemukan informasi tertentu; dan
5. menambahkan atau menghapus properti dari wishlist.

Setiap tugas memiliki kondisi sukses, batas waktu, dan definisi kesalahan yang ditentukan sebelum pengumpulan data. Data objektif yang dicatat meliputi keberhasilan tugas, waktu penyelesaian, jumlah kesalahan, jumlah interaksi, dan penyimpangan dari jalur ideal. Setelah menyelesaikan seluruh tugas pada setiap versi, partisipan mengisi UEQ dan SUS mengikuti aturan skoring resmi.

Maze dapat digunakan sebagai media penyajian instruksi, pengumpulan kuesioner, dan rekaman layar. Namun, interaksi aplikasi satu halaman seperti perubahan filter atau wishlist tidak selalu menghasilkan perpindahan URL. Oleh karena itu, *event log* aplikasi dan rekaman sesi digunakan sebagai sumber utama untuk memverifikasi waktu, jalur, dan keberhasilan tugas. Sebelum berpartisipasi, responden menerima penjelasan penelitian dan memberikan persetujuan. Data identitas dibatasi dan dianonimkan.

## 3.5 Analisis Komparatif pada Production Build

Data performa komputasional diringkas menggunakan median, rentang antarkuartil, dan perbedaan relatif antarkondisi. Hasil pengulangan individual disimpan agar variasi pengujian dapat diperiksa.

Data evaluasi pengguna dianalisis sebagai data berpasangan. Perbedaan waktu penyelesaian, skor UEQ, dan skor SUS dianalisis menggunakan *paired t-test* apabila asumsi parametrik terpenuhi atau Wilcoxon signed-rank apabila tidak terpenuhi. Perbedaan keberhasilan tugas dapat dianalisis menggunakan uji McNemar. Hasil dilaporkan bersama ukuran efek dan interval kepercayaan, bukan hanya nilai signifikansi.

Hasil teknis dan hasil pengguna dibandingkan untuk menilai apakah perbedaan performa browser sejalan dengan perbedaan efektivitas, efisiensi, atau persepsi pengguna. Korelasi tidak langsung diinterpretasikan sebagai hubungan sebab-akibat. Kesimpulan dibatasi pada konteks prototipe, kondisi pengujian, dan karakteristik partisipan penelitian.

### Tabel 3.1 Aspek dan Metrik Penelitian

| Aspek | Metrik |
|---|---|
| Core Web Vitals | LCP, INP sesi terkontrol, CLS |
| Metrik laboratorium pendukung | TBT, FCP, Speed Index, skor performa Lighthouse |
| Efisiensi sumber daya | JavaScript *bundle size*, total *transferred size*, jumlah *request*, aktivitas *main thread* |
| Respons interaksi | Waktu respons pencarian/filter dan latensi pembaruan tampilan |
| Kompleksitas implementasi | LOC, jumlah file, jumlah komponen, jumlah *dependency* tambahan |
| Efektivitas penggunaan | Tingkat keberhasilan tugas dan jumlah kesalahan |
| Efisiensi penggunaan | Waktu penyelesaian, jumlah interaksi, dan penyimpangan jalur |
| User experience | Enam skala User Experience Questionnaire (UEQ) |
| Usability | Skor System Usability Scale (SUS) |
| Variabel kontrol | Backend, dataset, aset, layout, fitur, browser, perangkat, jaringan, cache, viewport, dan skenario uji |

### Tabel 3.2 Instrumen dan Alat Pengukuran

| Aspek | Alat/Metode |
|---|---|
| LCP, CLS, TBT, FCP, dan Speed Index | Google Lighthouse |
| INP dan respons interaksi | Instrumentasi browser/*web-vitals* serta skenario interaksi terkontrol |
| JavaScript *bundle size* | Hasil *production build* |
| Total *transferred size* dan jumlah *request* | Chrome DevTools Network |
| Aktivitas *scripting* dan *rendering* | Chrome DevTools Performance |
| User experience | User Experience Questionnaire (UEQ) |
| Usability | System Usability Scale (SUS) |
| Keberhasilan, waktu, dan kesalahan tugas | *Event log* aplikasi, rekaman sesi, dan lembar observasi |
| Kompleksitas implementasi | Analisis kode sumber dengan aturan inklusi yang sama |
| Kesetaraan fungsi | Vitest dan Playwright |
| Penyajian studi pengguna | Maze atau platform survei yang setara |

## 3.6 Tahapan Penelitian

<a id="gambar-31-flowchart-tahapan-skripsi"></a>

~~~mermaid
flowchart TD
    A[Studi Literatur dan Perumusan Variabel] --> B[Pengembangan Prototipe Vue.js dan Svelte]
    B --> C[Validasi Kesetaraan Fitur]
    C --> D{Fitur dan Perilaku Setara?}
    D -- Tidak --> B
    D -- Ya --> E[Production Build dan Penetapan Lingkungan Uji]
    E --> F[Pengujian Performa Komputasional]
    E --> G[Uji Pilot UX dan Usability]
    G --> H[Evaluasi Pengguna dengan Urutan Counterbalanced]
    F --> I[Pengolahan Data]
    H --> I
    I --> J[Analisis Komparatif dan Interpretasi]
    J --> K[Kesimpulan dan Penyusunan Laporan]
~~~

**Gambar 3.1 Flowchart Tahapan Skripsi**

---

# DAFTAR REFERENSI

Andriyanai, F., Putra, R.R.P., Adnandi, M.A. dan Maulana, I., 2025. Optimalisasi SEO Berbasis Core Web Vitals pada Website SMKN 1 Kabupaten Tangerang. *Journal of Information Technology and Computer Science*, 2(2).

Azizullah, A., Rahayudi, B. dan Priyambadha, B., tanpa tahun. Rancang Bangun Sistem Otomatisasi Pengujian Berbasis REST API Terintegrasi dengan Playwright pada PT XYZ.

Brooke, J., 1996. SUS: A Quick and Dirty Usability Scale. Dalam: P.W. Jordan, B. Thomas, B.A. Weerdmeester dan I.L. McClelland, ed. *Usability Evaluation in Industry*. London: Taylor & Francis, hlm. 189–194. Tersedia pada: <https://hci-studies.org/methods-and-measures/downloads/SUS_Brooke1996.pdf>.

ElysiaJS, 2026. *Eden Treaty Overview*. Tersedia pada: <https://elysiajs.com/eden/treaty/overview.html> [Diakses 14 Agustus 2026].

Ferreira, F., Borges, H.S. dan Valente, M.T., 2022. On the (un-)adoption of JavaScript front-end frameworks. *Software: Practice and Experience*, 52(4), hlm. 947–966. <https://doi.org/10.1002/spe.3044>.

Google, 2026a. *Web Vitals*. Tersedia pada: <https://web.dev/articles/vitals> [Diakses 14 Agustus 2026].

Google, 2026b. *Total Blocking Time*. Tersedia pada: <https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time> [Diakses 14 Agustus 2026].

ISO, 2018. *ISO 9241-11:2018 Ergonomics of Human-System Interaction—Part 11: Usability: Definitions and Concepts*. Geneva: International Organization for Standardization. Tersedia pada: <https://www.iso.org/standard/63500.html>.

Laugwitz, B., Held, T. dan Schrepp, M., 2008. Construction and Evaluation of a User Experience Questionnaire. Dalam: A. Holzinger, ed. *HCI and Usability for Education and Work*. Lecture Notes in Computer Science, 5298, hlm. 63–76. <https://doi.org/10.1007/978-3-540-89350-9_6>.

Maze, 2026. *Website Test: Run Usability Tests on Your Live Websites*. Tersedia pada: <https://help.maze.co/articles/2471284614-website-test-run-usability-tests-on-your-live-websites> [Diakses 14 Agustus 2026].

Microsoft, 2026. *Playwright Documentation*. Tersedia pada: <https://playwright.dev/docs/intro> [Diakses 14 Agustus 2026].

Schrepp, M., 2023. *User Experience Questionnaire Handbook: All You Need to Know to Apply the UEQ Successfully in Your Projects*. Versi 11. Tersedia pada: <https://www.ueq-online.org/Material/Handbook.pdf>.

Sofi'ie, F.A.F. dan Qoiriah, A., 2023. Analisis Perbandingan Framework Front-End JavaScript React dan Vue pada Pengembangan Website. *Journal of Informatics and Computer Science (JINACS)*, 5(2), hlm. 157–164. <https://doi.org/10.26740/jinacs.v5n02.p157-164>.

Vitest, 2026. *Vitest Guide*. Tersedia pada: <https://vitest.dev/guide/> [Diakses 14 Agustus 2026].

