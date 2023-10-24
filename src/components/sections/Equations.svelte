<script lang="ts">
	import Section from "../ui/Section.svelte";
	import { programParams} from "../../stores"
    import EquationField from "../ui/EquationField.svelte";
    import Icon from "../ui/Icon.svelte";

</script>
<Section label="Equations" >
	<div slot="tooltip">
		<span class="text-lg text-cyan-500">The system of ordinary differential equations</span>
		<br/>
		Each equation has input of 3 dimensional variables ( <span data-var="x">x</span>, <span data-var="y" >y</span>, <span data-var="z">z</span> ) that are individual for each point
		<br/>
		and 1 global variable <span data-var="v">v</span>, which can be controlled on the bottom bar.
		<br/>
		The equations can be modified in real time using JavaScript syntax (e.g., coefficients should be written as "2*x", instead of "2x").
		<br/>
		All the methods and properties of JavaScript
		<span class="text-sky-300 italic">Math</span> can be used, just without "Math."
		e.g.,
		<span class="function">Math.sin<span>(x)</span></span>{" ->"}  <span class="function">sin<span>(x)</span></span>,
		<span class="function">Math.PI</span>{" ->"}  <span class="function">PI</span>
		<br/>
		<br/>
		<div class="flex justify-around pb-4">
			<div class=" flex flex-col justify-center">
				<span class="text-sm font-bold text-amber-400">Some of built-in constants and functions:</span>
				<div><span class="function">PI</span><span style="font-family: sans; font-weight: 900;" class="">{" π "}</span><span>{" constant"}</span></div>
				<div><span class="function">E</span><span style="font-family: sans; font-weight: 900;">{" e "}</span><span>{" constant"}</span></div>
				<div><span class="function">sin<span>(x)</span></span><span>{" sin"}</span></div>
				<div><span class="function">cos<span>(x)</span></span><span>{" cos"}</span></div>
				<div><span class="function">tan<span>(x)</span></span><span>{" tan"}</span></div>
				<div><span class="function">abs<span>(x)</span></span><span>{" absolute value"}</span></div>
				<div><span class="function">ceil<span>(x)</span></span><span>{" smallest integer >= x"}</span></div>
				<div><span class="function">floor<span>(x)</span></span><span>{" largest integer <= x"}</span></div>
				<div><span class="function">round<span>(x)</span></span><span>{" x rounded to the nearest integer"}</span></div>
				<div><span class="function">min<span>(x, y ,...)</span></span><span>{" smallest of the numbers given as input parameters"}</span></div>
				<div><span class="function">max<span>(x, y ,...)</span></span><span>{" largest of the numbers given as input parameters"}</span></div>
			</div>
			<span class="text-xs ">
				<span class="text-sm font-bold text-sky-300">The reference for JS Math object on MDN Web Docs:</span>
				<br/>
				<span class="text-gray-400">https://developer.mozilla.org<span class="text-gray-300">/JavaScript/Reference/Global_Objects/Math</span></span>
				<div class="flex justify-end">
					<div style="width: 220px; height: 220px; padding-top:6px;">
						<Icon name="qr-mdn-math"/>
					</div>
				</div>
			</span>
	
		</div>
		
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

<style>

	span{
		font-family: sans-serif;
	}

	
</style>