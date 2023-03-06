
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
    import { onMount } from "svelte";
	let element:HTMLDivElement|any;
	export let val:string = "";
	export let id:string;

	const dispatch = createEventDispatcher();
	onMount(() => {
		update();
	});
	
	let error = false;
	function update()
	{
		try {
				error = true;
				let eq = new Function("x,y,z,v", "return " + parse(val) ) as (x:number,y:number,z:number,v:number)=> number;
				if(typeof eq === 'function')
				{
					if(typeof eq(1, 1, 1, 1) == "number" && eq(1, 1, 1, 1) == eq(1, 1, 1, 1))	// check sample output
					{
						error = false;
						dispatch('change', {val:val});
					}	
				}
				
			} catch (e) {
				console.log("Equation Error");
				error = true;
			}
	}
	$:{
		
		if(element && document.activeElement != element && val)
			update();
	}

	function parse(str:string){
		str = str.replace(/([A-z])\w+/g, 'Math.$&');
		return str;
	}

</script>

<div class="flex-grow">
	<input id={id} bind:this={element} bind:value={val} type="text" style={`${error && "color:red"}`} class="equation " on:blur={update} />
</div>


<style>
.equation{
	@apply  py-0.5 px-2;
	min-height: 2em;
	width: 100%;
	background-color: rgb(38 38 38);
}

.equation:focus{
	color: yellow;
}

</style>