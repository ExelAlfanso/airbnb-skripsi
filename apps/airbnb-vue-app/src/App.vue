<template>
  <main class="app-shell">
    <section class="intro">
      <p>airbnb Skripsi</p>
      <h1>Vue app is ready.</h1>
    </section>
  </main>
</template>

<style scoped>
.app-shell {
  display: grid;
  place-items: center;
  min-height: 100vh;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  color: #1f2933;
  background: #f7f7f2;
}

.intro {
  width: min(100% - 32px, 720px);
}

p {
  margin: 0 0 12px;
  font-size: 0.95rem;
  color: #58606a;
}

h1 {
  margin: 0;
  font-size: clamp(2.25rem, 6vw, 4.5rem);
  line-height: 1;
}
</style>
