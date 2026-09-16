# Lighthouse Workbench

Dashboard React lokal untuk membaca report JSON yang dihasilkan Lighthouse CI.
Semua parsing dilakukan di browser; artifact tidak diunggah ke server.

```sh
pnpm dev:lighthouse-dashboard
```

Buka `http://localhost:3003`, lalu pilih folder `artifacts/lighthouse`. Report
Vue dan Svelte ditampilkan sebagai treatment penelitian, sementara React selalu
diberi label reference dan tidak dicampurkan ke kesimpulan Vue-versus-Svelte.
