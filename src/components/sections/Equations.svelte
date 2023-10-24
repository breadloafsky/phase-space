<script lang="ts">
	import Section from "../ui/Section.svelte";
	import { programParams} from "../../stores"
    import EquationField from "../ui/EquationField.svelte";

</script>
<Section label="Equations" >
	<div slot="tooltip">
		<span class="text-lg text-cyan-500">The system of ordinary differential equations</span>
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

