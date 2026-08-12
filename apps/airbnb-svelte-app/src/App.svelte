<script lang="ts">
  import PropertyExplorer from "./components/PropertyExplorer.svelte";
</script>

<PropertyExplorer />

<style>
  :global(:root) {
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
    background:
      radial-gradient(circle at 85% 5%, rgb(225 77 90 / 10%), transparent 24rem),
      #f7f6f2;
  }

  :global(button),
  :global(input),
  :global(select) {
    font: inherit;
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
    outline: 3px solid color-mix(in srgb, var(--brand) 32%, transparent);
    outline-offset: 3px;
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
