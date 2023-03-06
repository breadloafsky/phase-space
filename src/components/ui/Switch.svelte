
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from "svelte";
	export let id:string;
	export let val:boolean;
	const dispatch = createEventDispatcher<{change:{val:boolean}}>();
	onMount(() => {
		update();
	});

	function update()
	{
		dispatch('change', {val:val});
	}
	

</script>

<input bind:checked={val} hidden type="checkbox"  id={id} on:change={update} />
<div class="flex h-full justify-center switch-container">
	<button on:click={() => {val = !val; update();}} class={`switch ${!val &&  "off"}`}>
		<div><div/></div>
	</button>
</div> 

<style>




.switch-container{
	align-items: center;
	@apply   px-2;
}
.switch{
	height: 20px;
	width: 38px;
	display: flex;
	position: relative;
	background-color: rgb(97, 97, 97);
	border-radius: 4px;

}
.switch > div {
	align-self: center;
	transition: all 0.2s;
}
.switch > div:nth-child(1) {
	display: flex;
	justify-content: flex-end;
	background-color: rgb(0, 170, 170);
	flex-grow: 1;
	height: 20px;
	border-radius: 4px;
}
.switch.off > div:nth-child(1) {
	background-color: rgb(97, 97, 97);
	flex-grow: 0;
}

.switch > div:nth-child(1) > div{
	background-color: rgb(0, 219, 219);
	border-radius: 4px;
	width: 20px;
	height: 20px;
	border: 1px rgba(123, 123, 123, 0.57) solid;
	transition: all 0.2s;
	/* position: absolute; */
}

.switch.off > div:nth-child(1) > div{
	background-color: rgb(192, 192, 192);
}



</style>