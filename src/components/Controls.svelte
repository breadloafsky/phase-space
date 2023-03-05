
<script lang="ts">
	import { onMount } from "svelte";
	import Range from "./ui/Range.svelte";
	import { programParams, metaParams } from "../stores.js";
	import Select from "./ui/Select.svelte";
	import NumberPicker from "./ui/NumberPicker.svelte";
	import Switch from "./ui/Switch.svelte";
	import Pin from "./ui/Pin.svelte";
	import Collapse from "./ui/Collapse.svelte";
	import EquationField from "./ui/EquationField.svelte";
	import presets from "./presets.json";
    
	
	let mouseDown:number|boolean = false;
	let presetIndex = 1;
	onMount(() => {
		setPreset(0);
	});

	function mouseMove(e:MouseEvent){
		const moveStep = window.innerHeight < window.innerWidth ? window.innerWidth : window.innerHeight;
		if(mouseDown !== false)
		{
			programParams.update(p => {
				let t = p.cameraTarget;
				let pitch = p.cameraPitch;
				let yaw = p.cameraYaw;
				// rotate the camera around the target (vertically and horizontally)
				if (mouseDown === 0) {
					let a = yaw + e.movementX*6/moveStep;
					yaw = (a + Math.PI * 2 ) % (Math.PI*2);
					a = pitch - e.movementY*6/moveStep;
					pitch =  Math.abs(a) > Math.PI/2 ? pitch : a;
				}
				// move the camera target
				else if (mouseDown === 2) {
					const moveX = p.cameraDistance * e.movementX/moveStep / 2;
					const moveY = p.cameraDistance * e.movementY/moveStep / 2;
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
		//	reset the sets
		metaParams.update(n => { return{...n, needsUpdate:true}});
		//	set the preset
		programParams.update(e => {return{...e, ...presets[presetIndex]}});
	}


</script>
	<div 
		class="controls" 
		on:mousemove={mouseMove} 
		on:mouseup={() => mouseDown = false} 
		on:mouseleave={() => mouseDown = false} 
		on:contextmenu={(e) => e.preventDefault()}>
		<div class="top">
			<div class="controls-bar" data-pinned="true">
				<div class="flex flex-row-reverse"><Pin/></div>
				<!-- preset -->
				<Collapse label="Preset" collapsed={false}>
					<div class="flex justify-center">
						<button class="btn" on:click={() => setPreset((presetIndex+presets.length-1)%presets.length)}>{"<"}</button>
						<div class="px-4">{presetIndex+1}/{presets.length}</div>
						<button class="btn" on:click={() => setPreset((presetIndex+1)%presets.length)}>{">"}</button>
					</div>
					<!-- <div class="flex justify-center"><Select/></div> -->
					<div class="text-center py-2">{presets[presetIndex].name}</div>
				</Collapse>
				<!-- equation -->
				<Collapse label="Equation" collapsed={false}>
					<div class="parameter-field"><label class="parameter-label italic" for="eqX">f'(x)=</label>
						<EquationField 
						id="eqX"
						bind:val={$programParams.equation.x} 
						on:change={(e) => $programParams.equation.x = e.detail.val}/>
					</div>
					<div class="parameter-field"><label class="parameter-label italic" for="eqY">f'(y)=</label>
						<EquationField 
						id="eqY"
						bind:val={$programParams.equation.y} 
						on:change={(e) => $programParams.equation.y = e.detail.val}/>
					</div>
					<div class="parameter-field"><label class="parameter-label italic" for="eqZ">f'(z)=</label>
						<EquationField 
						id="eqZ"
						bind:val={$programParams.equation.z} 
						on:change={(e) => $programParams.equation.z = e.detail.val}/>
					</div>
				</Collapse>
				<Collapse label="Differentiation" collapsed={false}>
					<div class="parameter-field"><label class="parameter-label italic" for="dt">Δt=</label>
						<div class="w-32">
							<NumberPicker 
							id="dt" 
							bind:val={$programParams.dt} 
							on:change={(e) => programParams.update(p => {return{...p, dt:e.detail.val}})}  
							step={0.00001} 
							round={100000}
							incrementGrowth={1.1} />
						</div>
						
					</div>
					<div class="parameter-field">
						<label class="parameter-label" for="diffStep">Step</label>
						<div class="w-32">
							<NumberPicker 
							id={"diffStep"}
							bind:val={$programParams.iterationStep} 
							on:change={(e) => programParams.update(p => {return{...p, iterationStep:e.detail.val}})}  
							step={1} 
							round={1}
							range={[1,10]}
							/>
						</div>
					</div>
					<div class="parameter-field">
						<label class="parameter-label" for="differentiate">Differentiate</label>
						<div class="w-20">
							<Switch
							id={"differentiate"}
							bind:val={$programParams.iterate} 
							on:change={(e) => programParams.update(p => {return{...p, iterate:e.detail.val}})}
							/>
						</div>
					</div>
				</Collapse>
				<Collapse label="Dimension Mapping" collapsed={false}>
					<div class="flex justify-center py-1">
						<label class="parameter-label w-4 h-4" for="dim0"><div class="icon bg-white" style="--icon:{`url(/ui/dim-arrow0.svg)`}"/></label>
						<div class="w-12">
							<Select
							id={"dim0"}
							options={["x","y","z"]}
							bind:val={$metaParams.dimMap[0]}
							on:change={(e) => { let s = $metaParams.dimMap.findIndex(v => v == e.detail.val); $metaParams.dimMap[s] = $metaParams.dimMap[0]; $metaParams.dimMap[0] = e.detail.val;}}
							/>
						</div>
					</div>
					<div class="flex justify-center py-1">
						<label class="parameter-label w-4 h-4" for="dim1"><div class="icon bg-white" style="--icon:{`url(/ui/dim-arrow1.svg)`}"/></label>
						<div class="w-12">
							<Select
							id={"dim1"}
							options={["x","y","z"]}
							bind:val={$metaParams.dimMap[1]}
							on:change={(e) => { let s = $metaParams.dimMap.findIndex(v => v == e.detail.val); $metaParams.dimMap[s] = $metaParams.dimMap[1]; $metaParams.dimMap[1] = e.detail.val;}}
							/>
						</div>
					</div>
					<div class="flex justify-center py-1">
						<label class="parameter-label w-4 h-4" for="dim2"><div class="icon bg-white" style="--icon:{`url(/ui/dim-arrow2.svg)`}"/></label>
						<div class="w-12">
							<Select
							id={"dim2"}
							options={["x","y","z"]}
							bind:val={$metaParams.dimMap[2]}
							on:change={(e) => { let s = $metaParams.dimMap.findIndex(v => v == e.detail.val); $metaParams.dimMap[s] = $metaParams.dimMap[2]; $metaParams.dimMap[2] = e.detail.val;}}
							/>
						</div>
					</div>
					<div class="parameter-field">
						<label class="parameter-label" for="showGrid">The Coordinates Plane</label>
						<div class="w-20">
							<Switch
							id={"showGrid"}
							bind:val={$metaParams.showGrid} 
							/>
						</div>
					</div>
				</Collapse>
			</div>
			<div on:mousedown={(e) => {mouseDown = e.button;}} on:wheel={wheel} class="scene"/>
			<div class="controls-bar"  data-pinned="true">
				<div><Pin/></div>
				<!-- set properties -->
				<Collapse label="Sets Properties" collapsed={false}>
					<!-- svelte-ignore a11y-label-has-associated-control -->
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
							range={[0,40000]}
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
						<label class="parameter-label" for="respawn">Respawn</label>
						<div class="w-20">
							<Switch
							id={"respawn"}
							bind:val={$programParams.respawn} 
							/>
						</div>
					</div>
					<div class="parameter-field">
						<label class="parameter-label" for="respawnRate">Respawn Rate</label>
						<div class="w-24">
							<NumberPicker 
							id={"respawnRate"}
							bind:val={$programParams.respawnRate} 
							step={1} 
							round={1}
							range={[0,false]}
							incrementGrowth={1.01}
							/>
						</div>
					</div>
				</Collapse>
				<Collapse label="Starting Positions" collapsed={false}>
					<!-- svelte-ignore a11y-label-has-associated-control -->
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
				</Collapse>
			</div>
		</div>
		<div class="controls-bar bottom"  data-pinned="true">
			<div class="parameter-field">
				<label class="w-14" for="vMin">v min</label>
				<div class="w-24">
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
				<label class="w-8" for="vInput">v:</label>
				<div class="w-full">
					<Range
						id={"vInput"} 
						bind:val={$programParams.v}
						range={$programParams.vRange}
					/>
				</div>
			</div>
			<div class="parameter-field">
				<label class="w-14" for="vMax">v max</label>
				<div class="w-24">
					<NumberPicker 
						id={"vMax"}
						bind:val={$programParams.vRange[1]} 
						step={1} 
						round={10000}
						incrementGrowth={1.01}
					/>
				</div>
			</div>
			<div class="parameter-field">
				<label class="w-20" for="vStep">v change</label>
				<div class="w-24">
					<NumberPicker 
						id={"vStep"}
						bind:val={$programParams.vStep} 
						step={0.0001} 
						round={10000}
						incrementGrowth={1.05}
						range={[0,false]}
					/>
				</div>
			</div>
			<div class="w-6 mx-3 my-1">
				<Pin />
			</div>
			
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
	align-self: center;
}


.controls{
	width: 100%;
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


.top{
	flex-grow: 1;
	max-height: calc(100vh - 60px);
	justify-content: space-between;
	display: flex;
}

.controls-bar{
	padding: 20px;
	min-width: 10vw;
	transition: all 0.2s;
	display: flex;
	opacity: 0;
}
.top > .controls-bar{
	overflow-y: auto;
	flex-direction: column;
}
.controls-bar[data-pinned="true"] , .controls-bar:hover {
	min-width: 18vw;
	opacity: 1;
}

.controls-bar.bottom {
	min-height: 20px;
	padding: 10px;
	width: 100%;
}
.controls-bar.bottom[data-pinned="true"] , .controls-bar.bottom:hover {
	min-height: 60px;
	opacity: 1;
}


.controls-bar:hover{
	background-color: rgba(20, 20, 20);
}
</style>