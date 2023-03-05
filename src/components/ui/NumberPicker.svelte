
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from "svelte";
	export let id:string;
	export let val:number;
	export let step:number = 1;
	export let round:number = 1;
	export let range:(number|boolean)[] = [false,false];	//	max and min
	let mouseDown:number|boolean = false;
	var timer:number|any = 0;
	export let incrementGrowth = 1;
	var incrementModifyer = 1;
	const dispatch = createEventDispatcher<{change:{val:number}}>();
	onMount(() => {
		update();
	});


	function increment(positive:boolean=true)
	{
		const newVal = val + step * (positive ? 1 : -1) * incrementModifyer;
		val = newVal;
		incrementModifyer *= incrementGrowth;
		if(mouseDown)
			timer = setTimeout(() => increment(positive), 200/incrementModifyer);
		update();
	}

	// stop incrementation
	function stop()
	{
		clearTimeout(timer);
		incrementModifyer = 1;
		mouseDown = false;
	}


	function update()
	{
		val = Math.round(val*round)/round;
		if(!(range[1] !== false ? val <= range[1] : true))
			val = range[1] as number;
		if (!(range[0] !== false ? (val >= range[0]) : true))
			val = range[0] as number;
		dispatch('change', {val:val});
	}
	$:{
		if(val)
			update()
		
	}


</script>


<div class="input-container">
	<input bind:value={val} type="number" class="input" id={id} />
	<div class="btn-container ">
		<button class="btn" on:mousedown={() =>{mouseDown=true; increment();}} on:mouseup={() => stop()} on:mouseleave={() => stop()}><div class="icon bg-neutral-500" style="--icon:{`url(/ui/arrow-up.svg)`}"/></button>
		<button class="btn" on:mousedown={() =>{mouseDown=true; increment(false);}} on:mouseup={() => stop()} on:mouseleave={() => stop()}><div class="icon bg-neutral-500" style="--icon:{`url(/ui/arrow-down.svg)`}"/></button>
	</div>
</div>


<style>

.input-container{
	display: flex;
	width: 100%;
}
.input{

	@apply  py-0.5 px-2;
	width: 100%;
	max-height: 2em;
	background-color: rgb(38 38 38);
}
.icon {
	max-height: 1em;
	width: 100%;
	height: 10px;
}

.btn-container{
	display: flex;
	flex-direction: column;
	max-height: 2em;
	max-width: 25px;
	min-width: 25px;
	height: auto;
}

.btn-container > button{
	height: 100%;
}


</style>