
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from "svelte";
	export let id:string;
	export let val:any;
	export let options: any[];
	const dispatch = createEventDispatcher<{change:{val:any}}>();
	onMount(() => {

	});
	function update(e:Event|any)
	{
		dispatch('change', {val:e.target.value});
	}
</script>

<div class="input-container">
	<select value={val}  class="input" id={id} on:change={(e) => update(e)} >
		{#each options as option}
			<option>{option}</option>
		{/each}
	</select>
</div>

<style>
.input-container{
	display: flex;
	width: 100%;
}
.input{
	@apply  py-0.5 px-2;
	width: 100%;
	max-height: 2em;
	background-color: rgb(38 38 38);
}
.icon {
	max-height: 1em;
	width: 100%;
	height: 10px;
}

.btn-container{
	display: flex;
	flex-direction: column;
	max-height: 2em;
	max-width: 25px;
	min-width: 25px;
	height: auto;
}

.btn-container > button{
	height: 100%;
}


</style>