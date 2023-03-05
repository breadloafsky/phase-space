
<script lang="ts">
    import { onMount } from "svelte";
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

<button on:click={toggle} bind:this={pin} class="pin"><div class="icon" style="--icon:{`url(/ui/pin.svg)`}; background-color:dimgray;"/></button>

<style>

:global(.controls-bar[data-pinned="true"]) .pin > .icon { 
	transform:   rotate(-45deg) ;
}
.pin {
	width: 24px;
	height: 24px;
	clip-path: circle(50%);	/* to remove svg rotation artifacts */
}
.pin > .icon{ 
	transition:all 0.1s;
}

</style>