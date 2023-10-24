<script lang="ts">
	import Section from "../ui/Section.svelte";
	import { metaParams, programParams} from "../../stores"
    import NumberPicker from "../ui/NumberPicker.svelte";
    import Switch from "../ui/Switch.svelte";

</script>
<Section label="Sets Properties" >
	<div slot="tooltip">
		<span class="text-lg text-cyan-500">Sets Properties</span>
		<br/>
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

