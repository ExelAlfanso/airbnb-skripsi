# Instrumen Evaluasi UX untuk Subbab 3.5.2

Dokumen ini merinci skenario pengujian untuk *concurrent Think Aloud Protocol*, instrumen kuantitatif *User Experience Questionnaire* (UEQ), dan pembagian profil perangkat. Dokumen ini menjadi lampiran operasional untuk Subbab 3.5.2 dan tidak mengubah ruang lingkup eksperimen utama: perlakuan yang dibandingkan tetap frontend VueJS dan Svelte, sedangkan API, dataset, aset, fitur, skenario, dan kondisi lain harus setara.

## 1. Rancangan eksperimen UX

Evaluasi menggunakan desain berpasangan (*within-subject*) untuk faktor framework: setiap responden menggunakan Prototipe A (VueJS) dan Prototipe B (Svelte). Faktor perangkat tetap antarkelompok: setiap responden ditempatkan hanya pada satu strata perangkat.

| Kode strata | Tipe perangkat | Subtipe | Perlakuan yang dicoba responden |
| --- | --- | --- | --- |
| MH | Mobile | High-end | A dan B |
| ML | Mobile | Low-end | A dan B |
| DH | Desktop | High-end | A dan B |
| DL | Desktop | Low-end | A dan B |

Urutan prototipe diacak sebelum sesi dengan jumlah responden yang diseimbangkan di dalam setiap strata:

- Kelompok A: responden menjalankan seluruh tugas dan mengisi UEQ untuk A, lalu mengulangi prosedur pada B.
- Kelompok B: responden menjalankan seluruh tugas dan mengisi UEQ untuk B, lalu mengulangi prosedur pada A.
- Jumlah responden kedua kelompok urutan pada setiap strata dibuat sama atau berbeda paling banyak satu responden.

Dengan rancangan ini, perbandingan VueJS–Svelte menggunakan dua penilaian dari responden yang sama. Pembalikan urutan membatasi efek belajar dan kelelahan; urutan dicatat untuk interpretasi hasil.

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
- Kedua framework pada satu strata harus dijalankan dengan spesifikasi perangkat, browser, jaringan, dan prosedur sesi yang sebanding. Jika perangkat fisik yang sama dipakai bergantian oleh responden berbeda, kondisi awalnya direset sebelum setiap sesi.
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
| Kelompok urutan | A lalu B / B lalu A |
| Model perangkat |  |
| CPU/SoC dan RAM |  |
| Sistem operasi |  |
| Browser dan versi |  |
| Resolusi dan viewport CSS |  |
| *Device pixel ratio* dan refresh rate |  |
| Jaringan/titik akses |  |
| Tanggal dan waktu |  |
| Versi build/commit prototipe yang diuji |  |
| URL API dan versi dataset |  |

## 2. Persiapan sesi Think Aloud

### 2.1 Prasyarat

Sebelum menerima responden, peneliti harus memastikan bahwa:

1. VueJS dan Svelte menggunakan *production build* dari commit penelitian yang sama.
2. Kedua prototipe mengakses API dan seed katalog yang sama.
3. Daftar, detail, search, filter, sorting, wishlist, *load more*, serta keadaan loading/error/empty telah lulus pengujian paritas.
4. Browser dimulai dari konteks baru untuk setiap prototipe. Cache, state query, dan wishlist lokal dikembalikan ke kondisi awal yang sama sebelum prototipe kedua.
5. Perekaman layar, suara responden, waktu tugas, dan catatan moderator telah diuji.
6. Notifikasi perangkat, pembaruan otomatis, sinkronisasi, dan aplikasi latar belakang yang dapat mengganggu telah dinonaktifkan.
7. Responden menerima lembar persetujuan dan menyetujui perekaman sebelum sesi dimulai.

### 2.2 Kesiapan skenario load more

Seed katalog berisi 36 properti. Meskipun nilai default API adalah `limit=12`, kedua frontend mengirim `limit=6` sehingga daftar memiliki enam halaman data dan tombol *Load more* dapat digunakan pada skenario TA-05.

Seed, nilai `limit`, dan urutan item pada halaman kedua harus dibekukan sebelum pengambilan data serta diterapkan secara identik pada VueJS dan Svelte.

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

Skenario diberikan satu per satu. Teks pada kolom “Instruksi untuk responden” dibacakan apa adanya sebagai tujuan tugas, tanpa menyebut nama atau letak kontrol dan tanpa memperagakan cara menyelesaikannya. Target dan kriteria penerimaan hanya untuk moderator; keduanya tidak dibacakan atau ditunjukkan kepada responden. Moderator tidak mengonfirmasi apakah suatu tindakan sudah benar selama tugas berlangsung.

### TA-01 — Mencari akomodasi menurut lokasi dan jumlah tamu

**Tujuan:** mengevaluasi kemudahan menemukan akomodasi sesuai lokasi dan kapasitas tamu.

**Kondisi awal:** halaman daftar terbuka pada kondisi default; belum ada pencarian, filter, atau perubahan wishlist.

**Instruksi untuk responden:**

> Anda akan bepergian ke Kaliurang bersama empat orang. Temukan akomodasi di lokasi tersebut yang dapat menampung rombongan Anda. Berhenti ketika Anda yakin telah menemukan kandidat yang sesuai.

**Target moderator:** “Kabin Kayu Tenang di Kaliurang” (`prop_004`), yang berlokasi di Kaliurang dan memiliki kapasitas empat tamu.

**Kriteria berhasil:** responden menemukan akomodasi di Kaliurang untuk empat tamu dan menjelaskan kesesuaiannya tanpa bantuan. Cara menemukannya dicatat oleh moderator.

**Hal yang diamati:** keterlihatan pencarian dan pengaturan jumlah tamu, kata kunci yang dipilih, pemahaman terhadap hasil, serta kesulitan saat mencari.

**Batas waktu:** 4 menit.

### TA-02 — Menyaring berdasarkan beberapa kebutuhan

**Tujuan:** mengevaluasi penemuan, pemahaman, dan penerapan kriteria harga, tipe, kapasitas, dan fasilitas secara bersamaan.

**Kondisi awal:** seluruh query dikosongkan dan daftar kembali ke kondisi default.

**Instruksi untuk responden:**

> Anda mencari villa di Canggu untuk enam tamu dengan anggaran maksimal Rp1.500.000 per malam. Tempat tersebut harus memiliki kolam renang pribadi dan Wi-Fi. Temukan properti yang memenuhi semuanya.

**Target moderator:** “Villa Tropis dengan Kolam Renang” (`prop_001`). Kriteria pada seed: Canggu, tipe Villa, kapasitas 6, harga Rp1.250.000, `Private Pool`, dan `Wi-Fi`.

**Kriteria berhasil:** responden menemukan `prop_001` atau pilihan lain yang memenuhi seluruh kebutuhan dan dapat menjelaskan kesesuaiannya tanpa bantuan.

**Hal yang diamati:** kemampuan menemukan filter, pemahaman batas harga dan kapasitas minimum, penerapan beberapa fasilitas sekaligus, serta kesalahan dan pemulihan.

**Batas waktu:** 6 menit.

### TA-03 — Menemukan harga per malam paling murah

**Tujuan:** mengevaluasi pemahaman pengurutan harga dan kemampuan menemukan pilihan termurah.

**Kondisi awal:** seluruh pencarian dan filter dihapus; semua properti kembali terlihat.

**Instruksi untuk responden:**

> Anda ingin mengetahui pilihan dengan harga per malam paling murah. Temukan properti tersebut, lalu sebutkan nama dan harganya.

**Target moderator:** urutan `price_asc`; item pertama “Guesthouse Nyaman untuk Remote Work” (`prop_005`) dengan harga Rp430.000 per malam.

**Kriteria berhasil:** responden menyebut properti dengan harga per malam terendah beserta harga yang benar. Cara menemukannya dicatat oleh moderator.

**Hal yang diamati:** penemuan kontrol pengurutan, pemahaman label, dan keyakinan bahwa urutan hasil telah berubah.

**Batas waktu:** 3 menit.

### TA-04 — Mencari, menyimpan, dan kembali ke halaman daftar

**Tujuan:** mengevaluasi alur pencarian properti, penyimpanan ke wishlist, dan kembali ke halaman daftar dengan status simpanan yang konsisten.

**Kondisi awal:** halaman daftar berada pada kondisi default; `prop_006` belum tersimpan di wishlist.

**Instruksi untuk responden:**

> Anda akan bepergian ke Senggigi bersama sepuluh orang. Cari tempat menginap yang sesuai, simpan sebagai pilihan Anda, lalu kembali ke halaman daftar. Periksa apakah pilihan itu masih tersimpan.

**Target moderator:** “Villa Pantai Senggigi untuk Grup” (`prop_006`), yang memiliki kapasitas sepuluh tamu. Responden membuka detailnya, menyimpan properti, lalu kembali ke halaman daftar. Status wishlist pada kartu tetap aktif selama sesi frontend yang sama.

**Kriteria berhasil:** responden kembali ke halaman daftar dan dapat menunjukkan bahwa properti yang dicari masih tersimpan tanpa bantuan.

**Hal yang diamati:** strategi pencarian, penemuan kontrol simpan dan kembali, umpan balik status wishlist, serta konsistensi state antara detail dan daftar.

**Batas waktu:** 5 menit.

### TA-05 — Memuat pilihan tambahan

**Tujuan:** mengevaluasi penemuan dan pemahaman pola `load more` untuk melihat pilihan di luar daftar awal.

**Kondisi awal:** daftar default memiliki lebih banyak properti daripada `limit`; halaman kedua memuat pilihan yang belum tampak pada daftar awal.

**Instruksi untuk responden:**

> Pilihan pada daftar awal belum cocok bagi Anda. Lihat pilihan properti lain yang tersedia setelah daftar awal, lalu sebutkan satu properti yang menarik bagi Anda.

**Target moderator:** responden menemukan dan menggunakan `load more` tanpa bantuan; item lama tetap terlihat dan item halaman berikutnya ditambahkan.

**Kriteria berhasil:** responden melihat pilihan di luar daftar awal dan menyebutkan salah satunya. Kegagalan menemukan kontrol dicatat sebagai temuan.

**Hal yang diamati:** keterlihatan kontrol, pemahaman label, umpan balik pemuatan, posisi scroll, serta pemahaman bahwa hasil baru ditambahkan.

**Batas waktu:** 4 menit.

## 4. Pencatatan dan klasifikasi hasil Think Aloud

Untuk setiap tugas dan prototipe, moderator mengisi:

| Field | Nilai yang dicatat |
| --- | --- |
| ID responden, strata, dan framework | Kode sesi |
| Waktu mulai dan selesai | Timestamp; hitung *time on task* |
| Status tugas | S0 / S1 / F / A / X |
| Jumlah salah aksi | Bilangan bulat |
| Jumlah intervensi moderator | Bilangan bulat |
| Kutipan relevan | Transkripsi verbatim singkat dan timestamp |
| Perilaku/masalah | Tindakan, keraguan, kesalahan, pemulihan |
| Bagian antarmuka | Search, filter, sorting, listing, detail, wishlist, load more |
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
3. Setiap responden mengisi dua UEQ, masing-masing segera setelah mencoba satu prototipe; browser dan state direset sebelum beralih ke prototipe berikutnya.
4. Formulir diberi label netral “Prototipe A” atau “Prototipe B” sesuai prototipe yang baru digunakan. Pemetaan ke VueJS/Svelte disimpan terpisah.
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
- Karena responden yang sama menilai VueJS dan Svelte, ringkas enam skor skala untuk tiap prototipe dan selisih skor dalam pasangan responden. Laporkan mean selisih secara deskriptif tanpa uji signifikansi.
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
- Pertanyaan penyaringan: "Apakah Anda pernah menggunakan Airbnb, Traveloka, Agoda, tiket.com, atau layanan serupa untuk mencari atau membandingkan tempat menginap?" Hanya calon responden yang menjawab ya memenuhi kriteria pengalaman; pemesanan tidak diwajibkan.
- Kebutuhan aksesibilitas atau alat bantu yang digunakan selama sesi.

Nama lengkap, alamat, nomor telepon, dan informasi identitas langsung tidak diperlukan untuk analisis UX ini.

## 6. Urutan satu sesi penelitian

1. Persetujuan partisipasi dan perekaman.
2. Pengisian profil responden dan lembar konfigurasi perangkat.
3. Pembacaan naskah Think Aloud dan tugas latihan.
4. Prototipe pertama sesuai kelompok urutan: TA-01 sampai TA-05.
5. Pengisian UEQ untuk prototipe pertama sebelum diskusi.
6. Jeda singkat, reset konteks browser dan state, lalu TA-01 sampai TA-05 pada prototipe kedua.
7. Pengisian UEQ untuk prototipe kedua sebelum diskusi.
8. Wawancara penutup singkat dan verifikasi catatan, tanpa mengubah jawaban UEQ.

Sebelum setiap sesi, peneliti memverifikasi bahwa halaman kedua TA-05 tersedia pada kedua prototipe dengan urutan item yang sama. Jika prasyarat tersebut gagal akibat penyimpangan lingkungan, tugas dilewati pada kedua prototipe dan penyimpangan dicatat sebelum sesi, bukan diputuskan setelah melihat perilaku responden.

## 7. Sumber instrumen

- [Situs resmi User Experience Questionnaire](https://ueq-online.org/)
- [UEQ Handbook — Martin Schrepp](https://ueq-online.org/Material/Handbook.pdf)
- [Handasari, Wulandari, dan Haikal (2024), Evaluation of the Usability and User Experience of the Jaminan Kesehatan Nasional Mobile Application in Indonesia](https://doi.org/10.4258/hir.2024.30.4.324) — contoh penggunaan UEQ versi Indonesia dan pelaporan deskriptif enam skala.

Versi UEQ Indonesia dan alat analisis yang dipakai dalam pengambilan data harus diarsipkan bersama artefak penelitian agar urutan item, terjemahan, aturan skoring, dan benchmark dapat direproduksi.
