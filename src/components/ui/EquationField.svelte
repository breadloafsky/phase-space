
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
    import { onMount } from "svelte";
	let element:HTMLTextAreaElement;
	export let val:string = "";
	export let id:string;
	let timeout:NodeJS.Timeout;
	const dispatch = createEventDispatcher();
	onMount(() => {
		update();
	});
	
	let error = false;
	function update()
	{
		resize();
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
		{
			clearTimeout(timeout);
			timeout = setTimeout(update,1);
		}
			
	}

	function parse(str:string){
		str = str.replace(/([A-z])\w+/g, 'Math.$&');
		return str;
	}

	function resize()
	{
		element.style.height="auto";
		element.style.height = element.scrollHeight + "px";
	}

</script>

<div class="flex-grow">
	<textarea id={id} bind:this={element} bind:value={val} rows="1" cols="30"  class={`equation ${error && "error"}`}  on:input={update} on:focus={update} on:blur={() => val = val == "" ? "0" : val}  />
</div>


<style>
.equation{
	min-height: 2em;
	width: 100%;
	padding: 0px;
	padding-left:4px ;
	word-break: break-all;
}
.equation.error{
	outline-style:inset !important;
	color:red;
}

.equation:focus{
	
}

</style>