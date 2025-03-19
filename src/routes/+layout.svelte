<script>
  let { children } = $props()
  import '../app.css'
</script>

{@render children()}

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    @apply bg-gray-50;
  }

  :global(.input, .select) {
    @apply w-auto focus-within:outline-none focus:outline-none;
  }
</style>
