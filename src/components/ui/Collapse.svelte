
<script lang="ts">
	export let collapsed = true;
	export let label:string;
</script>

<div class="collapsible" data-collapsed={collapsed}>
	<button class="header" on:click={() => collapsed = !collapsed} ><h3>{label}</h3><div class="arrow">{">"}</div></button>
	<div class="body"><div class="p-40"><slot/></div></div>
</div>

<style>
.collapsible { 
	transition:all 0.1s;
	margin-block: 10px;
	height: fit-content;
	border-radius: 4px;
	box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.479);
}
.collapsible > .header{
	width: 100%;
	padding-inline: 14px;
	padding-block: 6px;
	display: flex;
	justify-content: space-between;
	background-color: #2d2d2d8c;
}
.collapsible  .arrow{
	transition: all 0.1s;	
	color: #6c6c6c;
  	font-weight: bolder;
}

.collapsible > .body {
	background-color: #2424248c;
}

.collapsible > .body > div{
	padding-block:  10px;
	padding-inline: 8px;
	border-top: 1px solid;
	border-color: #2d2d2d8c;
	
}
.collapsible[data-collapsed=false]  .arrow{
	transform: rotate(90deg);
}

.collapsible[data-collapsed=true] > .body{
	max-height: 0px;
	transform: scale(1,0);

	
}
</style>