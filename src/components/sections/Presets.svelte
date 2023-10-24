<script lang="ts">
	import Section from "../ui/Section.svelte";
	import Icon from "../ui/Icon.svelte";
    import { onMount } from "svelte";
	import { programParams, metaParams} from "../../stores"
    import { MetaParams, ProgramParams } from "../../types/Params";
	import presets from "../../presets.json";

	let fileInput:any;
	let presetIndex = 0;
	onMount(() => {
		setPreset(0);
	});

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
<Section label="Preset" >
	<div slot="tooltip">
		<span class="text-lg text-cyan-500">Preset selection</span>
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

