
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from "svelte";
	export let id:string;
	export let val:number;
	export let range:number[];
	let progress = 40;
	let component:HTMLDivElement;
	let IsMouseDown:boolean = false;
	let disabled = false;


	function mouseDown(e:MouseEvent){
		if(!disabled)
		{
			IsMouseDown = true;
			document.addEventListener("mousemove", mouseMove);
			document.addEventListener("mouseup", cleanUp);
		}
	}

	// remove event listeners
	function cleanUp()
	{
		document.removeEventListener("mousemove", mouseMove)
		document.removeEventListener("mouseup", cleanUp)
	}

	function mouseMove(e:MouseEvent) {
		const pos = e.clientX - component.offsetLeft;
		if(pos < 0)
			progress = 0;
		else if(pos > component.clientWidth)
			progress = 100;
		else
			progress = 100*(pos)/component.clientWidth;
		val = (progress/100) * Math.abs(range[0]-range[1]) + range[0];
	}

	$:{
		if(val < range[0] || val > range[1])
			val = range[0];
		disabled = range[0] >= range[1];
		if(disabled)
		{
			val = range[0];
			progress = 0;
		}
		progress = ((val-range[0])/(Math.abs(range[0]-range[1])))*100;
	}

</script>


<div bind:this={component} on:mousedown={mouseDown} class={`range-container ${disabled && "disabled"}`} style={`--progress:${progress}%;`}>
	<div class="relative flex w-full">
		<button class="knob"/>
	</div>
	<div class="range">
		<div/>
	</div>
</div> 
<input bind:value={val} hidden type="number" id={id}/>

<style>




.range-container{
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: center;
	position: relative;
	width: 100%;
	align-items: center;
}
.range{
	height: 10px;
	width: 100%;
	display: flex;
	position: relative;
	background-color: rgb(97, 97, 97);
	border-radius: 4px;
}

.range > div {
	display: flex;
	background-color: rgb(0, 170, 170);
	width: var(--progress);
	border-radius: 4px;
}



.range-container .knob{
	background-color: rgb(0, 219, 219);
	z-index: 1;
	border-radius: 4px;
	width: 20px;
	height: 20px;
	border: 1px rgba(123, 123, 123, 0.57) solid;
	position: absolute;
	top: -5px;
	left: calc(var(--progress) - 10px);
}

.range-container.disabled .knob {
	background-color: rgb(53, 53, 53);
	cursor:not-allowed;
}





</style>