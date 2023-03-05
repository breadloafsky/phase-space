
<script lang="ts">
    import { onMount } from "svelte";
	let element:HTMLDivElement|any;
	export let rawVal:string = "";
	let val:string = ""


	onMount(() => {
		
	});
	
	// function onInput(e:KeyboardEvent){
	// 	e.preventDefault();
	// 	let sel = document.getSelection();
	// 	console.log(e);
	// 	if(e.ctrlKey || e.altKey)
	// 	{
	// 		if(e.key == "c")
	// 			{}	
	// 	}
	// 	else if (sel){
	// 		let temp =  rawVal.split('');
	// 		temp.splice(sel.anchorOffset, 0, e.key);
	// 		rawVal = temp.join('');
	// 	}
	// 	const newOffset = (sel?.anchorOffset ?? 0) + 1;

	// 	setTimeout(() => {
	// 		sel = document.getSelection();
	// 		var range = document.createRange();
	// 		if(!sel || !sel.anchorNode)
	// 			return;
	// 		range.setStart(sel?.anchorNode as Node, newOffset);
	// 		sel.removeAllRanges();
	// 		sel.addRange(range);
	// 	}, 1)

	// }
	
	function onInput(e:Event){

	}


</script>

<!-- <div bind:this={element} class="equation" aria-readonly="true" contentEditable="true" role="textbox"  tabindex="0"  on:keydown={onInput} >
	<pre>{rawVal}</pre>
</div> -->
<input type="text" class="bg-neutral-800" on:input={onInput}/>

<style>
.equation{
	@apply  py-0.5 px-2;
	min-height: 2em;
	width: 100%;
	background-color: #08080867;
}


</style>