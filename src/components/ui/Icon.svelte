
<script lang="ts">
    import { onMount } from "svelte";
	export let color = "dimgray";
	export let name = "";
	
</script>

<div class="icon" style={`--icon: url("/ui/${name}.svg"); background-color:${color};`}/>

<style>

.icon {
    mask: var(--icon) no-repeat center;
    -webkit-mask: var(--icon) no-repeat center;
    height: 100%;
    width: 100%;
}

</style>