# Instrumen Evaluasi UX untuk Subbab 3.5.2

Dokumen ini merinci skenario pengujian untuk *concurrent Think Aloud Protocol*, instrumen kuantitatif *User Experience Questionnaire* (UEQ), dan pembagian profil perangkat. Dokumen ini menjadi lampiran operasional untuk Subbab 3.5.2 dan tidak mengubah ruang lingkup eksperimen utama: perlakuan yang dibandingkan tetap frontend VueJS dan Svelte, sedangkan API, dataset, aset, fitur, skenario, dan kondisi lain harus setara.

## 1. Rancangan eksperimen UX

Evaluasi menggunakan desain *within-subject* untuk faktor framework: setiap responden menggunakan prototipe VueJS dan Svelte. Faktor perangkat menggunakan pembagian antarkelompok: setiap responden ditempatkan hanya pada satu strata perangkat dan menyelesaikan semua tugas pada perangkat yang sama.

| Kode strata | Tipe perangkat | Subtipe | Perlakuan yang dicoba responden |
| --- | --- | --- | --- |
| MH | Mobile | High-end | VueJS dan Svelte |
| ML | Mobile | Low-end | VueJS dan Svelte |
| DH | Desktop | High-end | VueJS dan Svelte |
| DL | Desktop | Low-end | VueJS dan Svelte |

Urutan framework diseimbangkan di dalam setiap strata:

- Kelompok A: VueJS lalu Svelte.
- Kelompok B: Svelte lalu VueJS.
- Jumlah responden kelompok A dan B pada setiap strata dibuat sama atau berbeda paling banyak satu responden.

Dengan rancangan ini, perbandingan VueJS–Svelte tetap berpasangan pada responden dan perangkat yang sama. Seorang responden tidak diminta mencoba keempat strata perangkat karena delapan kombinasi perlakuan akan memperbesar kelelahan dan efek belajar.

### 1.1 Definisi operasional profil perangkat

Kriteria berikut digunakan untuk memilih perangkat penelitian. Model perangkat yang benar-benar digunakan harus dibekukan sebelum pengambilan data dan dicatat lengkap dalam lembar konfigurasi.

| Strata | Kriteria pemilihan minimum | Konfigurasi yang dikendalikan |
| --- | --- | --- |
| Mobile high-end (MH) | Smartphone Android kelas upper-mid/flagship, RAM minimal 8 GB, SoC berusia paling lama 3 tahun pada awal pengujian | Chrome versi mayor yang sama; mode hemat daya mati; refresh rate dikunci 60 Hz jika tersedia; orientasi potret; tidak ada aplikasi berat di latar belakang |
| Mobile low-end (ML) | Smartphone Android kelas entry/lower-mid, RAM maksimal 4 GB | Chrome versi mayor yang sama; mode hemat daya mati; refresh rate 60 Hz; orientasi potret; tidak ada aplikasi berat di latar belakang |
| Desktop high-end (DH) | Windows 11, CPU minimal 8 logical processor, RAM minimal 16 GB, penyimpanan SSD | Chrome versi mayor yang sama; skala tampilan dan zoom 100%; jendela browser dimaksimalkan; proses latar belakang non-esensial ditutup |
| Desktop low-end (DL) | Windows 11, CPU 2–4 logical processor, RAM 4–8 GB, penyimpanan SSD | Chrome versi mayor yang sama; skala tampilan dan zoom 100%; jendela browser dimaksimalkan; proses latar belakang non-esensial ditutup |

Catatan metodologis:

- High-end dan low-end merupakan strata konteks penggunaan, bukan manipulasi CPU tunggal. Hasil antarkelas perangkat tidak boleh ditafsirkan sebagai efek CPU saja karena RAM, GPU, layar, dan sistem dapat ikut berbeda.
- Kedua framework pada satu strata harus dijalankan pada perangkat fisik, browser, jaringan, dan sesi penelitian yang sama.
- Mobile high-end dan low-end menggunakan keluarga sistem operasi yang sama. Desktop high-end dan low-end juga menggunakan sistem operasi yang sama.
- Seluruh strata menggunakan jaringan Wi-Fi pengujian dan titik akses yang sama. Kondisi jaringan dicatat, tetapi tidak sengaja dibedakan antara high-end dan low-end.
- Model perangkat, CPU/SoC, jumlah RAM, versi OS, versi browser, resolusi fisik, ukuran viewport CSS, *device pixel ratio*, dan refresh rate dicatat untuk setiap sesi.
- Jika jumlah responden per strata tidak memadai untuk analisis inferensial, hasil per strata dilaporkan secara deskriptif dan tidak digunakan untuk klaim perbedaan kelas perangkat.

### 1.2 Lembar konfigurasi sesi

Sebelum sesi dimulai, peneliti mengisi data berikut:

| Field | Nilai |
| --- | --- |
| ID responden |  |
| Kode strata perangkat | MH / ML / DH / DL |
| Kelompok urutan | A / B |
| Model perangkat |  |
| CPU/SoC dan RAM |  |
| Sistem operasi |  |
| Browser dan versi |  |
| Resolusi dan viewport CSS |  |
| *Device pixel ratio* dan refresh rate |  |
| Jaringan/titik akses |  |
| Tanggal dan waktu |  |
| Versi build/commit VueJS |  |
| Versi build/commit Svelte |  |
| URL API dan versi dataset |  |

## 2. Persiapan sesi Think Aloud

### 2.1 Prasyarat

Sebelum menerima responden, peneliti harus memastikan bahwa:

1. VueJS dan Svelte menggunakan *production build* dari commit penelitian yang sama.
2. Kedua prototipe mengakses API dan seed katalog yang sama.
3. Daftar, detail, search, filter, sorting, wishlist, *load more*, serta keadaan loading/error/empty telah lulus pengujian paritas.
4. Browser dimulai dari konteks baru untuk setiap prototipe. Cache, state query, dan wishlist lokal dikembalikan ke kondisi awal yang sama.
5. Perekaman layar, suara responden, waktu tugas, dan catatan moderator telah diuji.
6. Notifikasi perangkat, pembaruan otomatis, sinkronisasi, dan aplikasi latar belakang yang dapat mengganggu telah dinonaktifkan.
7. Responden menerima lembar persetujuan dan menyetujui perekaman sebelum sesi dimulai.

### 2.2 Kesiapan skenario load more

Seed katalog berisi 36 properti dan API menggunakan `limit=12` secara default. Kondisi ini menghasilkan tiga halaman data sehingga tombol *Load more* dapat digunakan pada skenario TA-05.

Seed, nilai `limit`, dan item target pada halaman kedua harus dibekukan sebelum pengambilan data serta diterapkan secara identik pada VueJS dan Svelte.

### 2.3 Naskah pembuka moderator

Moderator membacakan naskah yang sama pada setiap sesi:

> Penelitian ini mengevaluasi prototipe, bukan kemampuan Anda. Selama mengerjakan tugas, mohon ucapkan apa yang Anda lihat, pikirkan, harapkan, dan rasakan. Ceritakan juga alasan Anda memilih suatu tindakan serta bagian yang membingungkan. Saya tidak dapat memberi petunjuk penyelesaian, tetapi dapat mengingatkan Anda untuk terus berbicara. Anda dapat berhenti kapan saja.

Sebelum tugas inti, responden melakukan satu latihan singkat pada halaman netral yang tidak termasuk kedua prototipe, misalnya mencari sebuah informasi sederhana sambil mengutarakan pikirannya. Data latihan tidak dianalisis.

### 2.4 Intervensi moderator yang diperbolehkan

Moderator tidak menyebut nama kontrol, posisi kontrol, atau langkah penyelesaian. Jika responden diam lebih dari sekitar 10 detik, moderator hanya menggunakan pengingat netral berikut:

- “Mohon terus utarakan apa yang sedang Anda pikirkan.”
- “Apa yang sedang Anda perhatikan saat ini?”
- “Apa yang Anda harapkan akan terjadi?”

Jika responden bertanya cara menyelesaikan tugas, moderator menjawab, “Silakan lakukan seperti yang menurut Anda paling masuk akal.” Bantuan langsung dicatat sebagai intervensi dan tugas tidak dapat diklasifikasikan sebagai berhasil tanpa hambatan.

## 3. Skenario pengujian Think Aloud

Skenario diberikan satu per satu. Teks pada kolom “Instruksi untuk responden” dibacakan apa adanya. Target dan kriteria penerimaan hanya untuk moderator.

### TA-01 — Memahami katalog dan memilih kandidat

**Tujuan:** mengamati pemahaman awal terhadap informasi pada kartu properti dan navigasi katalog.

**Kondisi awal:** halaman daftar terbuka pada kondisi default; belum ada search, filter, sorting, atau perubahan wishlist.

**Instruksi untuk responden:**

> Bayangkan Anda sedang mencari inspirasi tempat menginap. Jelajahi daftar yang tersedia, lalu pilih satu properti yang menurut Anda paling menarik untuk dilihat lebih lanjut. Beri tahu alasan pilihan Anda dan berhenti sebelum membuka detailnya.

**Target moderator:** responden dapat membedakan judul, lokasi, harga, rating, dan status yang relevan pada kartu, kemudian menunjuk satu kandidat.

**Kriteria berhasil:** responden memilih satu properti dan menjelaskan alasan berdasarkan informasi yang terlihat tanpa bantuan moderator.

**Hal yang diamati:** fokus pertama, istilah yang tidak dipahami, keterbacaan harga/rating, kemampuan membedakan elemen interaktif, pola scroll, dan keyakinan sebelum memilih.

**Batas waktu:** 3 menit.

### TA-02 — Pencarian berdasarkan tujuan perjalanan

**Tujuan:** mengevaluasi kemudahan menemukan dan menggunakan pencarian serta memahami hasilnya.

**Kondisi awal:** daftar dikembalikan ke kondisi default.

**Instruksi untuk responden:**

> Anda akan bepergian ke Kaliurang bersama empat orang. Temukan akomodasi di lokasi tersebut yang dapat menampung rombongan Anda. Berhenti ketika Anda yakin telah menemukan kandidat yang sesuai.

**Target moderator:** hasil mengarah ke “Kabin Kayu Tenang di Kaliurang” (`prop_004`), yang berlokasi di Kaliurang dan memiliki kapasitas empat tamu.

**Kriteria berhasil:** responden menjalankan pencarian yang relevan, mengenali hasil yang benar, dan menyatakan kesesuaiannya tanpa bantuan.

**Hal yang diamati:** keterlihatan kontrol search, kata kunci yang dipilih, pemahaman terhadap perubahan hasil, umpan balik selama pemuatan, strategi ketika hasil tidak sesuai, dan kejelasan cara menghapus pencarian.

**Batas waktu:** 4 menit.

### TA-03 — Filter dengan beberapa kriteria

**Tujuan:** mengevaluasi penemuan, pemahaman, dan penerapan beberapa filter secara bersamaan.

**Kondisi awal:** seluruh query dikosongkan dan daftar kembali ke kondisi default.

**Instruksi untuk responden:**

> Anda mencari villa di Canggu untuk enam tamu dengan anggaran maksimal Rp1.500.000 per malam. Tempat tersebut harus memiliki kolam renang pribadi dan Wi-Fi. Terapkan kebutuhan itu dan tunjukkan properti yang memenuhi semuanya.

**Target moderator:** “Villa Tropis dengan Kolam Renang” (`prop_001`). Kriteria pada seed: Canggu, tipe Villa, kapasitas 6, harga Rp1.250.000, `Private Pool`, dan `Wi-Fi`.

**Kriteria berhasil:** seluruh filter penting diterapkan dan hasil akhir memuat `prop_001`; responden dapat menjelaskan mengapa hasil sesuai.

**Hal yang diamati:** kemampuan menemukan panel filter, pemahaman batas harga dan kapasitas minimum, pemahaman bahwa fasilitas menggunakan semantik AND, keterlihatan filter aktif, cara menerapkan/membatalkan filter, serta kesalahan input.

**Batas waktu:** 6 menit.

### TA-04 — Mengurutkan dan membandingkan hasil

**Tujuan:** mengevaluasi pemahaman opsi sorting dan perubahan urutan daftar.

**Kondisi awal:** seluruh search dan filter dihapus; semua properti kembali terlihat.

**Instruksi untuk responden:**

> Anda ingin melihat pilihan dari harga per malam yang paling murah. Atur daftar sesuai kebutuhan itu, lalu sebutkan properti pertama dan harganya.

**Target moderator:** sorting `price_asc`; item pertama “Guesthouse Nyaman untuk Remote Work” (`prop_005`) dengan harga Rp430.000 per malam.

**Kriteria berhasil:** responden memilih urutan harga termurah dan menyebut item pertama beserta harga yang benar.

**Hal yang diamati:** penemuan kontrol sorting, pemahaman label opsi, keyakinan bahwa urutan telah berubah, dan kemampuan membedakan sorting dari filtering.

**Batas waktu:** 3 menit.

### TA-05 — Memuat hasil tambahan

**Status:** siap dijalankan menggunakan seed 36 properti dan `limit=12`.

**Tujuan:** mengevaluasi pemahaman dan umpan balik pada pola pagination berbasis *Load more*.

**Kondisi awal:** daftar default memiliki item lebih banyak daripada `limit`; item target yang telah dibekukan dalam manifest eksperimen berada pada halaman kedua.

**Instruksi untuk responden:**

> Properti yang Anda cari belum terlihat pada daftar awal. Tampilkan pilihan tambahan tanpa meninggalkan halaman ini, lalu lanjutkan sampai item target yang disebutkan moderator terlihat.

**Target moderator:** responden menggunakan *Load more* satu kali, item lama tetap berada di daftar, item halaman berikutnya ditambahkan, dan tombol mengikuti `meta.hasMore`.

**Kriteria berhasil:** responden memuat halaman berikutnya tanpa mengulang atau mengganti daftar sebelumnya dan menemukan item target.

**Hal yang diamati:** keterlihatan tombol, pemahaman label, umpan balik pemuatan, percobaan klik ganda, posisi scroll, duplikasi item, dan pemahaman bahwa hasil baru ditambahkan.

**Batas waktu:** 4 menit.

### TA-06 — Membuka dan memahami detail properti

**Tujuan:** mengevaluasi navigasi dari daftar ke detail dan pemahaman informasi detail.

**Kondisi awal:** daftar menampilkan “Kabin Kayu Tenang di Kaliurang” (`prop_004`).

**Instruksi untuk responden:**

> Buka informasi lengkap Kabin Kayu Tenang di Kaliurang. Tentukan apakah tempat ini sesuai untuk empat tamu, lalu sebutkan dua informasi lain yang membantu keputusan Anda.

**Target moderator:** responden membuka detail `prop_004`, menemukan kapasitas empat tamu, dan menggunakan informasi lain yang benar seperti harga, jumlah kamar/tempat tidur, rating, fasilitas, deskripsi, host, atau gambar.

**Kriteria berhasil:** halaman detail terbuka, kapasitas diidentifikasi dengan benar, dan dua informasi tambahan disebutkan berdasarkan konten detail.

**Hal yang diamati:** affordance untuk membuka detail, orientasi setelah navigasi, hierarki informasi, penggunaan gambar, keterbacaan fasilitas, kebutuhan kembali ke daftar, dan bagian yang dianggap kurang lengkap.

**Batas waktu:** 5 menit.

### TA-07 — Wishlist lintas halaman

**Tujuan:** mengevaluasi pemahaman tombol wishlist dan konsistensi state antara detail dan daftar.

**Kondisi awal:** responden berada pada detail `prop_004`; status awal wishlist properti adalah tidak tersimpan.

**Instruksi untuk responden:**

> Simpan properti ini ke wishlist. Setelah itu kembali ke daftar dan pastikan bahwa properti tersebut masih ditandai sebagai tersimpan.

**Target moderator:** wishlist `prop_004` berubah menjadi aktif di detail dan tetap aktif pada kartu daftar selama sesi frontend yang sama.

**Kriteria berhasil:** responden menemukan kontrol wishlist, memahami perubahan state, kembali ke daftar, dan memverifikasi state yang konsisten.

**Hal yang diamati:** nama/ikon yang dipahami, umpan balik visual dan aksesibel, kekhawatiran tentang login atau penyimpanan permanen, navigasi kembali, serta inkonsistensi state.

**Batas waktu:** 4 menit.

### TA-08 — Empty state dan pemulihan

**Tujuan:** mengevaluasi pemahaman ketika pencarian tidak menghasilkan data dan kemampuan pulih.

**Kondisi awal:** halaman daftar; query sebelumnya dihapus.

**Instruksi untuk responden:**

> Cari properti dengan kata kunci “Jakarta”. Jika tidak ada hasil, jelaskan apa yang menurut Anda terjadi, lalu kembalikan daftar hingga semua pilihan awal terlihat lagi.

**Target moderator:** seed tidak memiliki properti di Jakarta; frontend menampilkan empty state yang setara dan responden dapat menghapus/reset query.

**Kriteria berhasil:** responden mengenali bahwa hasil kosong bukan kegagalan sistem dan berhasil memulihkan daftar default.

**Hal yang diamati:** kejelasan pesan kosong, perbedaan persepsi antara empty dan error, penemuan aksi reset, dan jumlah percobaan untuk pulih.

**Batas waktu:** 4 menit.

## 4. Pencatatan dan klasifikasi hasil Think Aloud

Untuk setiap tugas dan prototipe, moderator mengisi:

| Field | Nilai yang dicatat |
| --- | --- |
| ID responden, strata, framework, dan urutan | Kode sesi |
| Waktu mulai dan selesai | Timestamp; hitung *time on task* |
| Status tugas | S0 / S1 / F / A / X |
| Jumlah salah aksi | Bilangan bulat |
| Jumlah intervensi moderator | Bilangan bulat |
| Kutipan relevan | Transkripsi verbatim singkat dan timestamp |
| Perilaku/masalah | Tindakan, keraguan, kesalahan, pemulihan |
| Bagian antarmuka | Search, filter, sorting, listing, detail, wishlist, load more, empty state |
| Dampak | Kritis / Mayor / Minor |
| Catatan sistem | Loading lambat, error jaringan, bug, atau gangguan eksternal |

Kode status tugas:

- **S0 — berhasil tanpa hambatan:** tujuan tercapai tanpa salah aksi berarti dan tanpa bantuan.
- **S1 — berhasil dengan hambatan:** tujuan tercapai setelah keraguan, salah aksi, pemulihan, atau pengingat moderator.
- **F — gagal:** tujuan tidak tercapai dalam batas waktu atau hasil akhir salah.
- **A — dihentikan responden:** responden memilih berhenti sebelum batas waktu.
- **X — kegagalan sistem:** tugas tidak dapat dinilai karena bug, jaringan, perekaman, atau kondisi eksternal. Data X tidak digolongkan sebagai kegagalan usability tanpa pemeriksaan.

Tingkat dampak temuan:

- **Kritis:** menghalangi penyelesaian tugas.
- **Mayor:** menyebabkan kesalahan atau kesulitan berarti, tetapi responden dapat pulih.
- **Minor:** menimbulkan keraguan atau ketidaknyamanan tanpa menghalangi tugas.

## 5. User Experience Questionnaire (UEQ)

UEQ penuh digunakan karena penelitian membutuhkan enam skala terpisah: *Attractiveness*, *Perspicuity*, *Efficiency*, *Dependability*, *Stimulation*, dan *Novelty*. Instrumen berisi 26 pasangan kata berlawanan dengan tujuh posisi jawaban.

### 5.1 Waktu dan tata cara pemberian

1. Setelah responden menyelesaikan seluruh tugas pada satu prototipe, moderator langsung memberikan UEQ untuk prototipe tersebut.
2. UEQ diisi sebelum wawancara, diskusi, atau penjelasan moderator agar menangkap kesan langsung.
3. Setelah UEQ pertama selesai, state dan browser direset, responden mengerjakan prototipe kedua, lalu mengisi UEQ kedua.
4. Formulir diberi label netral “Prototipe A” dan “Prototipe B” sesuai urutan sesi. Pemetaan ke VueJS/Svelte disimpan terpisah.
5. Urutan item dan posisi pasangan kiri–kanan tidak diubah. Item tidak boleh diparafrasekan, dihapus satu per satu, atau disusun agar semua istilah positif berada pada sisi yang sama.
6. Responden memilih tepat satu angka 1–7 untuk setiap pasangan. Angka 1 berarti sangat dekat dengan istilah kiri, angka 7 sangat dekat dengan istilah kanan, dan angka 4 berada di tengah.

Naskah instruksi responden:

> Nilailah kesan Anda terhadap prototipe yang baru saja digunakan. Setiap baris memiliki dua istilah yang berlawanan. Pilih satu posisi dari 1 sampai 7 yang paling mewakili kesan spontan Anda. Angka 1 paling dekat dengan istilah kiri, angka 7 paling dekat dengan istilah kanan, dan angka 4 berada di tengah. Tidak ada jawaban benar atau salah. Mohon jawab semua baris tanpa berdiskusi dengan moderator.

### 5.2 Butir kuantitatif UEQ versi Indonesia

| No. | Istilah kiri | 1–7 | Istilah kanan | Skala UEQ |
| ---: | --- | :---: | --- | --- |
| 1 | Menyusahkan | 1 2 3 4 5 6 7 | Menyenangkan | Attractiveness |
| 2 | Tak dapat dipahami | 1 2 3 4 5 6 7 | Dapat dipahami | Perspicuity |
| 3 | Kreatif | 1 2 3 4 5 6 7 | Monoton | Novelty |
| 4 | Mudah dipelajari | 1 2 3 4 5 6 7 | Sulit dipelajari | Perspicuity |
| 5 | Bermanfaat | 1 2 3 4 5 6 7 | Kurang bermanfaat | Stimulation |
| 6 | Membosankan | 1 2 3 4 5 6 7 | Mengasyikkan | Stimulation |
| 7 | Tidak menarik | 1 2 3 4 5 6 7 | Menarik | Stimulation |
| 8 | Tak dapat diprediksi | 1 2 3 4 5 6 7 | Dapat diprediksi | Dependability |
| 9 | Cepat | 1 2 3 4 5 6 7 | Lambat | Efficiency |
| 10 | Berdaya cipta | 1 2 3 4 5 6 7 | Konvensional | Novelty |
| 11 | Menghalangi | 1 2 3 4 5 6 7 | Mendukung | Dependability |
| 12 | Baik | 1 2 3 4 5 6 7 | Buruk | Attractiveness |
| 13 | Rumit | 1 2 3 4 5 6 7 | Sederhana | Perspicuity |
| 14 | Tidak disukai | 1 2 3 4 5 6 7 | Menggembirakan | Attractiveness |
| 15 | Lazim | 1 2 3 4 5 6 7 | Terdepan | Novelty |
| 16 | Tidak nyaman | 1 2 3 4 5 6 7 | Nyaman | Attractiveness |
| 17 | Aman | 1 2 3 4 5 6 7 | Tidak aman | Dependability |
| 18 | Memotivasi | 1 2 3 4 5 6 7 | Tidak memotivasi | Stimulation |
| 19 | Memenuhi ekspektasi | 1 2 3 4 5 6 7 | Tidak memenuhi ekspektasi | Dependability |
| 20 | Tidak efisien | 1 2 3 4 5 6 7 | Efisien | Efficiency |
| 21 | Jelas | 1 2 3 4 5 6 7 | Membingungkan | Perspicuity |
| 22 | Tidak praktis | 1 2 3 4 5 6 7 | Praktis | Efficiency |
| 23 | Terorganisasi | 1 2 3 4 5 6 7 | Berantakan | Efficiency |
| 24 | Atraktif | 1 2 3 4 5 6 7 | Tidak atraktif | Attractiveness |
| 25 | Ramah pengguna | 1 2 3 4 5 6 7 | Tidak ramah pengguna | Attractiveness |
| 26 | Konservatif | 1 2 3 4 5 6 7 | Inovatif | Novelty |

Pemetaan skala untuk pemeriksaan data:

- **Attractiveness:** item 1, 12, 14, 16, 24, dan 25.
- **Perspicuity:** item 2, 4, 13, dan 21.
- **Efficiency:** item 9, 20, 22, dan 23.
- **Dependability:** item 8, 11, 17, dan 19.
- **Stimulation:** item 5, 6, 7, dan 18.
- **Novelty:** item 3, 10, 15, dan 26.

### 5.3 Struktur data kuantitatif

Satu baris data merepresentasikan satu penilaian responden terhadap satu prototipe. Struktur minimum:

```text
respondent_id, device_stratum, order_group, treatment, session_order,
item_01, item_02, ..., item_26
```

Aturan pengolahan:

- Simpan jawaban mentah sebagai 1–7 sesuai posisi yang dilihat responden.
- Jangan membalik skor secara manual di file mentah.
- Impor 26 item dalam urutan asli ke versi terbaru alat analisis resmi UEQ agar polaritas item dikonversi dengan benar ke rentang -3 sampai +3.
- Hitung dan laporkan mean skala, simpangan baku, dan interval kepercayaan 95% untuk setiap framework.
- Karena responden yang sama menilai VueJS dan Svelte, perbandingan framework harus mempertahankan pasangan responden. Laporkan selisih berpasangan dan ukuran efek; pilihan uji parametrik atau nonparametrik ditetapkan sebelum melihat hasil.
- Laporkan hasil per strata MH, ML, DH, dan DL. Gabungkan strata hanya jika model analisis memang mengendalikan faktor perangkat dan ukuran sampel mencukupi.
- Gunakan *UEQ Compare Products Tool* terbaru untuk pemeriksaan perbandingan dan *Data Analysis Tool* terbaru untuk skor serta benchmark.
- Nilai di atas 0,8 dapat dibaca sebagai evaluasi positif, di bawah -0,8 sebagai negatif, dan di antaranya sebagai netral menurut interpretasi standar UEQ; kategori benchmark harus mengikuti versi alat yang digunakan pada saat analisis.
- Periksa respons tidak konsisten menggunakan lembar pemeriksaan kualitas pada alat resmi. Kriteria eksklusi harus ditetapkan sebelum analisis dan setiap data yang dikeluarkan dilaporkan.

### 5.4 Data profil responden

Data berikut dikumpulkan sekali sebelum pengujian dan tidak dimasukkan sebagai item UEQ:

- ID anonim responden.
- Rentang usia.
- Pengalaman menggunakan website atau aplikasi listing properti.
- Frekuensi penggunaan web melalui mobile dan desktop.
- Pengalaman sebelumnya dengan website Airbnb atau layanan serupa.
- Kebutuhan aksesibilitas atau alat bantu yang digunakan selama sesi.

Nama lengkap, alamat, nomor telepon, dan informasi identitas langsung tidak diperlukan untuk analisis UX ini.

## 6. Urutan satu sesi penelitian

1. Persetujuan partisipasi dan perekaman.
2. Pengisian profil responden dan lembar konfigurasi perangkat.
3. Pembacaan naskah Think Aloud dan tugas latihan.
4. Prototipe pertama sesuai kelompok urutan: TA-01 sampai TA-08.
5. Pengisian UEQ untuk prototipe pertama sebelum diskusi.
6. Istirahat singkat dan reset browser/state.
7. Prototipe kedua: skenario yang sama dengan data, instruksi, dan kondisi identik.
8. Pengisian UEQ untuk prototipe kedua sebelum diskusi.
9. Wawancara penutup singkat dan verifikasi catatan, tanpa mengubah jawaban UEQ.

Sebelum setiap sesi, peneliti memverifikasi bahwa halaman kedua dan item target TA-05 tersedia pada kedua prototipe. Jika prasyarat tersebut gagal akibat penyimpangan lingkungan, tugas dilewati pada kedua prototipe dan penyimpangan dicatat sebelum sesi, bukan diputuskan setelah melihat perilaku responden.

## 7. Sumber instrumen

- [Situs resmi User Experience Questionnaire](https://ueq-online.org/)
- [UEQ Handbook — Martin Schrepp](https://ueq-online.org/Material/Handbook.pdf)
- [Santoso et al. (2016), Measuring User Experience of the Student-Centered e-Learning Environment](https://eric.ed.gov/?id=EJ1087680)

Versi UEQ Indonesia dan alat analisis yang dipakai dalam pengambilan data harus diarsipkan bersama artefak penelitian agar urutan item, terjemahan, aturan skoring, dan benchmark dapat direproduksi.
