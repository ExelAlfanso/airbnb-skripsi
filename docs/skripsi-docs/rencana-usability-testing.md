# Rencana Usability Testing

## 1. Tujuan

Usability testing ini bertujuan membandingkan secara langsung efektivitas, efisiensi, dan kepuasan pengguna antara dua prototipe frontend, yaitu **Vue.js** dan **Svelte**, pada konteks penggunaan website responsif listing properti yang identik. Outcome disusun secara hierarkis:

- outcome utama *perceived usability*: skor System Usability Scale (SUS);
- metrik objektif utama usability: keberhasilan dan waktu penyelesaian tugas (*Task Completion Rate & Time*);
- pengukuran user experience pelengkap: enam skala User Experience Questionnaire (UEQ); dan
- data diagnostik: kesalahan (*error count*), bantuan moderator (*assistance count*), jumlah interaksi, dan penyimpangan dari urutan interaksi valid.

Analisis konfirmatori membandingkan Vue.js dan Svelte sesuai rumusan masalah dan hipotesis penelitian yang telah ditetapkan.

## 2. Desain Penelitian

Penelitian menggunakan desain *within-subject counterbalanced*. Setiap partisipan menguji kedua prototipe (Vue.js dan Svelte). Urutan framework dan set tugas diseimbangkan untuk mengurangi efek belajar (*carryover/learning effect*), kelelahan, dan perbedaan periode.

| Kelompok | Sesi pertama | Sesi kedua |
| --- | --- | --- |
| 1 | Vue + Set Tugas A | Svelte + Set Tugas B |
| 2 | Svelte + Set Tugas B | Vue + Set Tugas A |

Partisipan dialokasikan secara acak ke dalam dua kelompok tersebut dengan jumlah yang seimbang.

Identitas framework disamarkan (*blinded*). Kepada partisipan, aplikasi hanya disebut "Prototipe 1" dan "Prototipe 2". Label framework tidak ditampilkan pada instruksi maupun antarmuka partisipan. Pemetaan identitas disimpan pada lembar peneliti dan baru dijelaskan setelah seluruh sesi selesai.

## 3. Variabel Penelitian

### 3.1 Variabel bebas

Framework frontend:
- **Vue.js 3**
- **Svelte 5**

### 3.2 Variabel terikat

- Outcome utama: skor SUS.
- Metrik objektif utama: tingkat keberhasilan setiap tugas dan waktu penyelesaian tugas.
- Pengukuran UX pelengkap: skor enam skala UEQ (*Attractiveness*, *Perspicuity*, *Efficiency*, *Dependability*, *Stimulation*, dan *Novelty*).
- Data diagnostik: jumlah kesalahan, bantuan moderator, jumlah interaksi pengguna, dan penyimpangan dari urutan interaksi valid.

### 3.3 Variabel kontrol

- *Production build* aplikasi dengan commit yang dibekukan.
- Service backend ElysiaJS, endpoint, database Cloudflare D1, dan dataset katalog yang sama.
- URL aset dan gambar properti yang sama.
- Perangkat pengujian, browser, viewport ($390 \times 844$ piksel), dan orientasi yang sama.
- Kondisi jaringan dan kebijakan cache (*fresh browser context*).
- Kondisi awal filter, pagination, sorting, dan wishlist.
- Naskah instruksi, batas waktu tugas, dan aturan bantuan moderator.
- Lingkungan pengujian yang terkontrol.

## 4. Partisipan

### 4.1 Kriteria inklusi

- Pernah menggunakan website atau aplikasi pencarian akomodasi/properti (seperti Airbnb, Traveloka, Agoda, Booking.com, dsb.).
- Terbiasa menggunakan browser pada perangkat mobile / smartphone.
- Bersedia mengikuti dua sesi pengujian prototipe dalam satu rangkaian.
- Bersedia memberikan persetujuan penelitian (*informed consent*).

### 4.2 Kriteria eksklusi

- Terlibat langsung dalam pengembangan prototipe skripsi ini.
- Sudah mengetahui pemetaan Vue dan Svelte pada Prototipe 1/2.
- Tidak menyelesaikan kedua kondisi pengujian.
- Mengalami kendala teknis besar di tengah jalan yang membuat data tidak dapat dibandingkan secara valid.

### 4.3 Jumlah partisipan

Lakukan uji pilot kepada 6--10 partisipan untuk memvalidasi kejelasan instruksi, tingkat kesulitan tugas, batas waktu, dan instrumen kuesioner.

Jumlah partisipan utama ditentukan melalui *power analysis* untuk outcome utama skor SUS pada desain berpasangan (*paired t-test* dua arah dengan $\alpha = 0{,}05$, power $0{,}80$, dan estimasi effect size $d_z = 0{,}50$ memerlukan sekitar 34 partisipan lengkap). Rekrutmen dapat disiapkan sekitar 36--40 partisipan untuk mengantisipasi data tidak lengkap.

## 5. Instrumen dan Peralatan

- *Production build* prototipe Vue dan Svelte.
- Perangkat pengujian dan browser yang sama untuk seluruh sesi.
- Form screening dan demografi singkat.
- Lembar persetujuan (*informed consent*).
- Naskah moderator.
- Lembar tugas Set A dan Set B.
- Lembar observasi dan pencatatan metrik.
- Event log aplikasi dan rekaman sesi pengujian.
- Otomasi Playwright dan Google Chrome untuk pengujian laboratorium terpisah pada metrik INP.
- Kuesioner SUS 10 butir.
- Kuesioner UEQ resmi versi bahasa Indonesia.

## 6. Skenario Tugas

Tugas menggunakan dataset deterministik katalog properti. Setiap tugas memiliki kondisi awal independen yang di-reset oleh peneliti sebelum instruksi dibacakan dan sebelum pencatatan waktu dimulai.

### 6.1 Set Tugas A

| ID | Nama tugas | Deskripsi singkat |
| --- | --- | --- |
| A1 | Cari akomodasi di Canggu | Gunakan fitur pencarian untuk menampilkan akomodasi yang berada di Canggu. |
| A2 | Temukan Villa sesuai kebutuhan | Cari Villa di Canggu untuk minimal empat tamu yang memiliki Private Pool. |
| A3 | Pilih properti dengan rating tertinggi | Urutkan seluruh properti berdasarkan rating tertinggi, lalu pilih hasil teratas. |
| A4 | Temukan informasi properti | Pada halaman detail yang terbuka, temukan nama host dan jumlah kamar tidur. |
| A5 | Simpan properti ke wishlist | Tambahkan properti ke wishlist, kembali ke daftar, lalu pastikan status wishlist masih aktif. |

| ID | Kondisi awal | Instruksi kepada partisipan | Kondisi sukses |
| --- | --- | --- | --- |
| A1 | Daftar awal; search, filter, sorting, pagination, dan wishlist di-reset. | Cari akomodasi yang berada di Canggu. | Daftar hanya menampilkan hasil yang sesuai dengan Canggu. |
| A2 | Daftar awal dalam keadaan reset. | Cari Villa di Canggu untuk minimal empat tamu yang memiliki Private Pool. | `Villa Tropis dengan Kolam Renang` menjadi hasil yang dipilih atau ditampilkan sebagai hasil akhir. |
| A3 | Daftar awal dalam keadaan reset. | Urutkan seluruh properti berdasarkan rating tertinggi dan pilih hasil teratas. | Urutan `rating_desc` aktif dan `Kabin Kayu Tenang di Kaliurang` dipilih. |
| A4 | Peneliti telah membuka detail `Kabin Kayu Tenang di Kaliurang`; penyiapan ini tidak dihitung dalam waktu tugas. | Temukan nama host dan jumlah kamar tidur. | Partisipan menyebutkan `Ayu Lestari` dan `2 kamar tidur`. |
| A5 | Peneliti telah membuka detail `Kabin Kayu Tenang di Kaliurang` dengan status wishlist awal tidak aktif. | Tambahkan properti ke wishlist, kembali ke daftar, lalu pastikan status wishlist masih aktif. | Wishlist properti aktif pada detail dan daftar selama sesi. |

---

### 6.2 Set Tugas B

| ID | Nama tugas | Deskripsi singkat |
| --- | --- | --- |
| B1 | Cari akomodasi di Lembang | Gunakan fitur pencarian untuk menampilkan akomodasi yang berada di Lembang. |
| B2 | Temukan House sesuai kebutuhan | Cari House di Lembang untuk minimal empat tamu yang memiliki Free Parking. |
| B3 | Pilih properti dengan harga tertinggi | Urutkan seluruh properti berdasarkan harga tertinggi, lalu pilih hasil teratas. |
| B4 | Temukan informasi properti | Pada halaman detail yang terbuka, temukan nama host dan jumlah kamar tidur. |
| B5 | Simpan properti ke wishlist | Tambahkan properti ke wishlist, kembali ke daftar, lalu pastikan status wishlist masih aktif. |

| ID | Kondisi awal | Instruksi kepada partisipan | Kondisi sukses |
| --- | --- | --- | --- |
| B1 | Daftar awal; search, filter, sorting, pagination, dan wishlist di-reset. | Cari akomodasi yang berada di Lembang. | Daftar hanya menampilkan hasil yang sesuai dengan Lembang. |
| B2 | Daftar awal dalam keadaan reset. | Cari House di Lembang untuk minimal empat tamu yang memiliki Free Parking. | `Rumah Keluarga di Udara Sejuk Lembang` menjadi hasil yang dipilih atau ditampilkan sebagai hasil akhir. |
| B3 | Daftar awal dalam keadaan reset. | Urutkan seluruh properti berdasarkan harga tertinggi dan pilih hasil teratas. | Urutan `price_desc` aktif dan `Villa Pantai Senggigi untuk Grup` dipilih. |
| B4 | Peneliti telah membuka detail `Villa Pantai Senggigi untuk Grup`; penyiapan ini tidak dihitung dalam waktu tugas. | Temukan nama host dan jumlah kamar tidur. | Partisipan menyebutkan `Raka Wibowo` dan `4 kamar tidur`. |
| B5 | Peneliti telah membuka detail `Villa Pantai Senggigi untuk Grup` dengan status wishlist awal tidak aktif. | Tambahkan properti ke wishlist, kembali ke daftar, lalu pastikan status wishlist masih aktif. | Wishlist properti aktif pada detail dan daftar selama sesi. |

---

### 6.3 Aturan Independensi Tugas

Sebelum setiap tugas, peneliti mengembalikan aplikasi ke kondisi awal yang ditentukan. Kegagalan pada satu tugas tidak boleh mempengaruhi kondisi awal tugas berikutnya. Timer pencatatan waktu dimulai setelah moderator selesai membacakan instruksi dan partisipan mulai berinteraksi dengan layar.

## 7. Definisi Operasional

### 7.1 Keberhasilan tugas (*Task Success*)

- `success`: kondisi akhir benar, selesai sebelum batas waktu, dan tanpa bantuan substantif moderator (skor biner = 1).
- `assisted`: kondisi akhir benar namun membutuhkan bantuan langsung moderator (skor biner = 0).
- `failed`: kondisi akhir salah, partisipan menyerah, atau batas waktu terlewati (skor biner = 0).

### 7.2 Waktu penyelesaian (*Completion Time*)

Waktu dihitung sejak partisipan mulai menyentuh/mengoperasikan antarmuka hingga kondisi sukses tercapai atau tugas dihentikan. Batas waktu maksimal per tugas adalah 2--3 menit.

### 7.3 Kesalahan (*Error Count*)

Tindakan pengguna yang menyimpang dari alur penyelesaian tugas yang valid atau menghasilkan keadaan akhir yang keliru dan membutuhkan koreksi.

### 7.4 Bantuan moderator (*Assistance Count*)

Jumlah intervensi moderator ketika partisipan mengalami hambatan berat atau kebuntuan lebih dari ambang batas hening yang ditentukan.

## 8. Prosedur Pengujian

### 8.1 Alur Sesi Pengujian

| Tahap | Aktivitas | Perkiraan Waktu |
| --- | --- | ---: |
| 1 | Penjelasan maksud penelitian, etika, dan pengisian *informed consent* | 5 menit |
| 2 | Kuesioner demografi dan riwayat penggunaan aplikasi mobile | 3 menit |
| 3 | Pengujian Prototipe Pertama (5 tugas) | 10--12 menit |
| 4 | Pengisian Kuesioner SUS dan UEQ untuk Prototipe Pertama | 5--8 menit |
| 5 | Jeda istirahat singkat dan persiapan reset prototipe kedua | 3 menit |
| 6 | Pengujian Prototipe Kedua (5 tugas) | 10--12 menit |
| 7 | Pengisian Kuesioner SUS dan UEQ untuk Prototipe Kedua | 5--8 menit |
| 8 | Wawancara retrospektif singkat dan penutupan | 5 menit |

Total durasi satu sesi per partisipan berkisar antara 45--55 menit.

## 9. Data yang Dicatat

### 9.1 Data Tugas
- `participant_id`
- `sequence_group` (Kelompok 1 / Kelompok 2)
- `framework` (Vue / Svelte)
- `task_set` (Set A / Set B)
- `task_id` (1--5)
- `duration_ms`
- `result` (`success` / `assisted` / `failed`)
- `error_count`
- `assistance_count`

### 9.2 Data Kuesioner
- Respons SUS butir 1 sampai 10 dan skor akhir SUS (0--100).
- Respons UEQ 26 butir dan skor rata-rata pada 6 skala UEQ.

## 10. Pengujian Laboratorium Terpisah: INP (*Interaction to Next Paint*)

Pengukuran INP dilakukan secara terpisah dari sesi pengujian partisipan manusia melalui pengujian laboratorium otomatis (*automated scripted testing*):

- **Alat Uji:** Playwright Automation sebagai penggerak interaksi (*interaction driver*) dan browser Google Chrome dengan *Event Timing API*.
- **Skenario Interaksi Otomatis:**
  1. *Search*: Membuka modal pencarian dan mengetik kata kunci lokasi.
  2. *Advanced Filter*: Membuka modal filter, memilih kombinasi parameter tipe/tamu/fasilitas, dan menerapkan filter.
  3. *Wishlist Toggle*: Melakukan toggle simpan/hapus wishlist pada kartu properti.
- **Kondisi Lingkungan:** Viewport $390 \times 844$, CPU throttling $4\times$, *fresh context* di setiap run, diulang $n$ kali untuk menghitung median dan rentang antarkuartil (IQR).

Hasil ini merupakan metrik performa responsivitas interaksi teknis pada level komputasi browser, yang melengkapi data waktu penyelesaian tugas dari partisipan manusia.

## 11. Rencana Analisis Statistik

Karena setiap partisipan mencoba kedua prototipe (*within-subject*), analisis dilakukan secara komparatif berpasangan (*paired comparison*):

| Outcome / Variabel | Analisis Statistik Utama | Uji Alternatif (Non-parametrik) |
| :--- | :--- | :--- |
| **Skor SUS** | *Paired t-test* (jika selisih terdistribusi normal) | *Wilcoxon signed-rank test* |
| **Waktu Tugas (*Completion Time*)** | *Paired t-test* pada pasangan tugas sukses | *Wilcoxon signed-rank test* |
| **Tingkat Keberhasilan (*Success Rate*)** | *McNemar's test* (data proporsi berpasangan biner) | -- |
| **Skala UEQ (6 Skala)** | *Paired t-test* per skala dengan koreksi Holm | *Wilcoxon signed-rank test* |
| **Error & Assistance Count** | Statistik deskriptif (Median, IQR, Mean, SD) | *Wilcoxon signed-rank test* |

## 12. Checklist Kesiapan Pengujian

- [ ] *Production build* Vue dan Svelte telah dibekukan.
- [ ] Kesetaraan fungsional (Search, Filter, Sort, Wishlist, Detail, Load More) telah diverifikasi via unit & E2E tests.
- [ ] Set Tugas A dan Set Tugas B telah divalidasi melalui uji pilot.
- [ ] Perangkat pengujian mobile/browser telah dikonfigurasi.
- [ ] Instrumen kuesioner SUS dan UEQ resmi bahasa Indonesia telah disiapkan.
- [ ] Prosedur reset database/cache telah teruji.
