<script lang="ts">
	import Section from "../ui/Section.svelte";
	import { metaParams } from "../../stores"
	import Select from "../ui/Select.svelte";
	import Icon from "../ui/Icon.svelte";
    import Switch from "../ui/Switch.svelte";

</script>
<Section label="Dimensional Mapping" >
	<div slot="tooltip">
		<span class="text-lg text-cyan-500">Dimensional Mapping</span>
		<br/>
		The variables <span data-var="x">x</span>, <span data-var="y">y</span>, <span data-var="z">z</span> can be remapped for each dimension<br/>
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