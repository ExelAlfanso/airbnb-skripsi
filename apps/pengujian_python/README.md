# Pengujian Python

Notebook `analisis_pengujian.ipynb` membaca 20 pasangan report dari `artifacts/lighthouse/paired/manifest.json`. Setiap pasangan memiliki satu report VueJS dan satu report Svelte dengan `pair_id` yang sama. Run dari dua batch lama tidak digunakan untuk inferensi berpasangan.

Jalankan dari root repository atau folder ini:

```powershell
uv sync
uv run python -m jupyterlab analisis_pengujian.ipynb
```

Notebook melaporkan statistik deskriptif tiap framework. Untuk FCP, LCP, Speed Index, TBT, dan CLS, notebook menghitung selisih per pasangan (`vue_i - svelte_i`), memeriksa normalitas selisih, menjalankan uji t berpasangan atau permutasi berpasangan, menghitung interval bootstrap dengan pengambilan ulang pasangan utuh, Cohen `d_z`, dan koreksi Holm.

Pilih kernel `Python (pengujian_python)` di VS Code atau JupyterLab agar dependensi project tersedia. Report React tidak masuk dalam perbandingan utama VueJS–Svelte.
