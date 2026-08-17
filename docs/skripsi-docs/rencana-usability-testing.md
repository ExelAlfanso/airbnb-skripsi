# Rencana Usability Testing

## 1. Tujuan

Usability testing ini mempertahankan perbandingan utama prototipe frontend Vue.js dan Svelte pada konteks penggunaan yang sama, serta menambahkan prototipe React sebagai kondisi pembanding eksploratif (Prototipe C). Outcome disusun secara hierarkis agar analisis tetap terarah:

- outcome utama *perceived usability*: skor System Usability Scale (SUS);
- metrik objektif utama usability: keberhasilan dan waktu penyelesaian tugas;
- pengukuran user experience pelengkap: enam skala User Experience Questionnaire (UEQ); dan
- data diagnostik: kesalahan, bantuan moderator, jumlah interaksi, dan penyimpangan dari urutan interaksi valid.

Analisis konfirmatori tetap membandingkan Vue.js dan Svelte sesuai proposal serta pertanyaan penelitian yang telah ditetapkan. Hasil React dilaporkan sebagai analisis eksploratif pada konfigurasi, dataset, partisipan, dan skenario yang sama; React tidak dimasukkan ke klaim utama atau perhitungan power konfirmatori kecuali proposal, hipotesis, dan rencana analisis formal telah diamendemen sebelum pengumpulan data utama. Kesimpulan tidak boleh digeneralisasi menjadi klaim bahwa salah satu framework secara inheren lebih usable pada semua aplikasi.

## 2. Desain Penelitian

Penelitian menggunakan desain *within-subject counterbalanced*. Setiap partisipan menguji ketiga prototipe. Urutan framework dan set tugas diseimbangkan untuk mengurangi efek belajar, kelelahan, perbedaan periode, dan perbedaan tingkat kesulitan tugas.

| Kelompok | Sesi pertama | Sesi kedua | Sesi ketiga |
| --- | --- | --- | --- |
| 1 | Vue + Set Tugas A | Svelte + Set Tugas B | React + Set Tugas C |
| 2 | Vue + Set Tugas A | React + Set Tugas C | Svelte + Set Tugas B |
| 3 | Svelte + Set Tugas C | Vue + Set Tugas B | React + Set Tugas A |
| 4 | Svelte + Set Tugas C | React + Set Tugas A | Vue + Set Tugas B |
| 5 | React + Set Tugas B | Vue + Set Tugas C | Svelte + Set Tugas A |
| 6 | React + Set Tugas B | Svelte + Set Tugas A | Vue + Set Tugas C |

Enam urutan tersebut memuat seluruh kemungkinan urutan framework. Pada satu blok enam partisipan, setiap framework muncul dua kali pada setiap periode dan menerima setiap set tugas dua kali; setiap set tugas juga muncul dua kali pada setiap periode. Partisipan dialokasikan secara acak dalam blok enam. Jika jumlah partisipan tidak habis dibagi enam, selisih ukuran kelompok maksimal satu partisipan dan ketidakseimbangan akhir dilaporkan.

Identitas framework disamarkan. Kepada partisipan, aplikasi hanya disebut "Prototipe 1", "Prototipe 2", dan "Prototipe 3". Label deployment PrototypeA, PrototypeB, dan PrototypeC maupun nama framework tidak ditampilkan pada instruksi partisipan. Pemetaan identitas disimpan pada lembar peneliti dan baru dijelaskan setelah seluruh sesi selesai.

## 3. Variabel Penelitian

### 3.1 Variabel bebas

Framework frontend:

- Vue.js dan Svelte sebagai kondisi perbandingan utama; serta
- React sebagai kondisi pembanding eksploratif.

### 3.2 Variabel terikat

- Outcome utama: skor SUS.
- Metrik objektif utama: keberhasilan setiap tugas dan waktu penyelesaian tugas.
- Pengukuran UX pelengkap: skor enam skala UEQ, yaitu attractiveness, perspicuity, efficiency, dependability, stimulation, dan novelty.
- Data diagnostik: jumlah kesalahan, bantuan moderator, jumlah interaksi pengguna, dan penyimpangan dari urutan interaksi valid.

### 3.3 Variabel kontrol

- Production build dan commit aplikasi.
- Backend, endpoint, database, dan dataset.
- URL dan aset gambar.
- Perangkat, browser, viewport, dan orientasi.
- Kondisi jaringan dan kebijakan cache.
- Kondisi awal filter, pagination, dan wishlist.
- Instruksi, batas waktu, dan aturan bantuan.
- Tempat pengujian dan gangguan lingkungan.

## 4. Partisipan

### 4.1 Kriteria inklusi

- Pernah menggunakan website atau aplikasi pencarian akomodasi/properti.
- Terbiasa menggunakan browser pada perangkat mobile.
- Bersedia mengikuti tiga sesi prototipe dalam satu rangkaian pengujian.
- Bersedia memberikan persetujuan penelitian dan, jika digunakan, persetujuan rekaman layar atau audio.

### 4.2 Kriteria eksklusi

- Terlibat langsung dalam pengembangan prototipe.
- Sudah mengetahui pemetaan Vue, Svelte, dan React pada Prototipe 1/2/3.
- Tidak menyelesaikan ketiga kondisi pengujian.
- Mengalami gangguan teknis besar yang membuat data ketiga kondisi tidak dapat dibandingkan.

### 4.3 Jumlah partisipan

Lakukan uji pilot kepada sekitar 6-10 partisipan untuk menguji kejelasan instruksi, tingkat kesulitan tugas, batas waktu, instrumen, dan pencatatan data. Data pilot tidak digabungkan dengan data utama jika protokol berubah setelah pilot.

Jumlah partisipan utama tetap ditentukan melalui *power analysis* untuk outcome utama konfirmatori Vue-Svelte yang ditetapkan sebelum pengumpulan data, misalnya selisih skor SUS. Sebagai ilustrasi, *paired t-test* dua arah dengan alpha 0,05, power 0,80, dan perkiraan efek sedang `dz = 0,5` memerlukan sekitar 34 partisipan lengkap. Rekrutmen dapat ditambah sekitar 10-15% untuk mengantisipasi data tidak lengkap. Nilai final harus dihitung ulang menggunakan estimasi variasi selisih dari pilot atau *smallest effect size of interest* yang disepakati. Analisis React bersifat eksploratif dan tidak boleh disebut memiliki power konfirmatori tanpa perhitungan baru untuk desain tiga kondisi.

## 5. Instrumen dan Peralatan

- Production build prototipe Vue, Svelte, dan React.
- Perangkat dan browser yang sama untuk seluruh kondisi.
- Form screening dan demografi singkat.
- Lembar informed consent.
- Naskah moderator.
- Lembar tugas Set A, Set B, dan Set C.
- Lembar observasi.
- Event log aplikasi dan rekaman sesi.
- Playwright dan Chrome untuk pengukuran INP sesi terkontrol.
- Kuesioner SUS 10 butir.
- Kuesioner UEQ versi bahasa Indonesia resmi.
- Maze atau platform sejenis untuk instruksi, survei, dan rekaman jika diperlukan.

Maze tidak menjadi satu-satunya sumber penentuan keberhasilan karena perubahan filter, sorting, dan wishlist pada single-page application tidak selalu menghasilkan perpindahan URL. Keadaan akhir aplikasi, event log, lembar observasi, dan rekaman sesi digunakan untuk verifikasi.

## 6. Skenario Tugas

Tugas menggunakan dataset deterministik pada `packages/db/seeds/catalog.sql`. Redaksi berikut merupakan rancangan awal dan harus divalidasi melalui pilot. Setiap tugas memiliki kondisi awal independen yang disiapkan peneliti sebelum instruksi dibacakan dan sebelum pencatatan waktu dimulai.

### 6.1 Set Tugas A

Nama dan deskripsi berikut digunakan sebagai konten *task* pada Website Test di Maze.

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

### 6.2 Set Tugas B

Nama dan deskripsi berikut digunakan sebagai konten *task* pada Website Test di Maze.

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

### 6.3 Set Tugas C

Nama dan deskripsi berikut digunakan sebagai konten *task* pada Website Test di Maze.

| ID | Nama tugas | Deskripsi singkat |
| --- | --- | --- |
| C1 | Cari akomodasi di Senggigi | Gunakan fitur pencarian untuk menampilkan akomodasi yang berada di Senggigi. |
| C2 | Temukan Villa sesuai kebutuhan | Cari Villa di Senggigi untuk minimal enam tamu yang memiliki Kitchen. |
| C3 | Pilih properti dengan harga terendah | Urutkan seluruh properti berdasarkan harga terendah, lalu pilih hasil teratas. |
| C4 | Temukan informasi properti | Pada halaman detail yang terbuka, temukan nama host dan jumlah kamar tidur. |
| C5 | Simpan properti ke wishlist | Tambahkan properti ke wishlist, kembali ke daftar, lalu pastikan status wishlist masih aktif. |

| ID | Kondisi awal | Instruksi kepada partisipan | Kondisi sukses |
| --- | --- | --- | --- |
| C1 | Daftar awal; search, filter, sorting, pagination, dan wishlist di-reset. | Cari akomodasi yang berada di Senggigi. | Daftar hanya menampilkan hasil yang sesuai dengan Senggigi. |
| C2 | Daftar awal dalam keadaan reset. | Cari Villa di Senggigi untuk minimal enam tamu yang memiliki Kitchen. | `Villa Pantai Senggigi untuk Grup` menjadi hasil yang dipilih atau ditampilkan sebagai hasil akhir. |
| C3 | Daftar awal dalam keadaan reset. | Urutkan seluruh properti berdasarkan harga terendah dan pilih hasil teratas. | Urutan `price_asc` aktif dan `Guesthouse Nyaman untuk Remote Work` dipilih. |
| C4 | Peneliti telah membuka detail `Guesthouse Nyaman untuk Remote Work`; penyiapan ini tidak dihitung dalam waktu tugas. | Temukan nama host dan jumlah kamar tidur. | Partisipan menyebutkan `Made Pratama` dan `1 kamar tidur`. |
| C5 | Peneliti telah membuka detail `Guesthouse Nyaman untuk Remote Work` dengan status wishlist awal tidak aktif. | Tambahkan properti ke wishlist, kembali ke daftar, lalu pastikan status wishlist masih aktif. | Wishlist properti aktif pada detail dan daftar selama sesi. |

### 6.4 Aturan independensi dan alternatif end-to-end

Sebelum setiap tugas, peneliti mengembalikan aplikasi ke kondisi awal yang tertulis pada tabel. Kegagalan pada satu tugas tidak boleh menentukan halaman awal, data, atau status pada tugas berikutnya. Timer baru dimulai setelah kondisi awal siap dan moderator selesai membacakan instruksi.

Jika tujuan penelitian berubah menjadi pengujian alur *end-to-end*, rangkaian search-filter-sort-detail-wishlist boleh dijadikan satu skenario. Dalam kasus tersebut, rangkaian dinilai menggunakan satu waktu, satu kondisi sukses, dan satu hasil skenario; tahap-tahapnya tidak dianalisis sebagai tugas independen.

### 6.5 Tugas load more opsional

Jika perilaku *load more* harus diukur secara eksplisit, tambahkan satu tugas setara pada ketiga set dengan kondisi awal daftar yang telah di-reset. Contoh:

- Set A: muat hasil berikutnya sampai `Guesthouse Nyaman untuk Remote Work` terlihat.
- Set B: muat hasil berikutnya sampai `Apartemen Modern Dekat Pantai` terlihat.
- Set C: muat hasil berikutnya sampai `Rumah Keluarga di Udara Sejuk Lembang` terlihat.

Tugas ini hanya dipakai jika pilot membuktikan ketiga target selalu berada setelah halaman awal pada konfigurasi production build yang dibekukan.

## 7. Definisi Operasional

### 7.1 Keberhasilan tugas

- `success`: kondisi akhir benar, selesai sebelum batas waktu, dan tanpa bantuan moderator.
- `assisted`: kondisi akhir benar setelah bantuan moderator.
- `failed`: kondisi akhir salah, partisipan menyerah, atau batas waktu terlewati.

Untuk analisis keberhasilan biner, `success` diberi nilai 1, sedangkan `assisted` dan `failed` diberi nilai 0. Kategori asli tetap disimpan agar kebutuhan bantuan dapat dilaporkan terpisah.

### 7.2 Waktu penyelesaian

Waktu dimulai setelah moderator selesai membacakan tugas dan partisipan mulai berinteraksi. Waktu berhenti ketika kondisi sukses tercapai, partisipan menyerah, atau batas waktu terlewati.

Batas waktu awal yang disarankan adalah 2-3 menit per tugas dan harus ditetapkan setelah pilot. Batas yang sama digunakan untuk tugas ekuivalen pada Set A, Set B, dan Set C.

### 7.3 Kesalahan

Kesalahan adalah tindakan yang membawa aplikasi menjauh dari kondisi sukses, menghasilkan keadaan akhir yang salah, atau mengharuskan koreksi. Eksplorasi yang masih relevan tidak otomatis dianggap kesalahan. Definisi dan contoh kesalahan untuk setiap tugas dibuat sebelum pengumpulan data utama.

### 7.4 Bantuan moderator

Moderator tidak langsung membantu ketika partisipan ragu. Setelah ambang diam yang ditentukan pada pilot, moderator boleh memberikan satu prompt netral, misalnya: "Silakan lanjutkan dengan cara yang menurut Anda paling tepat." Bantuan yang menunjukkan lokasi kontrol atau langkah penyelesaian dicatat sebagai bantuan substantif dan membuat tugas masuk kategori `assisted`.

### 7.5 Urutan interaksi valid dan penyimpangan

Jumlah interaksi dan penyimpangan jalur merupakan data diagnostik, bukan outcome utama. Sebelum penelitian utama, peneliti mendefinisikan satu atau lebih *minimum valid interaction sequence* untuk setiap tugas berdasarkan production build yang telah dibekukan. Jalur alternatif yang mencapai kondisi sukses dengan efisiensi setara tidak boleh dianggap salah.

Penyimpangan dihitung terhadap urutan valid terpendek yang sesuai:

```text
path_deviation = actual_interactions - shortest_valid_interactions
```

Daftar urutan valid dibekukan sebelum pengumpulan data utama. Nilai negatif menandakan urutan referensi belum lengkap atau instrumentasi perlu diperiksa; nilai tersebut tidak langsung ditafsirkan sebagai perilaku pengguna yang lebih efisien.

## 8. Prosedur Pengujian

### 8.1 Sebelum sesi

1. Bekukan commit, production build, dataset, dan konfigurasi eksperimen.
2. Pastikan ketiga frontend lolos validasi kesetaraan fungsi dan visual.
3. Siapkan urutan kelompok partisipan.
4. Reset browser, filter, pagination, dan wishlist sesuai kondisi awal.
5. Periksa event log dan rekaman tanpa membuka data pribadi yang tidak diperlukan.

### 8.2 Alur sesi

| Tahap | Perkiraan waktu |
| --- | ---: |
| Penjelasan penelitian dan informed consent | 5 menit |
| Screening/demografi dan pengalaman sebelumnya | 3 menit |
| Penjelasan aturan pengujian | 2 menit |
| Tugas pada versi pertama | 10-15 menit |
| SUS dan UEQ versi pertama | 7-10 menit |
| Istirahat singkat dan reset kondisi | 3 menit |
| Tugas pada versi kedua | 10-15 menit |
| SUS dan UEQ versi kedua | 7-10 menit |
| Istirahat singkat dan reset kondisi | 3 menit |
| Tugas pada versi ketiga | 10-15 menit |
| SUS dan UEQ versi ketiga | 7-10 menit |
| Pertanyaan perbandingan dan penutup | 5 menit |

SUS dan UEQ diisi setelah setiap versi, sehingga setiap partisipan menghasilkan satu set nilai untuk Vue, Svelte, dan React. Durasi total serta tanda kelelahan diperiksa pada pilot; sesi boleh dibagi menjadi dua kunjungan dengan interval yang dibakukan jika satu rangkaian terlalu membebani partisipan.

Jangan menggunakan *concurrent think-aloud* jika waktu penyelesaian menjadi outcome utama karena aktivitas berbicara dapat mengubah waktu dan strategi. Pertanyaan retrospektif dilakukan setelah satu kondisi selesai.

### 8.3 Naskah pembuka moderator

> Penelitian ini menguji tiga versi prototipe pencarian akomodasi, bukan menguji kemampuan Anda. Tidak ada jawaban yang memengaruhi penilaian pribadi. Silakan selesaikan setiap tugas dengan cara yang menurut Anda paling tepat. Saya tidak dapat langsung memberi petunjuk mengenai letak fitur, tetapi saya dapat mengulang instruksi. Anda dapat berhenti kapan saja.

### 8.4 Pertanyaan retrospektif

Setelah setiap versi:

1. Bagian mana yang paling mudah digunakan?
2. Bagian mana yang paling membingungkan atau lambat menurut Anda?
3. Apakah ada hasil tindakan yang tidak sesuai dengan perkiraan Anda?

Setelah ketiga versi:

1. Versi mana yang lebih mudah digunakan dan mengapa?
2. Apakah Anda merasakan perbedaan respons atau kecepatan?
3. Jika harus menggunakan salah satu versi lagi, versi mana yang dipilih?

Jawaban kualitatif digunakan untuk menjelaskan hasil kuantitatif dan tidak menggantikan SUS, UEQ, atau metrik tugas.

## 9. Data yang Dicatat

### 9.1 Struktur data tugas

```text
participant_id
sequence_group
framework
participant_facing_version
framework_order
period
task_set
task_id
started_at
completed_at
duration_ms
result
success_binary
assistance_count
error_count
interaction_count
shortest_valid_interaction_count
path_deviation
pilot_subjective_difficulty
notes
```

### 9.2 Event aplikasi minimum

```text
session_started
task_started
search_submitted
filter_applied
sort_changed
load_more_clicked
property_opened
wishlist_toggled
task_completed
```

Nama event, payload, dan waktu pencatatan harus sama pada Vue, Svelte, dan React. Instrumentasi tidak boleh mengubah perilaku atau memberi beban yang berbeda secara material pada salah satu dari ketiga frontend.

### 9.3 Struktur data kuesioner

```text
participant_id
framework
sus_item_1 ... sus_item_10
sus_score
ueq_item_1 ... ueq_item_26
ueq_attractiveness
ueq_perspicuity
ueq_efficiency
ueq_dependability
ueq_stimulation
ueq_novelty
```

## 10. Perhitungan Metrik

### 10.1 Outcome utama perceived usability

Skor SUS menjadi outcome utama evaluasi pengguna. Setiap partisipan menghasilkan satu skor SUS setelah kondisi Vue, satu setelah kondisi Svelte, dan satu setelah kondisi React. Kontras Vue-Svelte tetap menjadi outcome konfirmatori; skor React dilaporkan sebagai pembanding eksploratif.

### 10.2 Metrik objektif utama usability

Efektivitas dihitung sebagai:

```text
task_completion_rate = successful_tasks / attempted_tasks * 100%
```

Efisiensi utama diukur dengan waktu penyelesaian tugas. Laporkan tingkat keberhasilan dan distribusi waktu per tugas serta agregat per framework. Kategori `assisted` dilaporkan terpisah agar kebutuhan bantuan tidak hilang dalam agregasi.

Analisis waktu konfirmatori menggunakan pasangan tugas yang sukses tanpa bantuan pada kondisi Vue dan Svelte. Kondisi React diringkas dengan aturan yang sama dan dibandingkan secara eksploratif. Analisis sensitivitas dengan penalti batas waktu untuk tugas gagal hanya dilakukan jika aturannya telah ditetapkan sebelum hasil utama dilihat.

Kesalahan, bantuan, jumlah interaksi, dan penyimpangan dari urutan interaksi valid dilaporkan sebagai data diagnostik sekunder. Data tersebut digunakan untuk menjelaskan pola hasil, bukan untuk menambah klaim utama baru.

### 10.3 Skor SUS

Untuk respons 1-5:

- item ganjil: `response - 1`;
- item genap: `5 - response`;
- jumlahkan seluruh kontribusi; lalu
- kalikan jumlah tersebut dengan `2.5`.

Skor SUS berada pada rentang 0-100, tetapi bukan persentase keberhasilan. Gunakan seluruh 10 butir dalam urutan yang ditetapkan instrumen.

### 10.4 Skor UEQ

Gunakan kuesioner bahasa Indonesia dan alat analisis resmi UEQ. Jangan mengubah urutan butir, polaritas pasangan kata, transformasi nilai, atau komposisi enam skala tanpa justifikasi metodologis.

### 10.5 Pengukuran INP sesi terkontrol dengan Playwright

Pengukuran otomatis Playwright melengkapi, tetapi tidak menggantikan, waktu penyelesaian tugas partisipan. Pengukuran ini hanya membandingkan dua kondisi eksperimen utama, yaitu production build Vue dan Svelte; React tetap berada di luar kesimpulan performa konfirmatori Vue-Svelte.

Tiga skenario interaksi dijalankan pada kedua frontend:

1. mengirim pencarian `Canggu`;
2. memilih amenitas Kitchen pada filter Villa di Senggigi untuk minimal enam tamu, lalu memverifikasi hasil filter; dan
3. mengaktifkan wishlist pada `Villa Tropis dengan Kolam Renang`.

Setiap skenario dijalankan tiga kali per framework. Setiap observasi menggunakan context browser baru dengan viewport `390 x 844`, Chrome yang sama, throttling CPU `4x`, API dan dataset deterministik yang sama, serta cache browser dingin. Urutan framework diselang-seling `Vue-Svelte`, `Svelte-Vue`, lalu `Vue-Svelte`; karena jumlah pengulangan ganjil, framework yang muncul pertama tidak dapat seimbang sempurna. Urutan skenario dirotasi pada setiap pengulangan agar setiap skenario menempati posisi pertama, kedua, dan ketiga satu kali.

Sebelum interaksi target, Playwright memasang `PerformanceObserver` untuk entri Event Timing bertipe `event`. Durasi event dikelompokkan berdasarkan `interactionId`, kemudian nilai terlama pada interaksi target dicatat sebagai INP sesi terkontrol. Ambang pelaporan Event Timing ditetapkan `16 ms`; jika browser tidak menghasilkan entri, hasil disimpan sebagai `<16 ms` dan nilai batas atas konservatif `16 ms` digunakan pada ringkasan numerik. Untuk setiap kombinasi framework-skenario, laporkan ketiga nilai mentah, median, kuartil pertama, kuartil ketiga, dan rentang antarkuartil.

Hasil ini merupakan pengukuran interaksi terskrip pada kondisi laboratorium, bukan INP lapangan populasi. Nilainya tidak digabungkan dengan durasi tugas partisipan dan tidak boleh disebut data CrUX atau RUM. Berkas hasil mentah disimpan dari `artifacts/inp/results.json` bersama commit, versi browser, dan konfigurasi eksperimen yang digunakan.

## 11. Rencana Analisis Statistik

Data memiliki pengukuran berulang karena setiap partisipan menggunakan ketiga framework. Analisis konfirmatori tetap menggunakan kontras berpasangan Vue-Svelte sesuai proposal; analisis yang melibatkan React dilabeli eksploratif. Hierarki outcome dan analisis ditetapkan sebelum data utama diperiksa.

| Outcome | Kedudukan | Analisis utama Vue-Svelte | Effect size yang dilaporkan |
| --- | --- | --- | --- |
| Skor SUS | Outcome utama *perceived usability* | *Paired t-test* jika distribusi selisih cukup normal; jika tidak, Wilcoxon signed-rank | Cohen's `dz` atau rank-biserial correlation |
| Keberhasilan biner | Metrik objektif utama usability | McNemar test | Selisih proporsi berpasangan dan interval kepercayaan |
| Waktu tugas | Metrik objektif utama usability | *Paired t-test* atau Wilcoxon pada pasangan valid | Cohen's `dz` atau rank-biserial correlation |
| Enam skala UEQ | Pengukuran UX pelengkap | *Paired t-test* atau Wilcoxon per skala dengan koreksi Holm | Effect size per skala |
| Kesalahan, bantuan, interaksi, dan penyimpangan | Data diagnostik | Ringkasan deskriptif; uji inferensial hanya sebagai eksplorasi yang dilabeli jelas | Effect size eksploratif jika dihitung |

Normalitas analisis utama diperiksa pada distribusi selisih `Vue - Svelte`, bukan pada masing-masing framework secara terpisah. Semua hasil utama dilaporkan dengan interval kepercayaan 95%, effect size, nilai pusat, dan ukuran variasi, bukan hanya *p-value*.

React dilaporkan secara deskriptif dengan aturan metrik yang sama. Jika perbandingan React-Vue dan React-Svelte diuji, keduanya diperlakukan sebagai perbandingan berpasangan eksploratif dan *p-value* dikoreksi menggunakan Holm dalam satu keluarga outcome. Hasil tersebut tidak mengubah kesimpulan utama Vue-Svelte tanpa amendemen protokol dan power analysis baru.

Pengaruh framework, set tugas, periode, dan urutan framework diperiksa sejak awal sebagai analisis terencana:

1. laporkan outcome menurut kombinasi framework dan Set A/Set B/Set C;
2. laporkan outcome pada periode pertama, kedua, dan ketiga untuk memeriksa efek belajar atau kelelahan;
3. laporkan outcome menurut enam sequence group;
4. periksa apakah arah selisih Vue-Svelte konsisten pada sequence group yang relevan; dan
5. laporkan hasil React secara eksploratif tanpa mencampurkannya ke estimasi konfirmatori Vue-Svelte.

Analisis berpasangan Vue-Svelte tetap menjadi analisis utama jika pilot menunjukkan Set A, Set B, dan Set C ekuivalen. Jika ukuran sampel memadai dan disetujui dalam rencana analisis, lakukan analisis sensitivitas eksploratif menggunakan model efek campuran yang memasukkan framework, task set, period, dan framework order sebagai efek tetap serta participant sebagai efek acak. Model ini bersifat pelengkap dan tidak wajib untuk kesimpulan tingkat S1.

Outcome utama, batas kesetaraan pilot, aturan eksklusi, penanganan data gagal, dan metode statistik dibekukan sebelum data utama dianalisis.

## 12. Etika dan Privasi

- Berikan penjelasan tujuan, prosedur, durasi, risiko, dan hak untuk berhenti.
- Minta persetujuan terpisah untuk rekaman layar, suara, atau wajah.
- Gunakan `participant_id`; jangan simpan nama pada dataset analisis.
- Hindari pencatatan kata sandi, notifikasi, atau informasi pribadi dari perangkat partisipan.
- Batasi akses rekaman dan tetapkan jadwal penghapusan.
- Pisahkan dokumen persetujuan dari dataset penelitian.
- Jelaskan bahwa hasil dilaporkan secara agregat atau menggunakan kutipan anonim.

## 13. Kriteria Kelulusan Pilot

Protokol siap digunakan pada penelitian utama jika:

- seluruh tugas dapat diselesaikan pada ketiga frontend;
- kesetaraan Set Tugas A, Set Tugas B, dan Set Tugas C telah diperiksa menggunakan median waktu penyelesaian, tingkat keberhasilan, jumlah kesalahan, dan kesulitan subjektif skala 1-5;
- batas penerimaan kesetaraan telah ditentukan sebelum pilot. Batas awal yang dapat digunakan adalah selisih tingkat keberhasilan maksimal 15 poin persentase, rasio median waktu 0,80-1,25, selisih median kesalahan maksimal 1, dan selisih median kesulitan maksimal 1 poin;
- tugas direvisi dan dipilotkan ulang jika salah satu perbandingan set melewati batas atau menunjukkan perbedaan kualitatif yang jelas;
- tidak ada instruksi yang secara tidak sengaja menyebut lokasi tombol;
- batas waktu tidak terlalu pendek atau terlalu panjang;
- event log, rekaman, dan lembar observasi menghasilkan waktu serta hasil yang konsisten;
- SUS dan UEQ dapat diisi setelah setiap kondisi tanpa kebingungan;
- reset filter, pagination, cache, dan wishlist bekerja konsisten; dan
- durasi tiga kondisi masih dapat diterima partisipan tanpa tanda kelelahan yang mengganggu hasil.

Setiap perubahan setelah pilot dicatat dalam log revisi protokol.

## 14. Checklist Sebelum Pengumpulan Data Utama

- [ ] Outcome utama dan status eksploratif React telah ditentukan.
- [ ] Power analysis dan target rekrutmen untuk kontras utama Vue-Svelte telah disetujui.
- [ ] Commit dan production build telah dibekukan.
- [ ] Kesetaraan fungsi, visual, data, dan instrumentasi Vue, Svelte, dan React telah diverifikasi.
- [ ] Set Tugas A, Set Tugas B, dan Set Tugas C telah lulus pilot.
- [ ] Enam urutan counterbalancing telah disiapkan dan alokasi blok telah ditetapkan.
- [ ] Kondisi sukses, urutan interaksi valid, kesalahan, bantuan, dan batas waktu telah dibakukan.
- [ ] Batas kesetaraan pilot untuk waktu, keberhasilan, kesalahan, dan kesulitan subjektif telah dibekukan.
- [ ] Analisis task set, period, framework order, dan sequence group telah direncanakan.
- [ ] Form consent, SUS, dan UEQ resmi telah disiapkan.
- [ ] Instrumentasi menghasilkan event yang sama pada ketiga frontend.
- [ ] Otomasi INP Playwright telah dijalankan tiga kali untuk setiap skenario Vue dan Svelte, serta hasil mentah dan ringkasannya telah diarsipkan.
- [ ] Prosedur reset dan penanganan gangguan teknis telah diuji.
- [ ] Aturan eksklusi dan rencana analisis telah ditetapkan.
- [ ] Penyimpanan, anonimisasi, dan penghapusan data telah ditetapkan.

## 15. Referensi Instrumen

- Brooke, J. (1996). [SUS: A Quick and Dirty Usability Scale](https://hci-studies.org/methods-and-measures/downloads/SUS_Brooke1996.pdf).
- International Organization for Standardization. [ISO 9241-11:2018: Usability???Definitions and Concepts](https://www.iso.org/standard/63500.html).
- Schrepp, M. (2023). [User Experience Questionnaire Handbook](https://ueq-online.org/Material/Handbook.pdf).
- [UEQ questionnaire and official data-analysis tools](https://www.ueq-online.org/?page_id=110).
