
<script lang="ts">
    import { onMount } from "svelte";
	import Icon from "./Icon.svelte";
	let pin:HTMLButtonElement;
	let parent:HTMLElement;

	function toggle(){
		parent.dataset["pinned"] = parent.dataset["pinned"] == "true" ? "false" : "true";
	}
	onMount(() => {
		let el = pin as HTMLElement;
		while ((el = el.parentElement as HTMLElement) && !((el.matches).call(el,".controls-bar")));
    	parent = el;
  	});


</script>

<button on:click={toggle} bind:this={pin} class="pin self-center" title="pin / unpin"><div class="icon"><Icon name="pin" color="black"/></div> </button>

<style>

:global(.controls-bar) .pin > .icon { 
	transition:all 0.1s;
	width: 100%;
	height: 100%;
}

:global(.controls-bar[data-pinned="true"]) .pin > .icon { 
	transform:   rotate(-45deg) ;
	
}
.pin {

	background-color: rgba(163, 163, 163, 0.486);
	width: 24px;
	height: 24px;
	clip-path: circle(50%);	/* to remove svg rotation artifacts */
}

</style>