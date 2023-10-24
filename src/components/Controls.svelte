
<script lang="ts">
	import { onMount } from "svelte";
	import Range from "./ui/Range.svelte";
	import { programParams, metaParams } from "../stores.js";
	import Icon from "./ui/Icon.svelte";
	import Select from "./ui/Select.svelte";
	import NumberPicker from "./ui/NumberPicker.svelte";
	import Switch from "./ui/Switch.svelte";
	import Pin from "./ui/Pin.svelte";
	import Section from "./ui/Section.svelte";
	import EquationField from "./ui/EquationField.svelte";
    import Presets from "./sections/Presets.svelte";
    import Equations from "./sections/Equations.svelte";
    import Integration from "./sections/Integration.svelte";
    import DimMapping from "./sections/DimMapping.svelte";
    import SetProperties from "./sections/SetProperties.svelte";
    import SpawnPos from "./sections/SpawnPos.svelte";
    import CamTarget from "./sections/CamTarget.svelte";
	//import Bifurcation from "./ui/Bifurcation.svelte";
	
	let mouseDown:number|boolean = false;
	
	export let mobile:boolean;
	

	
	
	// update the camera
	let previousTouch:any = {x:0,y:0};
	function mouseMove(e:MouseEvent|TouchEvent|any){
		const moveStep = window.innerHeight < window.innerWidth ? window.innerWidth : window.innerHeight;
		if(mouseDown !== false)
		{
			let movementX = 0; 
			let movementY = 0;
			if(e.type == "mousemove")
			{
				movementX = e.movementX;
				movementY = e.movementY;
			}
			else if(e.type == "touchmove")
			{
				movementX = (e.touches[0].pageX-previousTouch.x);
				movementY = (e.touches[0].pageY-previousTouch.y);
				previousTouch.x = e.touches[0].pageX;
				previousTouch.y = e.touches[0].pageY;
			}
			programParams.update(p => {
				let t = p.cameraTarget;
				let pitch = p.cameraPitch;
				let yaw = p.cameraYaw;
				// rotate the camera around the target (vertically and horizontally)
				if (mouseDown === 0) {
					let a = yaw + movementX*6/moveStep;
					yaw = (a + Math.PI * 2 ) % (Math.PI*2);
					a = pitch - movementY*6/moveStep;
					pitch =  Math.abs(a) > Math.PI/2 ? pitch : a;
				}
				// move the camera target
				else if (mouseDown === 2) {
					const moveX = p.cameraDistance * movementX/moveStep / 2;
					const moveY = p.cameraDistance * movementY/moveStep / 2;
					t[0] +=   moveX * Math.cos(p.cameraYaw- Math.PI/2) + Math.cos(p.cameraYaw) * Math.sin(p.cameraPitch) * -moveY;
					t[1] +=   Math.cos(p.cameraPitch) * moveY;
					t[2] +=   moveX * Math.sin(p.cameraYaw- Math.PI/2) + Math.sin(p.cameraYaw) * Math.sin(p.cameraPitch) * -moveY;
				}
				return {...p, cameraPitch:pitch, cameraYaw:yaw, cameraTarget:t};
			});
		}
	}
	// change the distance between the camera and the camera target
	function wheel(e:WheelEvent){
		programParams.update(p => {
			let s = p.cameraDistance;
			const a = s + s*Math.sign(e.deltaY)/10;
			return {...p, cameraDistance:a > 0.1 ? a : s};
		});
	}
	


</script>
	<div 
		class="controls" 
		on:mousemove={mouseMove} 
		on:touchmove={mouseMove}
		on:touchend={() => mouseDown = false}
		on:mouseup={() => mouseDown = false} 
		on:mouseleave={() => mouseDown = false} 
		>
		<div class="middle">
			<div class="controls-bar" data-pinned="true">
				<div class="flex justify-between flex-row-reverse">
					<div class="pl-2 self-center"><Pin/></div>
					<a href="https://github.com/breadloafsky/phase-space" class="flex text-sm">
						<div class="w-8 h-8 pr-2 self-center">
							<Icon name="github"/>
						</div> 
					</a>
				</div>
				<div>
					<!-- preset picker -->
					<Presets/>
					<!-- equations -->
					<Equations/>
					<!-- integration -->
					<Integration/>
					<!-- dimensional mapping -->
					<DimMapping/>
				</div>
			</div>
			<div class="flex flex-col w-full">
				<!-- <div class="controls-bar horizontal justify-between"  data-pinned="true">
					<div class="w-6 mx-3 my-1">
						<Pin />
					</div>
				</div> -->
				<div on:contextmenu={(e) => e.preventDefault()} on:touchstart={(e) => {previousTouch = {x:e.touches[0].clientX, y:e.touches[0].clientY}; mouseDown = (e.touches.length > 1 ? false : 0);}} on:mousedown={(e) => {mouseDown = e.button;}} on:wheel={wheel} class="scene grow"/>
			</div>
			
			<div class="controls-bar"  data-pinned="true">
				<div class="h-8 pr-2"><Pin/></div>
				<div>
					<!-- set properties -->
					<SetProperties/>
					<!-- set spawn positions -->
					<SpawnPos/>
					<!--camera target-->
					<CamTarget/>

					<!-- <Section label="Bifurcation Plot" >
						<div slot="tooltip">
							Bifurcation Plot
						</div>
						<div slot="body">
							<Bifurcation
								bind:val={$metaParams.bifurcation}
							/>
						</div>
					</Section> -->
				</div>
				
			</div>
		</div>
		<div class="controls-bar horizontal"  data-pinned="true">
			<div class="parameter-field">
				<label class="parameter-label  w-1/5" for="vMin">v min:</label>
				<div class="w-2/3 self-center">
					<NumberPicker 
						id={"vMin"}
						bind:val={$programParams.vRange[0]} 
						step={1} 
						round={10000}
						incrementGrowth={1.01}
					/>
				</div>
			</div>
			<div class="parameter-field w-full">
				<label class="parameter-label pr-2 italic" for="vInput" style="color:#d5a1ff">v</label>
				<div class="w-full">
					<Range
						id={"vInput"} 
						color="#bf71ff"
						bind:val={$programParams.v}
						range={$programParams.vRange}
					/>
				</div>
			</div>
			<div class="parameter-field">
				<label class="parameter-label w-1/5 " for="vMax">v max:</label>
				<div class="w-2/3  self-center">
					<NumberPicker 
						id={"vMax"}
						bind:val={$programParams.vRange[1]} 
						step={1} 
						round={10000}
						incrementGrowth={1.01}
					/>
				</div>
			</div>
			<div class="parameter-field w-1/2" >
				<label class="parameter-label pr-4" for="vChange">slider animation:</label>
				<div class="w-3/4">
					<Range
						color="rgb(27, 234, 156)"
						id={"vChange"} 
						bind:val={$programParams.vStep} 
						range={[0,1]}
					/>
				</div>
			</div>
			{#if !mobile}
			<div class="w-6 mx-3 my-1 self-center">
				<Pin />
			</div>
			{/if}
			
			
		</div>
	</div>
<style>

:global(.parameter-field){
	display: flex;
	padding-block: 4px;
	padding-inline: 4px;
	justify-content: space-between;
}
.parameter-label{
	min-width: 4rem;
	height: max-content;
	align-self: center;
	min-width: fit-content;
}

.controls{
	max-width: 100vw;
	height: 100%;
	display: flex;
	flex-direction: column;
	color: aliceblue;
	border-color: rgba(255, 235, 205, 0.158);
	justify-content: space-between;
}
.controls .scene{
	width: 100%;
	user-select: none;
}


.middle{
	flex-grow: 1;
	max-height: calc(100% - 60px);
	justify-content: space-between;
	display: flex;
}

.controls-bar{
	padding: 20px;
	transition: all 0.1s;
	display: flex;
	

}
:global(.main:not(.mobile)) .controls-bar{
	opacity: 0;	
}
:global(.main.mobile) .controls-bar  :global(.section){
	opacity: 0;
}
:global(.main.mobile) .controls-bar[data-pinned="true"]  :global(.section){
	opacity: 1;	
}

.middle > .controls-bar{
	overflow-y: hidden;
	flex-direction: column;
	min-width: 50px;
	max-width: 50px;
	overflow-x:hidden;
}

.middle > .controls-bar:nth-child(1){
	direction: rtl;
}
.middle > .controls-bar:nth-child(1) > div{
	direction: ltr;
}

.middle .controls-bar[data-pinned="true"] , :global(.main:not(.mobile)) .controls-bar:hover {
	min-width: var(--sidebar-size);
	overflow-y: scroll;
	opacity: 1 !important;
}


.controls-bar.horizontal {
	overflow-y: visible !important;
	min-height: 20px;
	padding: 10px;
	width: 100%;
}
.controls-bar.horizontal[data-pinned="true"] , :global(.main:not(.mobile)) .controls-bar.horizontal:hover {
	min-height: 60px;
	max-height: 60px;
	opacity: 1;
}
.controls-bar:hover{
	background-color: rgba(20, 20, 20);
}


</style>