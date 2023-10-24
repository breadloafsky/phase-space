
<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";


	export let label:string;

	let isTooltipVisible = false;
	let tooltip:HTMLDivElement;


	

	onMount(() => {
		tooltip.style.left = window.outerWidth/2+"";
		tooltip.style.top = window.innerHeight/2+"";
	});


	function showTooltip(show:boolean, e:MouseEvent|null=null)
	{
		if(show && e)
		{
			let x = e.pageX;
			let y = e.pageY;
			let bbox= tooltip.getBoundingClientRect();


			tooltip.style.visibility = bbox.width == 0 ? "hidden" : "visible"
			
			if(x > window.innerWidth/2)
				x -= bbox.width;
			
			if(y > window.innerHeight/2)
				y -= bbox.height; 

			tooltip.style.left = x+"px";
			tooltip.style.top = y+"px";
		}
		isTooltipVisible = show;
	}
</script>




<div class="section" >
	<div class="header"  >
		<h3>{label}</h3>
		<div class="info text-sm"
			on:mousemove={(e) => showTooltip(true,e)}
			on:mouseleave={(e) => showTooltip(false)}
		>
			?
		</div>
	</div>
	<div class="body"><div class="p-40"><slot name="body"/></div></div>
</div>


<div bind:this={tooltip} class={`tooltip`} hidden={!isTooltipVisible}>
	<slot name="tooltip"/>
</div>




<style>
.info {
	background-color: rgba(221, 221, 221, 0.212);
	border-radius: 50%;
	color:rgb(216, 216, 216);
	opacity: 0.6;
	cursor:crosshair;
	margin-left: 8px;
	width: 20px;
	height: 20px;
	text-align: center;
	align-self: center;
	font-weight: 800;
}

.section { 
	transition:all 0.1s;
	margin-block: 10px;
	height: fit-content;
	border-radius: 4px;
	box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.479);
}
.header{
	width: 100%;
	padding-inline: 14px;
	height: 36px;
	padding-block: 6px;
	display: flex;
	justify-content: space-between;
	background-color: #2d2d2d8c;
	align-items: center;
	color: #fde2c1;
}

.body {
	background-color: #2424248c;
}

.body > div{
	padding-block:  10px;
	padding-inline: 8px;
	border-top: 1px solid;
	border-color: #2d2d2d8c;
}



:global(.mobile) .info{
	visibility: hidden;
}
.info:hover {
	opacity: 1;
}

.tooltip{
	transition: all 0s !important;
	position: absolute;
	background-color: black;
	border:gray 2px solid;
	padding: 10px;
	pointer-events: none;
	width: max-content;
	font-size: 0.9em;
	z-index: 4;
	pointer-events: none;

	font-size: 0.8rem;
}
</style>