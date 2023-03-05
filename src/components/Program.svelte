
<script lang="ts">
	import { programParams, metaParams } from "../stores.js";
	
 	import { onMount } from "svelte";
	import { Scene } from "../scene.js";
	import { ODE } from "../types/ODE.js";
	
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

		if($programParams.vRange[0] < $programParams.vRange[1] && $programParams.vStep > 0)
        {
            let s = $programParams.v + $programParams.vStep;

			$programParams.v = (s <= $programParams.vRange[1]) ? s : $programParams.vRange[0];
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