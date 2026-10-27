# Brief Perhitungan dan Alasan Penggunaan Uji Statistik

## Rancangan Lighthouse berpasangan

Setiap blok pengujian memuat satu run VueJS dan satu run Svelte pada mesin, route, build, browser, viewport, throttling, cache policy, API, dataset, dan aset yang sama. Kedua report diberi `pair_id` yang sama saat dikumpulkan. Urutan framework dibalik selang-seling antarblok. Nomor run dari dua batch terpisah tidak boleh dianggap pasangan.

Data utama berisi 20 blok lengkap pada route `/`, sehingga ada 20 selisih pasangan per metrik. Run pilot tidak dicampur ke data utama. Seluruh run merupakan replikasi teknis pada konfigurasi ini, bukan sampel perangkat atau pengguna.

## Alur analisis

1. Laporkan statistik deskriptif VueJS dan Svelte secara terpisah: `n`, mean, SD, median, kuartil, IQR, minimum, dan maksimum.
2. Untuk setiap blok dan metrik, hitung `d_i = Vue_i - Svelte_i`. Mean selisih `d_i` sama dengan selisih mean kedua framework jika semua pasangan lengkap.
3. Periksa distribusi `d_i` dengan Shapiro-Wilk dan Q-Q plot. Jika cukup mendekati normal, gunakan uji t berpasangan dua arah. Jika tidak normal atau konstan, gunakan uji permutasi berpasangan dua arah.
4. Pada uji permutasi, tukar label VueJS/Svelte hanya di dalam pasangan, setara dengan membalik tanda setiap `d_i`. Gunakan 100.000 permutasi. Asumsinya label dapat dipertukarkan di dalam pasangan di bawah hipotesis nol.
5. Hitung interval kepercayaan 95% mean selisih dengan bootstrap percentile 20.000 kali, mengambil ulang pasangan utuh.
6. Laporkan Cohen `d_z = mean(d_i) / SD(d_i)` bila SD selisih tidak nol. Jika seluruh selisih identik, ukuran efek terstandar tidak terdefinisi.
7. Sesuaikan lima nilai p metrik utama menggunakan prosedur Holm. Keputusan akhir menggunakan `p_Holm < 0,05` dan dibaca bersama besar serta interval selisih.

Hipotesis untuk setiap metrik adalah `H0: mean selisih pasangan = 0` melawan `H1: mean selisih pasangan != 0`. Nilai `d_i > 0` berarti VueJS memiliki nilai metrik lebih tinggi; untuk FCP, LCP, Speed Index, TBT, dan CLS, nilai lebih rendah lebih baik.

## Mengapa berpasangan

Pemasangan berdasarkan blok pengumpulan membuat perubahan kondisi pengujian dari waktu ke waktu lebih mungkin memengaruhi kedua framework dalam blok yang sama. Analisis menggunakan variasi selisih antarblok, bukan variasi dua batch yang terpisah. Penyeimbangan urutan mengurangi pengaruh urutan, tetapi tidak menjamin semua pengaruh waktu atau sistem hilang. Inferensi tetap dibatasi pada konfigurasi laboratorium yang diuji.

Holt dan Sullivan (2023) membahas uji permutasi khusus pasangan serta penggunaan vektor selisih sebagai dasar analisis. Dokumentasi SciPy menjelaskan bahwa uji permutasi untuk sampel berpasangan mempertahankan korespondensi observasi dan menukar label di dalam pasangan. Shatz (2024) mendukung pemeriksaan asumsi dengan gabungan uji dan visualisasi. Guillermou et al. (2024) membahas prosedur Holm untuk beberapa hipotesis; Phillips et al. (2022) menekankan pelaporan interval dan ukuran efek bersama nilai p.

## Evaluasi UX

UX tetap deskriptif. Setiap responden mencoba kedua prototipe dengan urutan A–B atau B–A yang diseimbangkan, menjalankan Think Aloud pada masing-masing prototipe, dan mengisi UEQ segera setelah masing-masing rangkaian tugas. Enam skala UEQ diringkas untuk setiap prototipe; selisih skor dalam pasangan responden diringkas menurut arah dan mean tanpa uji signifikansi VueJS–Svelte.

## Jawaban singkat saat seminar atau sidang

> Satu pasangan Lighthouse terdiri atas run VueJS dan Svelte yang dikumpulkan dalam satu blok dengan kondisi yang sama. Saya menghitung selisih VueJS dikurangi Svelte per blok. Normalitas diuji pada selisih tersebut. Jika selisih mendekati normal, digunakan uji t berpasangan; jika tidak, label hanya ditukar di dalam pasangan pada uji permutasi. Interval kepercayaan diperoleh dengan mengambil ulang pasangan utuh, dan lima nilai p dikoreksi dengan Holm. UX dilaporkan secara deskriptif.

## Referensi

- [SciPy, *permutation_test*](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.permutation_test.html).
- [SciPy, *ttest_rel*](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_rel.html).
- Holt, C.A. dan Sullivan, S.P. (2023), [*Permutation tests for experimental data*](https://doi.org/10.1007/s10683-023-09799-6).
- Shatz, I. (2024), [*Assumption-checking rather than (just) testing*](https://doi.org/10.3758/s13428-023-02072-x).
- Guillermou, H. et al. (2024), [*Multiple hypothesis testing in allergy and hypersensitivity diseases investigation*](https://doi.org/10.1016/j.jahd.2024.100014).
- Phillips, M.R. et al. (2022), [*The clinician's guide to p values, confidence intervals, and magnitude of effects*](https://doi.org/10.1038/s41433-021-01863-w).
