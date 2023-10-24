<script lang="ts">
	import Section from "../ui/Section.svelte";
	import { programParams} from "../../stores"

    import NumberPicker from "../ui/NumberPicker.svelte";
    import Switch from "../ui/Switch.svelte";

</script>
<Section label="Integration" >
	<div slot="tooltip">
		<span class="text-lg text-cyan-500">Integration settings</span>
		<br/>
		4th order Runge–Kutta is used for the numerical integration.
		<br/>
		<span class="italic">Δ</span> is the numerical step of integration
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