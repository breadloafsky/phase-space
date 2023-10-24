
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
    import { onMount } from "svelte";
	let element:HTMLTextAreaElement;
	export let val:string = "";
	export let id:string;
	import { utils } from '../../utils.js';
	let oldVal:string|null = null;
	let timeout:NodeJS.Timeout;
	let parsedVal:any[] = [];

	const dispatch = createEventDispatcher();
	onMount(() => {
		update();
	});
	
	let error = false;
	let focused = false;
	function update()
	{
		
		parsedVal = utils.highlight(val);	// syntax highlight
		resize();
		try {
			error = true;
			let eq = new Function("x,y,z,v", "return " + utils.parse(val) ) as (x:number,y:number,z:number,v:number)=> number;
			if(typeof eq === 'function')
			{
				if(typeof eq(1, 1, 1, 1) == "number" && eq(1, 1, 1, 1) == eq(1, 1, 1, 1))	// check sample output
				{
					error = false;
					dispatch('change', {val:val});
					oldVal = val;
				}	
			}
			
		} catch (e) {
			console.log("Equation Error");
			error = true;
		}
	}
	$:{
		if(element && document.activeElement != element && val != oldVal)
		{
			clearTimeout(timeout);
			timeout = setTimeout(update,1);
		}
	}


	function resize()
	{
		element.style.height="auto";
		element.style.height = element.scrollHeight + "px";
	}

</script>

<div class={`equation ${error && "error"} ${focused && "focused"}`}>
	<span class="formatted">
		{#each parsedVal as v}
			<span style="{v.style}">{v.str}</span>
		{/each}
	</span>
	<textarea id={id} bind:this={element} bind:value={val} rows="1" cols="30" class="w-full" spellcheck="false" on:input={update} on:focus={()=>{update(); focused=true;}} on:blur={() => {val = val == "" ? "0" : val; focused=false}}  />
</div>


<style>
.equation{
	flex-grow: 1;
	width: 100%;
	padding: 2px;
	position: relative;
	padding-left:4px ;
	font-size: 16px;
	font-family: monospace;
}
.equation.focused{
	border: 1px white inset;
}
.equation textarea{
	width: 100%;
	padding: 0px;
	word-break: break-all;
	color:transparent;
	position: relative;
	z-index: 2;
	caret-color: white;
}

.equation .formatted{
	white-space:break-spaces;
	pointer-events: none;
	max-width: 100%;
	word-break: break-all;
	position: absolute;
	z-index: 0;
	
	
}

.equation.error textarea{
	
}
.equation.error {
	outline-style:inset !important;
	color:red !important;
}
.equation.error .formatted > * {
	color:red !important;
}
.equation:focus{
}

</style>