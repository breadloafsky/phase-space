<script lang="ts">
	import Program from "../components/Program.svelte";
	import Controls from "../components/Controls.svelte";
	import "../app.css";
	import { onMount } from "svelte";
	let mobile = false;
	onMount(() => {
		mobile = checkIfMobile();
	});
	function checkIfMobile(){
        if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
         }
         else
            return false;
    }

</script>


<div class={`main ${mobile ? "mobile" : ""}`}>
	<Program/>
	<Controls bind:mobile/>
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