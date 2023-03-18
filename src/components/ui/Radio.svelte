
<script lang="ts">
	export let name:string;
	export let val:string;
	export let group:string;

</script>

<input bind:group={group} bind:value={val} hidden type="radio"  name={name}  />
<button on:click={() => {group = val; }} class={`radio ${val == group && "active"}`}>
	<div/>
</button>

<style>




.radio{
	align-items: center;
	padding: 2px;
	height: calc(var(--font-size) * 1.4);
	width: calc(var(--font-size) *1.4);
	background-color: rgb(97, 97, 97);
	border-radius: 4px;
}
.radio.active > div {
	width: 100%;
	height: 100%;
	background-color: rgb(0, 219, 219);
	border-radius: 4px;
	box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.479);
}

</style>