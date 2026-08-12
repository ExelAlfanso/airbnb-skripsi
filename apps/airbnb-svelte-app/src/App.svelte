<main>
  <section>
    <p>airbnb Skripsi</p>
    <h1>Svelte app is ready.</h1>
  </section>
</main>

<style>
  main {
    display: grid;
    place-items: center;
    min-height: 100vh;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    color: #202832;
    background: #f3f6f8;
  }

  section {
    width: min(100% - 32px, 720px);
  }

  p {
    margin: 0 0 12px;
    font-size: 0.95rem;
    color: #66717d;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.25rem, 6vw, 4.5rem);
    line-height: 1;
  }
</style>
