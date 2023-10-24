
<script lang="ts">
	import Section from "../ui/Section.svelte";
	import { programParams} from "../../stores"
    import NumberPicker from "../ui/NumberPicker.svelte";

</script>
<Section label="Sets Spawn Positions" >
	<div slot="tooltip">
		<span class="text-lg text-cyan-500">The Initial Positions Settings</span>
		<br/>
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