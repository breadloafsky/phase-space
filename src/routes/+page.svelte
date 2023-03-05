<script lang="ts">
	import Program from "../components/Program.svelte";
	import Controls from "../components/Controls.svelte";
	import "../app.css";
</script>


<div class="main">
	<Program/>
	<Controls/>
</div>


<style  lang="postcss">
	.main{
		width: 100vw;
		height: 100vh;
	}
	:global(body)
	{
		margin: 0;
		overflow: hidden;
	}
</style>