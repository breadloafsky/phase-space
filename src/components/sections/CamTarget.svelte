<script lang="ts">
	import Section from "../ui/Section.svelte";
	import { programParams} from "../../stores"
    import NumberPicker from "../ui/NumberPicker.svelte";

</script>
<Section label="Camera Target" >
	<div slot="tooltip">
		<span class="text-lg text-cyan-500">The camera target point</span>
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