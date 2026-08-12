<template>
  <PropertyExplorer />
</template>

<script setup lang="ts">
  import PropertyExplorer from "./components/PropertyExplorer.vue";
</script>

<style>
  :root {
    --ink: #202326;
    --muted: #666d73;
    --surface: #ffffff;
    --surface-soft: #efeee9;
    --border: #deddd7;
    --border-strong: #b9b8b2;
    --brand: #e14d5a;
    --brand-dark: #a92f3c;
    --brand-soft: #ffe1e4;
    --shadow-sm: 0 0.45rem 1.4rem rgb(39 34 28 / 7%);
    --shadow-md: 0 0.8rem 2rem rgb(39 34 28 / 12%);
    --shadow-lg: 0 1.2rem 3rem rgb(39 34 28 / 14%);
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    font-synthesis: none;
    color: #202326;
    background: #f7f6f2;
    text-rendering: optimizeLegibility;
  }

  * {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
    scroll-behavior: smooth;
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    background:
      radial-gradient(circle at 85% 5%, rgb(225 77 90 / 10%), transparent 24rem),
      #f7f6f2;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
    border: 0;
  }

  button:disabled,
  input:disabled,
  select:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }

  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  summary:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--brand) 32%, transparent);
    outline-offset: 3px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
    clip: rect(0, 0, 0, 0);
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      transition-duration: 0.01ms !important;
    }
  }
</style>
