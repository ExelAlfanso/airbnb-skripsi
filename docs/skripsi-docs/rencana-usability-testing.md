# Rencana Usability Testing

## 1. Tujuan

Usability testing ini bertujuan membandingkan prototipe frontend Vue.js dan Svelte pada konteks penggunaan yang sama. Outcome disusun secara hierarkis agar analisis tetap terarah:

- outcome utama *perceived usability*: skor System Usability Scale (SUS);
- metrik objektif utama usability: keberhasilan dan waktu penyelesaian tugas;
- pengukuran user experience pelengkap: enam skala User Experience Questionnaire (UEQ); dan
- data diagnostik: kesalahan, bantuan moderator, jumlah interaksi, dan penyimpangan dari urutan interaksi valid.

Hasil hanya digunakan untuk membandingkan prototipe yang diimplementasikan menggunakan Vue.js dan prototipe yang diimplementasikan menggunakan Svelte pada konfigurasi, dataset, partisipan, dan skenario penelitian ini. Kesimpulan tidak boleh digeneralisasi menjadi klaim bahwa Vue.js atau Svelte secara inheren lebih usable pada semua aplikasi.

## 2. Desain Penelitian

Penelitian menggunakan desain *within-subject counterbalanced*. Setiap partisipan menguji kedua prototipe, tetapi urutan framework dan set tugas diseimbangkan untuk mengurangi efek belajar, kelelahan, dan perbedaan tingkat kesulitan tugas.

| Kelompok | Sesi pertama | Sesi kedua |
| --- | --- | --- |
| 1 | Vue + Set Tugas A | Svelte + Set Tugas B |
| 2 | Svelte + Set Tugas A | Vue + Set Tugas B |
| 3 | Vue + Set Tugas B | Svelte + Set Tugas A |
| 4 | Svelte + Set Tugas B | Vue + Set Tugas A |

Jumlah partisipan pada setiap kelompok dibuat seimbang. Jika jumlah partisipan tidak habis dibagi empat, selisih ukuran kelompok maksimal satu partisipan.

Identitas framework disamarkan. Kepada partisipan, aplikasi hanya disebut "Versi A" dan "Versi B" atau "Prototipe 1" dan "Prototipe 2". Pemetaan identitas disimpan pada lembar peneliti dan baru dijelaskan setelah seluruh sesi selesai.

## 3. Variabel Penelitian

### 3.1 Variabel bebas

Framework frontend:

- Vue.js; dan
- Svelte.

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
- Bersedia mengikuti dua sesi prototipe dalam satu rangkaian pengujian.
- Bersedia memberikan persetujuan penelitian dan, jika digunakan, persetujuan rekaman layar atau audio.

### 4.2 Kriteria eksklusi

- Terlibat langsung dalam pengembangan prototipe.
- Sudah mengetahui pemetaan Vue dan Svelte pada Versi A/Versi B.
- Tidak menyelesaikan kedua kondisi pengujian.
- Mengalami gangguan teknis besar yang membuat data kedua kondisi tidak dapat dibandingkan.

### 4.3 Jumlah partisipan

Lakukan uji pilot kepada sekitar 6-10 partisipan untuk menguji kejelasan instruksi, tingkat kesulitan tugas, batas waktu, instrumen, dan pencatatan data. Data pilot tidak digabungkan dengan data utama jika protokol berubah setelah pilot.

Jumlah partisipan utama ditentukan melalui *power analysis* untuk satu outcome utama yang ditetapkan sebelum pengumpulan data, misalnya selisih skor SUS. Sebagai ilustrasi, *paired t-test* dua arah dengan alpha 0,05, power 0,80, dan perkiraan efek sedang `dz = 0,5` memerlukan sekitar 34 partisipan lengkap. Rekrutmen dapat ditambah sekitar 10-15% untuk mengantisipasi data tidak lengkap. Nilai final harus dihitung ulang menggunakan estimasi variasi selisih dari pilot atau *smallest effect size of interest* yang disepakati.

## 5. Instrumen dan Peralatan

- Production build prototipe Vue dan Svelte.
- Perangkat dan browser yang sama untuk seluruh kondisi.
- Form screening dan demografi singkat.
- Lembar informed consent.
- Naskah moderator.
- Lembar tugas Set A dan Set B.
- Lembar observasi.
- Event log aplikasi dan rekaman sesi.
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

### 6.3 Aturan independensi dan alternatif end-to-end

Sebelum setiap tugas, peneliti mengembalikan aplikasi ke kondisi awal yang tertulis pada tabel. Kegagalan pada satu tugas tidak boleh menentukan halaman awal, data, atau status pada tugas berikutnya. Timer baru dimulai setelah kondisi awal siap dan moderator selesai membacakan instruksi.

Jika tujuan penelitian berubah menjadi pengujian alur *end-to-end*, rangkaian search-filter-sort-detail-wishlist boleh dijadikan satu skenario. Dalam kasus tersebut, rangkaian dinilai menggunakan satu waktu, satu kondisi sukses, dan satu hasil skenario; tahap-tahapnya tidak dianalisis sebagai tugas independen.

### 6.4 Tugas load more opsional

Jika perilaku *load more* harus diukur secara eksplisit, tambahkan satu tugas setara pada kedua set dengan kondisi awal daftar yang telah di-reset. Contoh:

- Set A: muat hasil berikutnya sampai `Guesthouse Nyaman untuk Remote Work` terlihat.
- Set B: muat hasil berikutnya sampai `Apartemen Modern Dekat Pantai` terlihat.

Tugas ini hanya dipakai jika pilot membuktikan kedua target selalu berada setelah halaman awal pada konfigurasi production build yang dibekukan.

## 7. Definisi Operasional

### 7.1 Keberhasilan tugas

- `success`: kondisi akhir benar, selesai sebelum batas waktu, dan tanpa bantuan moderator.
- `assisted`: kondisi akhir benar setelah bantuan moderator.
- `failed`: kondisi akhir salah, partisipan menyerah, atau batas waktu terlewati.

Untuk analisis keberhasilan biner, `success` diberi nilai 1, sedangkan `assisted` dan `failed` diberi nilai 0. Kategori asli tetap disimpan agar kebutuhan bantuan dapat dilaporkan terpisah.

### 7.2 Waktu penyelesaian

Waktu dimulai setelah moderator selesai membacakan tugas dan partisipan mulai berinteraksi. Waktu berhenti ketika kondisi sukses tercapai, partisipan menyerah, atau batas waktu terlewati.

Batas waktu awal yang disarankan adalah 2-3 menit per tugas dan harus ditetapkan setelah pilot. Batas yang sama digunakan untuk pasangan tugas A dan B.

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
2. Pastikan kedua frontend lolos validasi kesetaraan fungsi.
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
| Pertanyaan perbandingan dan penutup | 5 menit |

SUS dan UEQ diisi setelah setiap versi, sehingga setiap partisipan menghasilkan satu set nilai Vue dan satu set nilai Svelte.

Jangan menggunakan *concurrent think-aloud* jika waktu penyelesaian menjadi outcome utama karena aktivitas berbicara dapat mengubah waktu dan strategi. Pertanyaan retrospektif dilakukan setelah satu kondisi selesai.

### 8.3 Naskah pembuka moderator

> Penelitian ini menguji dua versi prototipe pencarian akomodasi, bukan menguji kemampuan Anda. Tidak ada jawaban yang memengaruhi penilaian pribadi. Silakan selesaikan setiap tugas dengan cara yang menurut Anda paling tepat. Saya tidak dapat langsung memberi petunjuk mengenai letak fitur, tetapi saya dapat mengulang instruksi. Anda dapat berhenti kapan saja.

### 8.4 Pertanyaan retrospektif

Setelah setiap versi:

1. Bagian mana yang paling mudah digunakan?
2. Bagian mana yang paling membingungkan atau lambat menurut Anda?
3. Apakah ada hasil tindakan yang tidak sesuai dengan perkiraan Anda?

Setelah kedua versi:

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

Nama event, payload, dan waktu pencatatan harus sama pada Vue dan Svelte. Instrumentasi tidak boleh mengubah perilaku atau memberi beban yang berbeda secara material pada salah satu frontend.

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

Skor SUS menjadi outcome utama evaluasi pengguna. Setiap partisipan menghasilkan satu skor SUS setelah kondisi Vue dan satu skor SUS setelah kondisi Svelte.

### 10.2 Metrik objektif utama usability

Efektivitas dihitung sebagai:

```text
task_completion_rate = successful_tasks / attempted_tasks * 100%
```

Efisiensi utama diukur dengan waktu penyelesaian tugas. Laporkan tingkat keberhasilan dan distribusi waktu per tugas serta agregat per framework. Kategori `assisted` dilaporkan terpisah agar kebutuhan bantuan tidak hilang dalam agregasi.

Analisis waktu utama menggunakan pasangan tugas yang sukses tanpa bantuan pada kedua kondisi. Analisis sensitivitas dengan penalti batas waktu untuk tugas gagal hanya dilakukan jika aturannya telah ditetapkan sebelum hasil utama dilihat.

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

## 11. Rencana Analisis Statistik

Data dianalisis sebagai data berpasangan karena setiap partisipan menggunakan kedua framework. Hierarki outcome dan analisis ditetapkan sebelum data utama diperiksa.

| Outcome | Kedudukan | Analisis utama | Effect size yang dilaporkan |
| --- | --- | --- | --- |
| Skor SUS | Outcome utama *perceived usability* | *Paired t-test* jika distribusi selisih cukup normal; jika tidak, Wilcoxon signed-rank | Cohen's `dz` atau rank-biserial correlation |
| Keberhasilan biner | Metrik objektif utama usability | McNemar test | Selisih proporsi berpasangan dan interval kepercayaan |
| Waktu tugas | Metrik objektif utama usability | *Paired t-test* atau Wilcoxon pada pasangan valid | Cohen's `dz` atau rank-biserial correlation |
| Enam skala UEQ | Pengukuran UX pelengkap | *Paired t-test* atau Wilcoxon per skala dengan koreksi Holm | Effect size per skala |
| Kesalahan, bantuan, interaksi, dan penyimpangan | Data diagnostik | Ringkasan deskriptif; uji inferensial hanya sebagai eksplorasi yang dilabeli jelas | Effect size eksploratif jika dihitung |

Normalitas diperiksa pada distribusi selisih `Vue - Svelte`, bukan pada masing-masing framework secara terpisah. Semua hasil utama dilaporkan dengan interval kepercayaan 95%, effect size, nilai pusat, dan ukuran variasi, bukan hanya *p-value*.

Pengaruh framework, set tugas, periode, dan urutan framework diperiksa sejak awal sebagai analisis terencana:

1. laporkan outcome menurut kombinasi framework dan Set A/Set B;
2. laporkan outcome pada periode pertama dan kedua untuk memeriksa efek belajar atau kelelahan;
3. laporkan outcome menurut kelompok yang memulai dari Vue dan kelompok yang memulai dari Svelte; dan
4. periksa apakah arah selisih Vue-Svelte konsisten pada empat sequence group.

Analisis berpasangan tetap menjadi analisis utama jika pilot menunjukkan Set A dan Set B ekuivalen. Jika ukuran sampel memadai dan disetujui dalam rencana analisis, lakukan analisis sensitivitas menggunakan model efek campuran yang memasukkan framework, task set, period, dan framework order sebagai efek tetap serta participant sebagai efek acak. Model ini bersifat pelengkap dan tidak wajib untuk kesimpulan tingkat S1.

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

- seluruh tugas dapat diselesaikan pada kedua frontend;
- kesetaraan pasangan tugas A dan B telah diperiksa menggunakan median waktu penyelesaian, tingkat keberhasilan, jumlah kesalahan, dan kesulitan subjektif skala 1-5;
- batas penerimaan kesetaraan telah ditentukan sebelum pilot. Batas awal yang dapat digunakan adalah selisih tingkat keberhasilan maksimal 15 poin persentase, rasio median waktu 0,80-1,25, selisih median kesalahan maksimal 1, dan selisih median kesulitan maksimal 1 poin;
- pasangan tugas direvisi dan dipilotkan ulang jika melewati salah satu batas atau menunjukkan perbedaan kualitatif yang jelas;
- tidak ada instruksi yang secara tidak sengaja menyebut lokasi tombol;
- batas waktu tidak terlalu pendek atau terlalu panjang;
- event log, rekaman, dan lembar observasi menghasilkan waktu serta hasil yang konsisten;
- SUS dan UEQ dapat diisi setelah setiap kondisi tanpa kebingungan;
- reset filter, pagination, cache, dan wishlist bekerja konsisten; dan
- durasi sesi masih dapat diterima partisipan.

Setiap perubahan setelah pilot dicatat dalam log revisi protokol.

## 14. Checklist Sebelum Pengumpulan Data Utama

- [ ] Outcome utama telah ditentukan.
- [ ] Power analysis dan target rekrutmen telah disetujui.
- [ ] Commit dan production build telah dibekukan.
- [ ] Kesetaraan Vue dan Svelte telah diverifikasi.
- [ ] Set Tugas A dan B telah lulus pilot.
- [ ] Empat urutan counterbalancing telah disiapkan.
- [ ] Kondisi sukses, urutan interaksi valid, kesalahan, bantuan, dan batas waktu telah dibakukan.
- [ ] Batas kesetaraan pilot untuk waktu, keberhasilan, kesalahan, dan kesulitan subjektif telah dibekukan.
- [ ] Analisis task set, period, framework order, dan sequence group telah direncanakan.
- [ ] Form consent, SUS, dan UEQ resmi telah disiapkan.
- [ ] Instrumentasi menghasilkan event yang sama pada kedua frontend.
- [ ] Prosedur reset dan penanganan gangguan teknis telah diuji.
- [ ] Aturan eksklusi dan rencana analisis telah ditetapkan.
- [ ] Penyimpanan, anonimisasi, dan penghapusan data telah ditetapkan.

## 15. Referensi Instrumen

- Brooke, J. (1996). [SUS: A Quick and Dirty Usability Scale](https://hci-studies.org/methods-and-measures/downloads/SUS_Brooke1996.pdf).
- International Organization for Standardization. [ISO 9241-11:2018: Usability—Definitions and Concepts](https://www.iso.org/standard/63500.html).
- Schrepp, M. (2023). [User Experience Questionnaire Handbook](https://ueq-online.org/Material/Handbook.pdf).
- [UEQ questionnaire and official data-analysis tools](https://www.ueq-online.org/?page_id=110).
