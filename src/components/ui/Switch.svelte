
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let id:string;
	export let val:boolean;

</script>

<input bind:checked={val} hidden type="checkbox"  id={id}  />
<div class="flex h-full justify-center switch-container">
	<button on:click={() => {val = !val; }} class={`switch ${!val &&  "off"}`}>
		<div><div/></div>
	</button>
</div> 

<style>




.switch-container{
	align-items: center;
	@apply   px-2;
}
.switch{
	height: calc(var(--font-size) * 1.4);
	width: calc(var(--font-size) *2.4);
	display: flex;
	position: relative;
	background-color: rgb(97, 97, 97);
	border-radius: 4px;
	box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.479);
}

.switch.off {
	box-shadow: 0px 0px 0px transparent;
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
	border-radius: 4px;
}
.switch.off > div:nth-child(1) {
	background-color: rgb(97, 97, 97);
	flex-grow: 0;
}

.switch > div:nth-child(1) > div{
	background-color: rgb(0, 219, 219);
	border-radius: 4px;
	width: calc(var(--font-size) *1.2);
	height: calc(var(--font-size) * 1.4);
	border: 1px rgba(123, 123, 123, 0.57) solid;
	transition: all 0.2s;
	/* position: absolute; */
}

.switch.off > div:nth-child(1) > div{
	background-color: rgb(192, 192, 192);
}



</style>