
<script lang="ts">
    import { onMount } from "svelte";
    import { claim_text } from "svelte/internal";

	export let val:number[] = [];
	let oldval:number[] = []
	let canvas:HTMLCanvasElement;
	let ctx:CanvasRenderingContext2D;
	let history:any[] = []
	let maxVal = 10



	onMount(() => {
		let context = canvas.getContext('2d');
		if(context){
			ctx = context;
			ctx.fillStyle = "white";
			ctx.fillRect(0,0,canvas.width,canvas.height)
		}
  	});

	$: if(val && ctx){
		oldval = val
		ctx.fillStyle = "white";
		ctx.clearRect(0,0,canvas.width,canvas.height)
		let size = { x:canvas.width, y:canvas.height}
		val.forEach(e =>{
			if(e > maxVal)
				maxVal = e
			ctx.fillRect(size.x*(0.9),size.y*(e/maxVal),size.x,size.y/(maxVal))
		})
	}

	function shift(){
		history.push(oldval)
		if(history.length > 100){
			history.pop()
		}
		Math.max()
	}

</script>

<div class="canvas-container">
	
	<canvas 
		aria-hidden="true"
        
        bind:this={canvas}  
        
	/>
	<!-- style="width:{dimensions.x}px; height:{dimensions.y}px;"
		width={dimensions.x}
        height={dimensions.y} -->
</div>

<style>





.canvas-container {
	display: flex;
	justify-content: center;
	background-color: transparent;
	min-height: 100%;
	width: 100%;
	z-index: -1;
	overflow: hidden;
}

canvas{
	width: 100%;
	height: 100%;
}

</style>