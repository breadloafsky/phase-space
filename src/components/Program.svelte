
<script lang="ts">
	import { programParams, metaParams } from "../stores.js";
	
 	import { onMount } from "svelte";
	import { Scene } from "../scene.js";
	import { ODE } from "../types/ODE.js";
	
    let canvas:HTMLCanvasElement;
	let ode:ODE;
	let scene:Scene;
	let loading = true;
	onMount(() => {
		ode = new ODE();
		programParams.subscribe(p => Object.assign(ode.params, p) );
		scene = new Scene(canvas, ode);
		requestAnimationFrame(update);
		loading = false;
  	});

	function update(){
		requestAnimationFrame(update);

		let range = $programParams.vRange;
		let step = $programParams.vStep;
		let v = $programParams.v;

		if(range[0] < range[1] && step > 0)
        {
            let s = $programParams.v + $programParams.vStep * Math.abs(range[1] - range[0]) / 100;
			$programParams.v = (s <= range[1]) ? s : range[0];
        }

		if($metaParams.needsUpdate)
		{
			ode.sets = [];
			$metaParams.needsUpdate = false;
		}
		ode.update();
		scene.drawScene();
		
	}
 
</script>

<div class="canvas-container">
	<div class="loading {!loading && "hidden"}">

	</div>
	<canvas
		aria-hidden="true"
		bind:this={canvas} 
	/>
	
</div>

<style>

	.canvas-container {
		display: flex;
		justify-content: center;
        /* background-color: black;  */
		background-color: black;
        min-height: 100%;
        width: 100%;
        z-index: -1;
        overflow: hidden;
        position: fixed;
    }

	canvas{
		width: 100%;
		height: 100%;
	}
	.loading{
		position: absolute;
		align-self: center;
		width: 20vh;
		height: 20vh;
		border: 16px solid #000000; 
		border-top: 16px solid #636363; 
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>