# Brief Perhitungan dan Alasan Penggunaan Uji Statistik

Dokumen ini merangkum alur analisis statistik pada `docs/15494.pdf` dan menyesuaikannya dengan penelitian perbandingan performa Vue dan Svelte. Fokus pengujian adalah data hasil pengulangan Lighthouse seperti FCP, LCP, Speed Index, TBT, dan CLS.

## Ringkasan Alur Analisis

Alur yang digunakan dalam paper referensi:

```text
Data mentah hasil pengulangan
        |
        v
Mean dan standard deviation
        |
        v
Uji normalitas Shapiro-Wilk
        |
        +-- Data normal --> Uji homogenitas --> t-test
        |
        `-- Data tidak normal -------------> Mann-Whitney U
                                                |
                                                v
                                  Keputusan berdasarkan p-value
```

Untuk penelitian Vue-Svelte, pengujian sebaiknya dibuat berpasangan karena kedua framework diuji pada kondisi yang sama dan urutan pengujian diselang-seling.

```text
Run Vue ke-i dipasangkan dengan run Svelte ke-i
        |
        v
Hitung selisih d_i = Vue_i - Svelte_i
        |
        v
Uji normalitas terhadap kumpulan selisih d_i
        |
        +-- Selisih normal ------> Paired t-test
        |
`-- Selisih tidak normal -> Wilcoxon signed-rank
                                     atau sign/permutation test
```

## Glosarium Statistika Inferensial untuk Pemula

Statistika inferensial adalah cara menggunakan data sampel untuk menarik kesimpulan mengenai kondisi yang lebih luas, sambil mengakui bahwa hasil sampel mengandung variasi dan ketidakpastian.

Dalam penelitian ini, statistika inferensial digunakan untuk menjawab pertanyaan berikut:

> Apakah perbedaan hasil performa Vue dan Svelte cukup besar dan konsisten sehingga tidak masuk akal jika dianggap hanya sebagai variasi acak antar-run?

### Populasi

Populasi adalah seluruh hasil yang secara teoritis mungkin diperoleh pada cakupan penelitian.

Pada benchmark ini, populasi bukan kumpulan pengguna. Populasinya adalah seluruh kemungkinan hasil pengujian Vue dan Svelte apabila production build yang sama dijalankan berulang kali pada lingkungan, perangkat, browser, dataset, route, dan konfigurasi throttling yang telah ditetapkan.

Kegunaan:

- Menentukan batas kesimpulan penelitian.
- Mencegah klaim bahwa hasil satu perangkat berlaku untuk seluruh perangkat atau seluruh aplikasi web.

### Sampel

Sampel adalah sebagian hasil dari populasi yang benar-benar dikumpulkan dan dianalisis.

Contoh:

```text
30 run LCP Vue dan 30 run LCP Svelte
```

Kegunaan:

- Menjadi dasar untuk memperkirakan karakteristik populasi.
- Memungkinkan penelitian dilakukan tanpa menjalankan jumlah pengujian yang tidak terbatas.

### Pengamatan atau observasi

Observasi adalah satu nilai individual dalam data.

Contoh:

```text
LCP Vue pada run ke-7 = 1,820 ms
```

Kegunaan:

- Menjadi unit terkecil yang digunakan dalam perhitungan statistik.
- Menentukan ukuran sampel `n`.

### Unit analisis

Unit analisis adalah objek yang dianggap menghasilkan satu observasi independen atau satu pasangan observasi.

Untuk desain yang direkomendasikan, unit analisisnya adalah satu blok pengujian yang berisi satu run Vue dan satu run Svelte pada kondisi yang sebanding.

Kegunaan:

- Menentukan apakah data harus dianalisis sebagai independen atau berpasangan.
- Mencegah pengulangan teknis dianggap sebagai sampel pengguna atau perangkat yang berbeda.

### Variabel

Variabel adalah karakteristik yang nilainya dapat berubah antar-observasi.

Contoh variabel dalam penelitian:

- Framework: Vue atau Svelte.
- LCP dalam milidetik.
- CLS tanpa satuan.
- Urutan pengujian: Vue-Svelte atau Svelte-Vue.
- Route atau skenario yang diuji.

Kegunaan:

- Menentukan data apa yang dikumpulkan.
- Menentukan variabel perlakuan, variabel hasil, dan variabel kontrol.

### Parameter

Parameter adalah nilai sebenarnya pada populasi, tetapi biasanya tidak diketahui.

Contoh:

```text
mu_Vue = rata-rata LCP seluruh kemungkinan run Vue
```

Kegunaan:

- Menjadi nilai populasi yang ingin diperkirakan dari sampel.
- Menjadi objek dalam hipotesis, misalnya `mu_Vue = mu_Svelte`.

### Statistik sampel

Statistik adalah angka yang dihitung dari sampel.

Contoh:

- Mean sampel.
- Median sampel.
- Standard deviation sampel.
- Selisih mean Vue dan Svelte.
- Nilai statistik `t`, `W`, atau `U`.

Kegunaan:

- Memperkirakan parameter populasi.
- Menjadi bahan perhitungan interval kepercayaan dan pengujian hipotesis.

### Estimasi

Estimasi adalah nilai sampel yang digunakan sebagai perkiraan terhadap parameter populasi.

Contoh:

```text
Mean LCP dari 30 run Vue = estimasi mean LCP populasi pengujian Vue
```

Kegunaan:

- Memberikan perkiraan numerik mengenai besar performa atau perbedaan framework.
- Melengkapi keputusan signifikan atau tidak signifikan dengan besar efek yang nyata.

### Distribusi

Distribusi menggambarkan pola penyebaran nilai data: posisi pusatnya, rentangnya, kemiringannya, dan kemungkinan munculnya nilai tertentu.

Contoh:

- Data simetris di sekitar mean.
- Data miring ke kanan karena beberapa run sangat lambat.
- Data CLS bertumpuk pada nilai nol.

Kegunaan:

- Membantu memilih ringkasan data dan metode pengujian yang sesuai.
- Menjelaskan mengapa mean dan median dapat memberikan gambaran berbeda.

### Distribusi normal

Distribusi normal adalah distribusi berbentuk lonceng, relatif simetris, dan sebagian besar nilainya berada di sekitar mean.

Kegunaan:

- Menjadi salah satu asumsi dalam banyak uji parametrik.
- Membantu menentukan apakah paired t-test layak digunakan.

Data tidak harus terlihat sempurna seperti lonceng. Hal yang penting untuk paired t-test adalah distribusi selisih pasangan cukup mendekati normal dan tidak didominasi outlier ekstrem.

### Asumsi statistik

Asumsi statistik adalah kondisi yang diperlukan agar hasil suatu metode dapat ditafsirkan dengan benar.

Contoh asumsi:

- Observasi independen untuk independent t-test.
- Pasangan dibentuk secara masuk akal untuk paired t-test.
- Selisih pasangan cukup normal untuk paired t-test.
- Data minimal dapat diurutkan untuk uji berbasis rank.

Kegunaan:

- Menentukan apakah suatu uji cocok digunakan.
- Mencegah p-value yang secara matematis keluar tetapi tidak valid secara metodologis.

### Hipotesis nol atau H0

Hipotesis nol adalah posisi awal yang menyatakan tidak terdapat efek atau perbedaan.

Contoh untuk paired t-test:

```text
H0: mean selisih Vue-Svelte = 0
```

Kegunaan:

- Menjadi klaim yang diuji menggunakan data.
- Menjadi dasar perhitungan p-value.

### Hipotesis alternatif atau H1

Hipotesis alternatif menyatakan bahwa terdapat efek atau perbedaan yang ingin dideteksi.

Contoh hipotesis dua arah:

```text
H1: mean selisih Vue-Svelte != 0
```

Kegunaan:

- Menyatakan kesimpulan yang didukung apabila H0 ditolak.
- Menentukan apakah uji dilakukan satu arah atau dua arah.

### Uji satu arah dan dua arah

Uji dua arah mencari perbedaan ke kedua arah:

```text
Vue dapat lebih cepat atau lebih lambat daripada Svelte
```

Uji satu arah hanya mencari perbedaan ke arah yang telah ditentukan:

```text
Svelte memiliki LCP lebih rendah daripada Vue
```

Kegunaan:

- Uji dua arah digunakan ketika penelitian ingin mengetahui apakah terdapat perbedaan tanpa mengunci pemenang sebelumnya.
- Uji satu arah digunakan hanya jika hipotesis arah telah ditetapkan sebelum melihat data dan arah sebaliknya tidak akan dianggap mendukung hipotesis.

Untuk penelitian ini, uji dua arah lebih aman dan lebih mudah dipertanggungjawabkan.

### Tingkat signifikansi atau alpha

Alpha adalah batas risiko kesalahan positif yang ditetapkan sebelum analisis. Nilai yang umum digunakan adalah:

```text
alpha = 0.05
```

Kegunaan:

- Menjadi batas keputusan untuk menolak H0.
- Menyatakan toleransi terhadap kesalahan tipe I.

Alpha 0,05 berarti prosedur pengujian menerima risiko kesalahan tipe I sebesar 5% dalam pengulangan jangka panjang ketika seluruh asumsi uji terpenuhi. Alpha bukan berarti hasil penelitian memiliki peluang 95% untuk benar.

### p-value

p-value adalah probabilitas memperoleh hasil setidaknya se-ekstrem data yang diamati, dengan asumsi H0 benar dan model statistik yang digunakan sesuai.

Aturan keputusan yang umum:

```text
Jika p-value < alpha  -> tolak H0
Jika p-value >= alpha -> gagal menolak H0
```

Kegunaan:

- Mengukur seberapa tidak sesuai data dengan H0.
- Membantu membuat keputusan pengujian hipotesis.

p-value bukan:

- Probabilitas bahwa H0 benar.
- Probabilitas hasil terjadi karena kebetulan.
- Ukuran besar atau pentingnya perbedaan.
- Bukti bahwa dua framework sama ketika `p >= 0.05`.

### Signifikan secara statistik

Hasil disebut signifikan secara statistik ketika p-value lebih kecil daripada alpha yang telah ditetapkan.

Kegunaan:

- Menunjukkan bahwa hasil cukup tidak sesuai dengan H0 menurut aturan uji.
- Membantu membedakan sinyal dari variasi pengukuran.

Signifikan secara statistik belum tentu signifikan secara praktis. Selisih LCP 5 ms mungkin menghasilkan p-value kecil jika jumlah run sangat banyak, tetapi belum tentu terasa atau penting bagi pengguna.

### Gagal menolak H0

Gagal menolak H0 berarti data belum memberikan bukti yang cukup untuk menyatakan adanya perbedaan.

Kegunaan:

- Menjaga interpretasi agar tidak keliru menyatakan kedua framework identik.
- Menunjukkan kemungkinan bahwa sampel terlalu kecil, variasi terlalu besar, atau efek memang sangat kecil.

Istilah `menerima H0` sebaiknya dihindari, kecuali penelitian menggunakan desain khusus untuk menguji ekuivalensi.

### Kesalahan tipe I

Kesalahan tipe I terjadi ketika H0 ditolak padahal sebenarnya H0 benar. Ini disebut false positive.

Contoh:

```text
Penelitian menyimpulkan Vue dan Svelte berbeda,
padahal pada populasi pengujian sebenarnya tidak berbeda.
```

Kegunaan:

- Menjelaskan alasan alpha dan koreksi multiple testing diperlukan.

### Kesalahan tipe II

Kesalahan tipe II terjadi ketika penelitian gagal menolak H0 padahal sebenarnya terdapat perbedaan. Ini disebut false negative.

Contoh:

```text
Penelitian menyatakan belum ada bukti perbedaan,
padahal perbedaan sebenarnya ada tetapi jumlah run terlalu sedikit.
```

Kegunaan:

- Menjelaskan alasan ukuran sampel dan statistical power perlu direncanakan.

### Statistical power

Power adalah probabilitas suatu uji berhasil mendeteksi efek yang benar-benar ada.

```text
power = 1 - probabilitas kesalahan tipe II
```

Kegunaan:

- Membantu menentukan jumlah pengulangan yang dibutuhkan.
- Mengurangi kemungkinan penelitian gagal mendeteksi perbedaan yang relevan.

Power meningkat ketika jumlah sampel lebih besar, variasi lebih kecil, atau efek yang dicari lebih besar. Jumlah run sebaiknya ditentukan melalui pilot dan power analysis, bukan dipilih setelah melihat p-value.

### Effect size

Effect size mengukur besar perbedaan, bukan hanya apakah perbedaan tersebut signifikan.

Contoh effect size yang mudah dipahami:

```text
selisih absolut = median_Vue - median_Svelte

selisih persen = ((median_Vue - median_Svelte) / median_Vue) * 100%
```

Effect size statistik yang dapat digunakan antara lain Cohen's `d_z` untuk data berpasangan atau rank-biserial correlation untuk Wilcoxon.

Kegunaan:

- Menilai apakah perbedaan bermakna secara praktis.
- Memungkinkan pembaca membandingkan kekuatan efek antar-metrik.

### Interval kepercayaan

Interval kepercayaan adalah rentang nilai yang menunjukkan ketidakpastian estimasi.

Contoh:

```text
Selisih median LCP = 120 ms
CI 95% = 70 ms sampai 180 ms
```

Kegunaan:

- Menunjukkan perkiraan besar efek dan tingkat presisinya.
- Memberikan informasi lebih kaya daripada p-value saja.

Interpretasi frequentist yang tepat: jika prosedur pengambilan sampel dan perhitungan diulang berkali-kali, sekitar 95% interval yang terbentuk akan mencakup parameter sebenarnya. Interval yang lebar menunjukkan estimasi masih kurang presisi.

### Standard error

Standard error mengukur ketidakpastian suatu statistik sampel sebagai estimasi parameter populasi.

Untuk mean:

```text
SE = standard deviation / sqrt(n)
```

Kegunaan:

- Menghitung interval kepercayaan.
- Menghitung statistik uji seperti `t`.

Standard deviation menjelaskan penyebaran nilai individual, sedangkan standard error menjelaskan ketidakpastian mean sampel.

### Derajat kebebasan atau degrees of freedom

Derajat kebebasan adalah jumlah informasi independen yang masih tersedia setelah beberapa parameter diestimasi.

Contoh pada paired t-test dengan `n` pasangan:

```text
df = n - 1
```

Kegunaan:

- Menentukan bentuk distribusi `t` dan nilai kritisnya.
- Digunakan perangkat lunak untuk menghitung p-value dan interval kepercayaan.

### Uji parametrik

Uji parametrik membuat asumsi mengenai parameter dan bentuk distribusi tertentu.

Contoh:

- Independent t-test.
- Paired t-test.
- ANOVA.

Kegunaan:

- Umumnya memiliki power yang baik ketika asumsi terpenuhi.
- Menguji parameter yang jelas, misalnya perbedaan mean.

### Uji nonparametrik

Uji nonparametrik menggunakan asumsi distribusi yang lebih sedikit dan sering bekerja menggunakan urutan atau rank.

Contoh:

- Mann-Whitney U untuk dua sampel independen.
- Wilcoxon signed-rank untuk data berpasangan.
- Sign test untuk tanda selisih pasangan.

Kegunaan:

- Menangani data yang tidak normal atau sulit diringkas dengan mean.
- Cocok untuk beberapa jenis data dengan outlier atau skala ordinal.

Nonparametrik tidak berarti bebas dari seluruh asumsi. Wilcoxon, misalnya, tetap memerlukan pasangan yang valid dan interpretasi tertentu bergantung pada bentuk distribusi selisih.

### Sampel independen

Dua sampel independen tidak mempunyai hubungan satu-ke-satu antar-observasi.

Contoh:

```text
Vue diuji pada komputer A,
Svelte diuji pada komputer B,
dan setiap run tidak dapat dipasangkan.
```

Kegunaan:

- Menentukan penggunaan independent t-test atau Mann-Whitney U.

### Sampel berpasangan

Data berpasangan memiliki hubungan satu-ke-satu yang bermakna.

Contoh:

```text
Blok 1: Vue run 1 dan Svelte run 1
Blok 2: Svelte run 2 dan Vue run 2
```

Setiap pasangan menggunakan route, perangkat, browser, throttling, cache policy, dan periode pengujian yang sebanding.

Kegunaan:

- Mengurangi pengaruh variasi lingkungan karena analisis berfokus pada selisih di dalam pasangan.
- Menentukan penggunaan paired t-test atau Wilcoxon signed-rank.

### Independensi

Independensi berarti satu observasi tidak menentukan atau bergantung secara tidak semestinya pada observasi lain.

Kegunaan:

- Menjadi asumsi penting hampir seluruh uji statistik.
- Mencegah jumlah informasi terlihat lebih besar daripada kenyataannya.

Run berurutan dapat mengalami ketergantungan karena thermal throttling, cache, proses latar belakang, atau perubahan jaringan. Gunakan fresh context, pengendalian cache, counterbalancing, dan pemeriksaan pola urutan untuk mengurangi risiko tersebut.

### Pseudoreplikasi

Pseudoreplikasi terjadi ketika banyak pengukuran teknis diperlakukan seolah-olah berasal dari banyak unit eksperimen independen.

Contoh:

```text
100 run pada satu laptop tidak sama dengan pengujian pada 100 laptop.
```

Kegunaan istilah ini:

- Membatasi generalisasi hasil dengan benar.
- Menegaskan bahwa banyak run meningkatkan presisi pada lingkungan tersebut, tetapi tidak otomatis mewakili seluruh perangkat dan kondisi pengguna.

### Outlier

Outlier adalah nilai yang sangat jauh dari mayoritas data.

Contoh penyebab:

- Update sistem berjalan di latar belakang.
- Gangguan jaringan.
- Browser melakukan proses tambahan.
- External image server melambat.

Kegunaan pemeriksaan outlier:

- Menemukan gangguan eksperimen.
- Menentukan apakah nilai harus dipertahankan, dikeluarkan berdasarkan aturan yang telah ditetapkan, atau dianalisis menggunakan metode robust.

Outlier tidak boleh dihapus hanya karena membuat hasil tidak signifikan. Aturan eksklusi harus ditetapkan sebelum melihat hasil akhir dan setiap penghapusan harus dilaporkan.

### Rank

Rank adalah posisi suatu nilai setelah seluruh nilai diurutkan.

Contoh:

```text
Data: 100, 120, 150
Rank:   1,   2,   3
```

Kegunaan:

- Menjadi dasar Mann-Whitney U dan Wilcoxon signed-rank.
- Mengurangi ketergantungan pada jarak numerik yang ekstrem.

### Ties

Ties terjadi ketika beberapa observasi memiliki nilai yang sama.

Contoh:

```text
CLS = 0 pada banyak run
TBT = 0 ms pada banyak run
```

Kegunaan pemeriksaan ties:

- Menentukan apakah pendekatan exact pada uji berbasis rank masih sesuai.
- Menjadi alasan mempertimbangkan sign test atau permutation test.

### Randomisasi

Randomisasi adalah penentuan urutan atau perlakuan menggunakan mekanisme acak.

Kegunaan:

- Mengurangi hubungan sistematis antara framework dan kondisi eksternal.
- Mencegah satu framework selalu diuji ketika perangkat masih dingin atau jaringan sedang lebih baik.

### Counterbalancing

Counterbalancing adalah penyeimbangan urutan perlakuan.

Contoh:

```text
Blok ganjil : Vue lalu Svelte
Blok genap  : Svelte lalu Vue
```

Kegunaan:

- Mengurangi order effect, drift suhu, dan perubahan kondisi sepanjang pengujian.
- Membentuk pasangan run yang lebih adil.

### Blocking

Blocking adalah pengelompokan observasi yang memiliki kondisi serupa sebelum membandingkan perlakuan.

Contoh:

```text
Satu blok = satu run Vue + satu run Svelte
pada route, viewport, dan periode waktu yang sama
```

Kegunaan:

- Mengisolasi variasi lingkungan dari efek framework.
- Meningkatkan ketelitian perbandingan berpasangan.

### Multiple testing

Multiple testing terjadi ketika banyak hipotesis diuji pada dataset atau keluarga penelitian yang sama.

Contoh:

```text
FCP, LCP, Speed Index, TBT, dan CLS
= lima pengujian hipotesis
```

Semakin banyak pengujian, semakin besar peluang memperoleh paling tidak satu hasil signifikan secara kebetulan.

Kegunaan konsep ini:

- Menentukan perlunya metrik primer atau koreksi p-value.
- Mengendalikan risiko kesalahan tipe I pada keseluruhan keluarga pengujian.

### Koreksi Holm

Koreksi Holm adalah prosedur untuk menyesuaikan keputusan ketika beberapa hipotesis diuji sekaligus.

Langkah ringkas:

1. Urutkan p-value dari terkecil hingga terbesar.
2. Bandingkan p-value terkecil dengan `alpha / m`, dengan `m` jumlah hipotesis.
3. Lanjutkan secara bertahap dengan pembagi yang semakin kecil.
4. Hentikan penolakan ketika satu hipotesis gagal melewati batasnya.

Kegunaan:

- Mengendalikan family-wise error rate.
- Lebih kuat daripada koreksi Bonferroni biasa tetapi tetap mudah dijelaskan.

### Bootstrap

Bootstrap adalah metode mengambil sampel ulang dengan pengembalian dari data yang tersedia, kemudian menghitung statistik berulang kali.

Kegunaan:

- Memperkirakan interval kepercayaan ketika rumus analitik sulit digunakan.
- Mengestimasi ketidakpastian median, selisih median, atau effect size.

Bootstrap tidak menciptakan informasi baru; kualitasnya tetap bergantung pada ukuran dan representativitas sampel awal.

### Permutation test

Permutation test membentuk distribusi nol dengan menukar label atau tanda sesuai desain eksperimen, kemudian membandingkan hasil observasi dengan hasil pertukaran tersebut.

Pada data berpasangan, tanda selisih Vue-Svelte dapat dipertukarkan berulang kali ketika H0 menyatakan tidak ada efek framework.

Kegunaan:

- Mengurangi ketergantungan pada asumsi distribusi normal.
- Cocok ketika desain pengujian dan proses pemasangan observasi dijelaskan dengan baik.

### Sign test

Sign test hanya menghitung berapa banyak pasangan yang menghasilkan selisih positif dan negatif, tanpa memperhitungkan besar selisihnya.

Kegunaan:

- Cocok untuk data berpasangan dengan distribusi sangat tidak normal atau banyak outlier.
- Memiliki asumsi lebih ringan daripada Wilcoxon.

Kekurangannya adalah power cenderung lebih rendah karena informasi besar selisih tidak digunakan.

### Q-Q plot

Q-Q plot membandingkan quantile data dengan quantile distribusi teoretis, biasanya distribusi normal.

Kegunaan:

- Melihat normalitas secara visual.
- Menemukan kemiringan, heavy tails, atau outlier yang mungkin tidak cukup dijelaskan oleh satu p-value Shapiro-Wilk.

Jika titik-titik mengikuti garis diagonal secara wajar, distribusi data cukup mendekati distribusi pembanding.

### Ringkasan istilah yang paling penting

| Pertanyaan penelitian | Istilah atau alat yang menjawab |
|---|---|
| Berapa nilai performa tipikal? | Mean dan median |
| Seberapa berubah hasil antar-run? | Standard deviation dan IQR |
| Seberapa presisi estimasinya? | Standard error dan confidence interval |
| Apakah selisih pasangan cukup normal? | Q-Q plot dan Shapiro-Wilk |
| Apakah perbedaan mungkin sekadar variasi sampel? | Paired t-test, Wilcoxon, atau permutation test |
| Seberapa besar perbedaannya? | Effect size dan selisih persentase |
| Apakah hasil berlaku untuk semua perangkat? | Tidak otomatis; periksa populasi dan pseudoreplikasi |
| Bagaimana mengendalikan banyak pengujian? | Koreksi Holm atau metrik primer |

## 1. Mean dan Standard Deviation

Misalkan satu metrik diuji sebanyak `n` kali dan menghasilkan data:

```text
x_1, x_2, x_3, ..., x_n
```

### Mean

Mean atau rata-rata dihitung dengan:

```text
mean = jumlah seluruh nilai / jumlah pengamatan

x_bar = sum(x_i) / n
```

Contoh data hipotetis TBT:

```text
10, 12, 11, 13, 9

mean = (10 + 12 + 11 + 13 + 9) / 5
     = 55 / 5
     = 11 ms
```

### Sample standard deviation

Standard deviation sampel dihitung dengan:

```text
s = sqrt[ sum((x_i - x_bar)^2) / (n - 1) ]
```

Langkah perhitungan contoh:

| Nilai `x_i` | `x_i - mean` | `(x_i - mean)^2` |
|---:|---:|---:|
| 10 | -1 | 1 |
| 12 | 1 | 1 |
| 11 | 0 | 0 |
| 13 | 2 | 4 |
| 9 | -2 | 4 |
| **Jumlah** |  | **10** |

```text
s = sqrt(10 / (5 - 1))
  = sqrt(2.5)
  = 1.58 ms
```

Hasil dilaporkan sebagai:

```text
11 +/- 1.58 ms
```

### Alasan menggunakan mean dan standard deviation

- Mean menunjukkan pusat atau rata-rata performa seluruh run.
- Standard deviation menunjukkan besar variasi antar-run.
- Standard deviation kecil menunjukkan hasil pengujian relatif konsisten.
- Standard deviation besar menunjukkan hasil mudah berubah akibat noise, jaringan, proses latar belakang, atau variasi browser.
- Dua framework dapat memiliki mean serupa tetapi kestabilan berbeda.

`Mean +/- SD` bukan margin of error dan bukan interval kepercayaan. Standard error dan interval kepercayaan mean dihitung sebagai berikut:

```text
SE = s / sqrt(n)

CI 95% = mean +/- t_critical * SE
```

Untuk data yang miring, mengandung outlier, atau banyak bernilai nol seperti CLS dan TBT, median dan interquartile range (IQR) sebaiknya ikut dilaporkan.

```text
IQR = Q3 - Q1
```

## 2. Uji Normalitas Shapiro-Wilk

Uji normalitas digunakan untuk memeriksa apakah distribusi data cukup sesuai dengan distribusi normal.

Hipotesisnya:

```text
H0: data berasal dari distribusi normal
H1: data tidak berasal dari distribusi normal
```

Statistik Shapiro-Wilk secara ringkas:

```text
W = [sum(a_i * x_(i))]^2 / sum((x_i - x_bar)^2)
```

Keterangan:

- `x_(i)` adalah data yang telah diurutkan dari terkecil hingga terbesar.
- `a_i` adalah koefisien Shapiro-Wilk berdasarkan ukuran sampel.
- Nilai `W` dan p-value umumnya dihitung menggunakan perangkat lunak statistik.

Dengan tingkat signifikansi `alpha = 0.05`:

| Hasil | Keputusan | Interpretasi |
|---|---|---|
| `p-value > 0.05` | Gagal menolak H0 | Belum ada bukti cukup bahwa data tidak normal |
| `p-value <= 0.05` | Tolak H0 | Terdapat bukti bahwa data tidak normal |

### Alasan menggunakan uji normalitas

- Uji parametrik seperti t-test memiliki asumsi normalitas.
- Hasilnya membantu memilih antara uji parametrik dan nonparametrik.
- Data performa browser sering tidak simetris karena outlier, network jitter, long task, atau nilai nol.

`p-value > 0.05` tidak membuktikan bahwa data pasti normal. Pemeriksaan sebaiknya dilengkapi dengan histogram, box plot, dan Q-Q plot.

Pada desain berpasangan, normalitas diperiksa pada nilai selisih setiap pasangan, bukan pada kelompok Vue dan Svelte secara terpisah:

```text
d_i = nilai Vue_i - nilai Svelte_i
```

## 3. Uji Homogenitas

Uji homogenitas memeriksa apakah dua kelompok memiliki varians yang setara.

Hipotesisnya:

```text
H0: variance_Vue = variance_Svelte
H1: variance_Vue != variance_Svelte
```

Keputusan dengan `alpha = 0.05`:

| Hasil | Keputusan | Interpretasi |
|---|---|---|
| `p-value > 0.05` | Gagal menolak H0 | Varians dapat dianggap homogen |
| `p-value <= 0.05` | Tolak H0 | Varians tidak homogen |

Paper referensi menggunakan Bartlett test. Statistiknya membandingkan varians masing-masing kelompok dengan pooled variance.

Pooled variance untuk dua kelompok:

```text
s_p^2 = [((n_1 - 1) * s_1^2) + ((n_2 - 1) * s_2^2)]
        / (n_1 + n_2 - 2)
```

### Alasan menggunakan uji homogenitas

- Independent t-test klasik dengan pooled variance mengasumsikan varians kedua kelompok sama.
- Uji homogenitas menentukan apakah asumsi tersebut cukup masuk akal.
- Jika varians tidak homogen, Welch t-test lebih tepat daripada pooled independent t-test.

Bartlett test sensitif terhadap data tidak normal. Jika normalitas meragukan, Levene test lebih tahan terhadap penyimpangan distribusi.

### Apakah penelitian Vue-Svelte memerlukan homogenitas?

Tidak wajib apabila pengujian menggunakan desain berpasangan. Paired t-test menganalisis distribusi selisih `d_i`, sehingga tidak mensyaratkan varians Vue dan Svelte harus sama.

Homogenitas diperlukan apabila seluruh run Vue dan Svelte dianggap sebagai dua sampel independen dan peneliti ingin memakai pooled independent t-test.

## 4. Pengujian Hipotesis

Hipotesis umum untuk setiap metrik:

```text
H0: tidak terdapat perbedaan performa antara Vue dan Svelte
H1: terdapat perbedaan performa antara Vue dan Svelte
```

Gunakan hipotesis dua arah, kecuali arah perbedaan telah ditentukan sebelum data dilihat.

Keputusan dengan `alpha = 0.05`:

| Hasil | Keputusan | Kesimpulan |
|---|---|---|
| `p-value < 0.05` | Tolak H0 | Terdapat perbedaan yang signifikan secara statistik |
| `p-value >= 0.05` | Gagal menolak H0 | Belum terdapat bukti perbedaan yang signifikan |

`Tidak signifikan` tidak berarti kedua framework terbukti identik. Hasil tersebut hanya menunjukkan bukti yang tersedia belum cukup untuk menolak H0.

### Independent t-test

Digunakan dalam paper apabila data normal, kedua kelompok independen, dan varians homogen.

```text
t = (mean_1 - mean_2)
    / [s_p * sqrt((1 / n_1) + (1 / n_2))]
```

Jika varians tidak homogen, gunakan Welch t-test:

```text
t = (mean_1 - mean_2)
    / sqrt((s_1^2 / n_1) + (s_2^2 / n_2))
```

### Mann-Whitney U

Digunakan dalam paper ketika data dua kelompok independen tidak normal.

Langkah ringkas:

1. Gabungkan data kedua kelompok.
2. Urutkan seluruh nilai.
3. Berikan rank pada setiap nilai.
4. Jumlahkan rank masing-masing kelompok.
5. Hitung statistik `U`.
6. Konversi statistik `U` menjadi p-value menggunakan perangkat lunak.

Salah satu bentuk rumusnya:

```text
U_1 = (n_1 * n_2) + [n_1 * (n_1 + 1) / 2] - R_1
```

`R_1` adalah jumlah rank kelompok pertama. Mann-Whitney membandingkan distribusi dua sampel independen. Uji ini tidak selalu dapat dijelaskan sebagai uji perbedaan median jika bentuk kedua distribusinya berbeda.

### Paired t-test yang direkomendasikan

Untuk setiap blok pengujian, pasangkan hasil Vue dan Svelte:

```text
d_i = Vue_i - Svelte_i
```

Kemudian hitung:

```text
t = mean_d / (s_d / sqrt(n))
```

Hipotesisnya:

```text
H0: mean_d = 0
H1: mean_d != 0
```

Paired t-test mempertimbangkan bahwa kedua hasil berasal dari kondisi pengujian yang dipasangkan.

### Wilcoxon signed-rank yang direkomendasikan

Jika selisih pasangan tidak normal:

1. Hitung `d_i = Vue_i - Svelte_i`.
2. Abaikan selisih nol sesuai aturan metode.
3. Urutkan nilai absolut `abs(d_i)`.
4. Berikan rank.
5. Kembalikan tanda positif atau negatif pada rank.
6. Bandingkan jumlah rank positif dan negatif.
7. Hitung p-value.

Jika TBT atau CLS memiliki sangat banyak nilai nol/ties, gunakan exact sign test atau paired permutation test karena Wilcoxon juga dapat terpengaruh oleh ties dan bentuk distribusi selisih.

## 5. Ringkasan Hasil Statistik Paper Referensi

| Metrik | Rendering | Normalitas | Uji hipotesis yang dinyatakan | p-value | Kesimpulan paper |
|---|---|---|---|---:|---|
| TBT | CSR | Salah satu tidak normal | Mann-Whitney | `2.954 x 10^-11` | Berbeda signifikan |
| TBT | SSR | Tidak normal | Mann-Whitney | `3.020 x 10^-11` | Berbeda signifikan |
| TBT | SSG | Normal dan homogen | t-test | `3.019 x 10^-11` | Berbeda signifikan |
| CLS | CSR | Tidak normal | Mann-Whitney | `0.216` | Tidak signifikan |
| CLS | SSR | Tidak normal | Mann-Whitney | `1.705 x 10^-9` | Berbeda signifikan |
| CLS | SSG | Salah satu tidak normal | Mann-Whitney | `2.630 x 10^-7` | Berbeda signifikan |
| Speed Index | CSR | Tidak normal | Mann-Whitney | `0.004` | Berbeda signifikan |
| Speed Index | SSR | Normal dan homogen | Tidak konsisten dalam paper | `0.827` | Tidak signifikan |
| Speed Index | SSG | Normal dan homogen | Tidak konsisten dalam paper | `0.390` | Tidak signifikan |

Pada Speed Index SSR dan SSG, paper menyatakan bahwa data normal dan homogen tetapi narasinya tetap menyebut Mann-Whitney. Berdasarkan prosedur yang ditetapkan paper sendiri, kondisi tersebut seharusnya diarahkan ke independent t-test. Nama uji juga tidak dicantumkan dengan jelas pada tabel hasilnya.

## 6. Catatan Keterbatasan Paper Referensi

Paper dapat digunakan sebagai referensi alur analisis, tetapi tidak sebaiknya disalin secara langsung karena:

1. Jumlah pengulangan `n` tidak dicantumkan.
2. Data mentah tidak disediakan sehingga angka mean, SD, dan p-value tidak dapat direproduksi.
3. Pemilihan uji Speed Index SSR dan SSG tidak konsisten dengan prosedur penelitian.
4. Tidak dijelaskan apakah setiap run sebenarnya independen atau dapat dipasangkan.
5. Tidak dilaporkan interval kepercayaan atau effect size.
6. Tidak ada koreksi multiple testing meskipun terdapat sembilan perbandingan.
7. Satuan SD Speed Index tampak perlu diverifikasi, misalnya `2849 +/- 0.366 ms` mungkin mencampurkan satuan milidetik dan detik.
8. TBT dan Speed Index disebut sebagai Core Web Vitals, padahal keduanya adalah metrik performa Lighthouse; Core Web Vitals resmi adalah LCP, INP, dan CLS.

## 7. Rekomendasi Akhir untuk Penelitian Vue-Svelte

### Desain pengambilan data

- Gunakan production build.
- Gunakan route, dataset, viewport, browser, jaringan, CPU throttling, dan cache policy yang sama.
- Pasangkan setiap run Vue dengan satu run Svelte dalam blok kondisi yang sama.
- Selang-seling urutan framework, misalnya `Vue-Svelte`, kemudian `Svelte-Vue`.
- Bekukan jumlah pasangan pengulangan sebelum pengambilan data.

### Statistik deskriptif

Untuk setiap framework dan metrik, laporkan:

- jumlah pengamatan `n`;
- mean dan standard deviation;
- median dan IQR;
- minimum dan maksimum;
- selisih absolut dan persentase Vue-Svelte;
- interval kepercayaan 95%.

### Statistik inferensial

```text
1. Hitung selisih berpasangan d_i = Vue_i - Svelte_i.
2. Periksa histogram, Q-Q plot, outlier, dan Shapiro-Wilk pada d_i.
3. Jika d_i cukup normal, gunakan paired t-test.
4. Jika tidak normal, gunakan Wilcoxon signed-rank.
5. Jika banyak nilai nol/ties, gunakan sign test atau paired permutation test.
6. Laporkan p-value, confidence interval, dan effect size.
7. Terapkan koreksi Holm jika beberapa metrik diuji sebagai satu keluarga hipotesis.
```

Uji homogenitas tidak diperlukan untuk analisis berpasangan tersebut.

## 8. Contoh Narasi Metodologi

> Setiap metrik performa diukur secara berulang pada production build Vue dan Svelte menggunakan kondisi perangkat, browser, viewport, throttling, cache, dataset, serta skenario yang sama. Urutan framework diselang-seling dan hasil dikelompokkan menjadi pasangan run. Data setiap framework diringkas menggunakan mean, standard deviation, median, interquartile range, minimum, dan maksimum. Mean digunakan untuk menunjukkan nilai rata-rata, sedangkan standard deviation menunjukkan variasi antar-run. Median dan IQR turut dilaporkan karena data performa browser berpotensi mengandung outlier atau distribusi miring.
>
> Normalitas diperiksa terhadap selisih nilai pada setiap pasangan run menggunakan Shapiro-Wilk dan Q-Q plot. Apabila selisih memenuhi asumsi normalitas, perbandingan dilakukan menggunakan paired t-test. Apabila asumsi tersebut tidak terpenuhi, digunakan Wilcoxon signed-rank atau paired permutation test ketika terdapat banyak nilai yang sama. Tingkat signifikansi ditetapkan sebesar 0,05. Hasil dilaporkan dalam bentuk p-value, selisih performa, interval kepercayaan 95%, dan effect size. Karena data dianalisis secara berpasangan, pengujian homogenitas varians antara Vue dan Svelte tidak diperlukan.

## 9. Jawaban Saat Seminar atau Sidang

### Jawaban utama

> Saya tidak memilih uji berdasarkan hasil mana yang paling menguntungkan, tetapi berdasarkan desain eksperimen dan karakteristik datanya. Setiap run Vue dipasangkan dengan run Svelte pada kondisi yang sama, sehingga analisis utamanya menggunakan uji berpasangan. Mean dan standard deviation digunakan untuk menunjukkan rata-rata dan konsistensi antar-run, sedangkan median dan IQR tetap dilaporkan karena data performa dapat mengandung outlier. Normalitas diperiksa pada selisih setiap pasangan untuk menentukan apakah paired t-test layak digunakan. Jika selisih tidak normal, digunakan Wilcoxon signed-rank; jika terdapat banyak nilai nol atau ties, digunakan sign test atau paired permutation test. Uji homogenitas tidak diperlukan karena penelitian ini tidak membandingkan dua sampel independen. Karena lima metrik Lighthouse diuji, koreksi Holm digunakan agar risiko false positive tidak membesar. P-value juga dilengkapi effect size dan confidence interval agar hasil menjelaskan besar dan presisi perbedaan, bukan hanya signifikansinya.

### Jawaban singkat untuk pertanyaan lanjutan

- **Mengapa menggunakan mean dan standard deviation?** Mean menunjukkan performa rata-rata dari pengukuran berulang, sedangkan standard deviation menunjukkan kestabilan atau variasi antar-run. Nilai rata-rata yang baik tetapi sangat tidak stabil perlu ditafsirkan dengan hati-hati.
- **Mengapa median dan IQR juga dilaporkan?** Keduanya lebih tahan terhadap outlier dan distribusi miring yang dapat muncul pada pengukuran performa browser.
- **Mengapa memakai Shapiro-Wilk?** Shapiro-Wilk digunakan untuk memeriksa asumsi normalitas sebelum paired t-test. Karena desainnya berpasangan, yang diperiksa adalah distribusi `d_i = Vue_i - Svelte_i`, bukan distribusi Vue dan Svelte secara terpisah. Q-Q plot tetap digunakan karena keputusan tidak sebaiknya hanya bergantung pada satu p-value normalitas.
- **Mengapa memakai paired t-test?** Karena satu hasil Vue memiliki pasangan hasil Svelte yang diukur pada blok kondisi yang sama. Uji ini menguji apakah rata-rata selisih pasangan berbeda dari nol.
- **Mengapa memakai Wilcoxon signed-rank?** Uji ini merupakan alternatif nonparametrik untuk data berpasangan ketika distribusi selisih tidak cukup normal. Uji ini membandingkan arah dan peringkat besar selisih pasangan.
- **Mengapa memakai sign test atau paired permutation test?** Metrik seperti CLS atau TBT dapat memiliki banyak nilai nol atau nilai sama. Kondisi tersebut dapat mengganggu perankingan Wilcoxon, sehingga uji yang lebih sesuai terhadap ties dipilih.
- **Mengapa tidak memakai Mann-Whitney?** Mann-Whitney ditujukan untuk dua sampel independen, sedangkan run Vue dan Svelte dalam penelitian ini dipasangkan berdasarkan blok kondisi pengujian.
- **Mengapa tidak memakai uji homogenitas?** Homogenitas varians merupakan asumsi pada uji tertentu untuk sampel independen. Paired t-test bekerja terhadap satu kumpulan selisih pasangan, sehingga tidak mensyaratkan kesamaan varians Vue dan Svelte.
- **Mengapa memakai taraf signifikansi 0,05?** Nilai ini ditetapkan sebelum analisis sebagai batas risiko kesalahan tipe I yang diterima, yaitu maksimal 5% untuk menolak hipotesis nol ketika sebenarnya benar. Nilai ini adalah konvensi, bukan bukti mutlak.
- **Mengapa memakai koreksi Holm?** Lima metrik menghasilkan beberapa pengujian sekaligus. Tanpa koreksi, peluang menemukan hasil signifikan secara kebetulan meningkat. Holm mengendalikan risiko tersebut dan lebih kuat daripada koreksi Bonferroni biasa.
- **Mengapa p-value tidak cukup?** P-value hanya memberi informasi mengenai ketidakselarasan data dengan hipotesis nol. Effect size menjelaskan besar perbedaan, sedangkan confidence interval menunjukkan rentang nilai perbedaan yang masih masuk akal.
- **Bagaimana jika hasilnya tidak signifikan?** Kesimpulannya adalah belum terdapat bukti statistik yang cukup untuk menyatakan perbedaan, bukan bahwa kedua framework pasti identik. Besar efek, confidence interval, variasi data, dan keterbatasan jumlah pengulangan tetap harus dibahas.

## Referensi

- Fahreza, N., Kharisma, A.P., dan Marji (2025), [*Analisis Perbandingan Performa Rendering Next.js dan SvelteKit pada Aplikasi E-commerce Berdasarkan Metrik Web Vitals*](https://j-ptiik.ub.ac.id/index.php/j-ptiik/article/view/15494/6870). Salinan lokal tersedia pada `docs/15494.pdf`.
- NIST, [Shapiro-Wilk Test for Normality](https://www.itl.nist.gov/div898/handbook/prc/section2/prc213.htm).
- NIST, [Bartlett's Test](https://itl.nist.gov/div898/handbook/eda/section3/eda357.htm).
- NIST, [Two-Sample t-Test for Equal Means](https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm).
- SciPy, [Mann-Whitney U Test](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html).
- Google, [Web Vitals](https://web.dev/articles/vitals).
