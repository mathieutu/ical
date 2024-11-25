<script lang="ts">
  export let title: string
</script>

  <div
    class="w-full max-w-2xl rounded-lg bg-white px-8 py-6 shadow-md dark:bg-gray-900"
  >
    <h2 class="mb-4 text-center text-2xl font-bold dark:text-gray-200">
      {title}
    </h2>
      <slot/>
    </div>
