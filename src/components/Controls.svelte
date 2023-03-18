
<script lang="ts">
	import { onMount } from "svelte";
	import Range from "./ui/Range.svelte";
	import{ ProgramParams, MetaParams } from "../types/Params";
	import { programParams, metaParams } from "../stores.js";
	import Icon from "./ui/Icon.svelte";
	import Select from "./ui/Select.svelte";
	import NumberPicker from "./ui/NumberPicker.svelte";
	import Switch from "./ui/Switch.svelte";
	import Pin from "./ui/Pin.svelte";
	import Section from "./ui/Section.svelte";
	import EquationField from "./ui/EquationField.svelte";
	import presets from "../presets.json";

	let mouseDown:number|boolean = false;
	let presetIndex = 0;
	export let mobile:boolean;
	

	let fileInput:any;
	onMount(() => {
		setPreset(0);
	});

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
	// set preset
	function setPreset(n:number)
	{
		presetIndex = n;
		//	reset the parameters
		metaParams.update(n => new MetaParams());
		programParams.update(e => {return{...new ProgramParams(), ...structuredClone(presets[presetIndex])}});
	}


	// download the scene as a json
	function downloadScene() {
    	var file = new Blob([JSON.stringify({...$programParams,name:"Untitled"},null,"\t") as any], {type: "json"});
		var a = document.createElement("a"),
				url = URL.createObjectURL(file);
		a.href = url;
		a.download = "phase-space.json";
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}


	// set a custom preset
	function setCustom() {
    const file = fileInput.files[0];
    if (file) {
		const reader = new FileReader();
		reader.addEventListener("load", function () {
			metaParams.update(n => new MetaParams());
			programParams.update(e => {return{...new ProgramParams(), ...JSON.parse(reader.result as string)}});
		});
		reader.readAsText(file);
		return;
    } 
	alert("File error");

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
					<a href="https://github.com/ilgo1/phase-space" class="flex text-sm">
						<div class="w-8 h-8 pr-2 self-center">
							<Icon name="github"/>
						</div> 
					</a>
				</div>
				<div>
					<!-- preset picker -->
					<Section label="Preset" >
						<div slot="tooltip">
							Preset selection. 
							<br/>
							The scene parameters (including equations, point sets settings, camera position and etc.)
							<br/>
							 can be picked from the default presets, or uploaded from a file
							<br/>
							The current scene parameters can also be saved to a file
						</div>
						<div slot="body">
							<div>
								<div class="flex justify-center">
									<button class="btn w-6" style="border-radius: 4px;" on:click={() => setPreset((presetIndex+presets.length-1)%presets.length)}>{"<"}</button>
									<div class="px-4 w-20 text-center">{presetIndex+1}/{presets.length}</div>
									<button class="btn w-6" style="border-radius: 4px;" on:click={() => setPreset((presetIndex+1)%presets.length)}>{">"}</button>
								</div>
								<!-- <div class="flex justify-center"><Select/></div> -->
								<h2 class="text-center py-4 font-serif font-bold text-lg h-20">{presets[presetIndex].name}</h2>
							</div>
							<div class="parameter-field">
								<div class="flex">load user preset</div>
								<label class="custom-file-upload btn w-10 cursor-pointer" title="select file">
									<Icon name="folder"/>
									<input bind:this={fileInput} on:change={() => setCustom()} type="file" accept="application/JSON" hidden/>
								</label>
							</div>
							<div class="parameter-field">
								<div>save the current scene</div>
								<button 
								class="custom-file-upload btn w-10 border-0" 
								title="save current scene parameters to a file"
								on:click={() => downloadScene()}
								>
									<Icon name="save"/>
								</button>
							</div>
						</div>
					</Section>
					<!-- equations -->
					<Section label="Equations" >
						<div slot="tooltip">
							The system of ordinary differential equations
							<br/>
							Each equation has input of 3 dimensional variables (<span class="text-red-500 italic">x</span>, <span class="text-green-500 italic">y</span>, <span class="text-blue-500 italic">z</span>) that are individual for each point
							<br/>
							and 1 global variable <span class="text-purple-500 italic">v</span>, which can be controlled on the bottom bar.
							<br/>
							The equations can be modified in real time using JavaScript syntax (e.g., coefficients should be written as "2*x", instead of "2x").
							<br/>
							All the methods and properties of JavaScript <span class="text-sky-300 italic">Math</span> can be used, just without "Math." e.g., <span class="text-sky-300 italic">Math.</span><span class="text-yellow-200 italic">sin</span><span class="text-yellow-500 italic">()</span> {"->"}  <span class="text-sky-300 italic">sin</span><span class="text-yellow-500 italic">()</span>
						</div>
						<div slot="body">
							<div class="parameter-field"><label class="parameter-label italic pr-2" for="eqX">f'(x)=</label>
								<EquationField 
								id="eqX"
								bind:val={$programParams.equation.x} 
								on:change={(e) => $programParams.equation.x = e.detail.val}/>
							</div>
							<div class="parameter-field"><label class="parameter-label italic pr-2" for="eqY">f'(y)=</label>
								<EquationField 
								id="eqY"
								bind:val={$programParams.equation.y} 
								on:change={(e) => $programParams.equation.y = e.detail.val}/>
							</div>
							<div class="parameter-field"><label class="parameter-label italic pr-2" for="eqZ">f'(z)=</label>
								<EquationField 
								id="eqZ"
								bind:val={$programParams.equation.z} 
								on:change={(e) => $programParams.equation.z = e.detail.val}/>
							</div>
						</div>
						
					</Section>
					<Section label="Integration" >
						<div slot="tooltip">
							Integration settings
							<br/>
							4th order Runge–Kutta is used for integration
							<br/>
							<span class="italic">Δ</span> is the numerical step for integration
							<br/>
							<span class="italic">"shifts per frame"</span> is how many times the itegration is applied to sets each update 
							<br/>
							The integration process for sets can be paused/resumed by clicking the switch
						</div>
						<div slot="body">
							<div class="parameter-field"><label class="parameter-label italic" for="delta">Δ (step)</label>
								<div class="w-28">
									<NumberPicker 
									id="delta" 
									bind:val={$programParams.delta} 
									step={0.00001} 
									round={100000}
									incrementGrowth={1.1} />
								</div>
							</div>
							<div class="parameter-field">
								<label class="parameter-label" for="intStep">Shifts per frame</label>
								<div class="w-28">
									<NumberPicker 
									id={"intStep"}
									bind:val={$programParams.iterationStep} 
									step={1} 
									round={1}
									range={[1,1000]}
									/>
								</div>
							</div>
							<div class="parameter-field">
								<label class="parameter-label" for="integrate">Active Integration</label>
								<div class="w-20">
									<Switch
									id={"integrate"}
									bind:val={$programParams.integrate} 
									/>
								</div>
							</div>
						</div>
						
					</Section>
					<Section label="Dimensional Mapping" >
						<div slot="tooltip">
							The variables <span class="text-red-500 italic">x</span>, <span class="text-green-500 italic">y</span>, <span class="text-blue-500 italic">z</span> can be remapped for each dimension<br/>
							The coordinates grid has the step of 10
						</div>
						<div slot="body">
							<div class="flex flex-col justify-center ">
								<div class="flex justify-around h-10 pt-2">
									<label class=" w-6 h-6" for="dim0"><Icon name="dim-arrow0" color="white"/></label>
									<label class=" w-6 h-6" for="dim1"><Icon name="dim-arrow1" color="white"/></label>
									<label class=" w-6 h-6" for="dim2"><Icon name="dim-arrow2" color="white"/></label>
								</div>
								<div class="flex justify-around py-1">
									<div class="w-1/4">
										<Select
										id={"dim0"}
										options={["x","y","z"]}
										bind:val={$metaParams.dimMap[0]}
										on:change={(e) => { let s = $metaParams.dimMap.findIndex(v => v == e.detail.val); $metaParams.dimMap[s] = $metaParams.dimMap[0]; $metaParams.dimMap[0] = e.detail.val;}}
										/>
									</div>
										
									<div class="w-1/4">
										<Select
										id={"dim1"}
										options={["x","y","z"]}
										bind:val={$metaParams.dimMap[1]}
										on:change={(e) => { let s = $metaParams.dimMap.findIndex(v => v == e.detail.val); $metaParams.dimMap[s] = $metaParams.dimMap[1]; $metaParams.dimMap[1] = e.detail.val;}}
										/>
									</div>
									
									<div class="w-1/4">
										<Select
										id={"dim2"}
										options={["x","y","z"]}
										bind:val={$metaParams.dimMap[2]}
										on:change={(e) => { let s = $metaParams.dimMap.findIndex(v => v == e.detail.val); $metaParams.dimMap[s] = $metaParams.dimMap[2]; $metaParams.dimMap[2] = e.detail.val;}}
										/>
									</div>
									
								</div>
							</div>
							
							<div class="parameter-field mt-8">
								<label class="parameter-label" for="showGrid"><pre>{"Show the \ncoordinates plane"}</pre></label>
								<div class="w-20">
									<Switch
									id={"showGrid"}
									bind:val={$metaParams.showGrid} 
									/>
								</div>
							</div>
						</div>
						
					</Section>
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
					<Section label="Sets Properties" >
						<div slot="tooltip">
							The phase portrait is drawn by sets of points.
							<br/>
							Each set has its base coordinate, which is the initial condition for each point in the set.	
							<br/>
							"Size / Length" is the relationship between the point size and the point's location in the set.
							<br/>
							"Auto Respawn" is the automatic respawn of the sets
							<br/> 
							"Respawn Interval" is the average value for the auto respawn
						</div>
						<div slot="body">
							<div class="parameter-field">
								<label class="parameter-label" for="setNum">Number of Sets</label>
								<div class="w-24">
									<NumberPicker 
									id={"setNum"}
									bind:val={$programParams.setNum} 
									step={1} 
									round={1}
									range={[0,40000]}
									incrementGrowth={1.05}
									/>
								</div>
							</div>
							<div class="parameter-field">
								<label class="parameter-label" for="setLength">Set Length</label>
								<div class="w-24">
									<NumberPicker 
									id={"setLength"}
									bind:val={$programParams.setLength} 
									step={1} 
									round={1}
									range={[1,40000]}
									incrementGrowth={1.05}
									/>
								</div>
							</div>
							<div class="parameter-field">
								<label class="parameter-label" for="pointSize">Point Size</label>
								<div class="w-24">
									<NumberPicker 
									id={"pointSize"}
									bind:val={$programParams.pointSize} 
									step={0.01} 
									round={100}
									range={[0,10]}
									/>
								</div>
							</div>
							<div class="parameter-field">
								<label class="parameter-label" for="sizeRatio">Size / Length</label>
								<div class="w-20">
									<Switch
									id={"sizeRatio"}
									bind:val={$programParams.sizeRatio} 
									/>
								</div>
							</div>
							<div class="parameter-field">
								<label class="parameter-label" for="respawn">Auto Respawn</label>
								<div class="w-20">
									<Switch
									id={"respawn"}
									bind:val={$programParams.respawn} 
									/>
								</div>
							</div>
							<div class={`parameter-field ${$programParams.respawn ? "" : "text-neutral-600"}`}>
								<label class="parameter-label" for="respawnRate">Respawn Interval</label>
								<div class="w-24">
									<NumberPicker 
										id={"respawnRate"}
										bind:val={$programParams.respawnRate} 
										step={1} 
										round={1}
										range={[10,10000]}
										incrementGrowth={1.01}
									/>
								</div>
							</div>
							<div class="w-full flex justify-center pt-4">
								<button class="btn h-8" style="border-radius: 4px; color:white;" on:click={() => $metaParams.needsUpdate = true } ><div class="px-3">Respawn</div></button>
							</div>
						</div>
						
					</Section>
					<Section label="Sets Spawn Positions" >
						<div slot="tooltip">
							The initial positions for the sets with random deviation
						</div>
						<div slot="body">
							<div class="parameter-field">
								<label class="parameter-label" for="startX">x</label>
								<div class="w-24">
									<NumberPicker 
									id={"startX"}
									bind:val={$programParams.startPos[0]} 
									step={0.5} 
									round={100}
									incrementGrowth={1.05}
									/>
								</div>
								<label class="self-center" for="startXRnd">+-</label>
								<div class="w-24">
									<NumberPicker 
									id={"startXRnd"}
									bind:val={$programParams.startRnd[0]} 
									step={0.5} 
									round={100}
									incrementGrowth={1.05}
									/>
								</div>
							</div>
							<div class="parameter-field">
								<label class="parameter-label" for="startY">y</label>
								<div class="w-24">
									<NumberPicker 
									id={"startY"}
									bind:val={$programParams.startPos[1]} 
									step={0.5} 
									round={100}
									incrementGrowth={1.05}
									/>
								</div>
								<label class="self-center" for="startYRnd">+-</label>
								<div class="w-24">
									<NumberPicker 
									id={"startYRnd"}
									bind:val={$programParams.startRnd[1]} 
									step={0.5} 
									round={100}
									incrementGrowth={1.05}
									/>
								</div>
							</div>
							<div class="parameter-field">
								<label class="parameter-label" for="startZ">z</label>
								<div class="w-24">
									<NumberPicker 
									id={"startZ"}
									bind:val={$programParams.startPos[2]} 
									step={0.5} 
									round={100}
									incrementGrowth={1.05}
									/>
								</div>
								<label class="self-center" for="startZRnd">+-</label>
								<div class="w-24">
									<NumberPicker 
									id={"startZRnd"}
									bind:val={$programParams.startRnd[2]} 
									step={0.5} 
									round={100}
									incrementGrowth={1.05}
									/>
								</div>
							</div>
						</div>
					</Section>
					<Section label="Camera Target" >
						<div slot="tooltip">
							The camera target point
						</div>
						<div slot="body">
							<div class="parameter-field">
								<label class="parameter-label" for="targetX">x</label>
								<div class="w-28">
									<NumberPicker 
									id={"targetX"}
									step={1} 
									round={1000}
									bind:val={$programParams.cameraTarget[0]}
									/>
								</div>
							</div>
							
							<div class="parameter-field">
								<label class="parameter-label" for="targetY">y</label>
								<div class="w-28">
									<NumberPicker 
									id={"targetY"}
									step={1} 
									round={1000}
									bind:val={$programParams.cameraTarget[1]}
									/>
								</div>
							</div>						
							<div class="parameter-field">
								<label class="parameter-label" for="targetZ">z</label>
								<div class="w-28">
									<NumberPicker 
									id={"targetZ"}
									step={1} 
									round={1000}
									bind:val={$programParams.cameraTarget[2]}
									/>
								</div>
							</div>
						</div>
					</Section>
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

.parameter-field{
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