
<script lang="ts">
	import { programParams, metaParams } from "../stores.js";
	
 	import { onMount } from "svelte";
	import { Scene } from "../scene.js";
	import { ODE } from "../types/ODE.js";
    import Range from "./ui/Range.svelte";
	
    let canvas:HTMLCanvasElement;
	let ode:ODE;
	let scene:Scene;

	onMount(() => {
		ode = new ODE();
		programParams.subscribe(p => Object.assign(ode.params, p) );
		scene = new Scene(canvas, ode);
		requestAnimationFrame(update);
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
	<canvas
		aria-hidden="true"
		bind:this={canvas} 
	/>
</div>

<style>

	.canvas-container {
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
</style>