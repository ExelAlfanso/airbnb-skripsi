# Pengujian Python

Environment notebook untuk analisis statistik berpasangan hasil pengujian VueJS dan Svelte.

```powershell
uv sync
uv run jupyter lab analisis_pengujian.ipynb
```

Data Lighthouse dapat disimpan sebagai `data/lighthouse_runs.csv` dengan satu baris untuk setiap blok berpasangan dan kolom berikut:

```text
block_id,scenario,metric,vue,svelte
```

Nilai `vue` dan `svelte` harus berasal dari metrik, skenario, dan kondisi eksperimen yang sama. Notebook menghitung `d_i = vue - svelte`; jangan masukkan pengukuran React ke analisis utama VueJS–Svelte.

