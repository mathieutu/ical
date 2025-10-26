<script lang="ts">
    import type { FocusEventHandler } from "svelte/elements"

let open = $state(false);
let detailsEl: HTMLDetailsElement

const {children, ...props} = $props();


const handleFocusOut: FocusEventHandler<HTMLDetailsElement> = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null) 
    open = false
  }
</script>


<details bind:open {...props} bind:this={detailsEl} onfocusout={handleFocusOut} >
    {@render children()}
</details>