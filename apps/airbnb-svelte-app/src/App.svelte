<script lang="ts">
  import PropertyExplorer from "./components/PropertyExplorer.svelte";
</script>

<PropertyExplorer />

<style>
  :global(:root) {
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
      ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
    font-synthesis: none;
    color: var(--ink);
    color-scheme: light;
    background: var(--surface);
    text-rendering: optimizeLegibility;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(html) {
    min-width: 320px;
    scroll-behavior: smooth;
  }

  :global(body) {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    overflow-x: hidden;
    background: var(--surface);
  }

  :global(button),
  :global(input),
  :global(select) {
    font: inherit;
  }
  :global(button),
  :global(a),
  :global(input),
  :global(select),
  :global(summary) {
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgb(255 56 92 / 16%);
  }

  :global(button) {
    cursor: pointer;
    border: 0;
  }

  :global(button:disabled),
  :global(input:disabled),
  :global(select:disabled) {
    cursor: not-allowed;
    opacity: 0.62;
  }

  :global(button:focus-visible),
  :global(a:focus-visible),
  :global(input:focus-visible),
  :global(select:focus-visible),
  :global(summary:focus-visible) {
    outline: 3px solid color-mix(in srgb, var(--focus) 45%, transparent);
    outline-offset: 2px;
  }

  :global(.sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
    clip: rect(0, 0, 0, 0);
  }

  :global(::selection) {
    color: var(--ink);
    background: var(--brand-soft);
  }

  :global(h1[id]),
  :global(h2[id]) {
    scroll-margin-top: 2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(html) {
      scroll-behavior: auto;
    }

    :global(*),
    :global(*::before),
    :global(*::after) {
      transition-duration: 0.01ms !important;
    }
  }
</style>
