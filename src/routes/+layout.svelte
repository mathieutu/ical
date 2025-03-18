<script>
  let { children } = $props();
  import "../app.css";
</script>
{@render children()}

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
