<template>
  <PropertyExplorer />
</template>

<script setup lang="ts">
  import PropertyExplorer from "./components/PropertyExplorer.vue";
</script>

<style>
  :root {
    --ink: #222222;
    --muted: #6a6a6a;
    --surface: #ffffff;
    --surface-soft: #f7f7f7;
    --border: #e5e5e5;
    --border-strong: #b0b0b0;
    --brand: #ff385c;
    --brand-dark: #c13515;
    --brand-soft: #fff0f3;
    --focus: #1769aa;
    --shadow-sm: 0 1px 2px rgb(0 0 0 / 8%);
    --shadow-md: 0 0.5rem 1.5rem rgb(0 0 0 / 12%);
    --shadow-lg: 0 0.75rem 2rem rgb(0 0 0 / 12%);
    font-family:
      ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    font-synthesis: none;
    color: var(--ink);
    color-scheme: light;
    background: var(--surface);
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
    overflow-x: hidden;
    background: var(--surface);
  }

  button,
  input,
  button,
  a,
  input,
  select,
  summary {
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgb(255 56 92 / 16%);
  }

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
    outline: 3px solid color-mix(in srgb, var(--focus) 45%, transparent);
    outline-offset: 2px;
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

  ::selection {
    color: var(--ink);
    background: var(--brand-soft);
  }

  h1[id],
  h2[id] {
    scroll-margin-top: 2rem;
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
