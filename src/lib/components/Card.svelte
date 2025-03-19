<script lang="ts">
  interface Props {
    title: string
    children?: import('svelte').Snippet
  }

  let { title, children }: Props = $props()
</script>

<div class="card bg-base-100 w-full max-w-2xl shadow-sm">
  <div class="card-body">
    <h2 class="card-title text-center">{title}</h2>
    <div class="py-4">
      {@render children?.()}
    </div>
  </div>
</div>
