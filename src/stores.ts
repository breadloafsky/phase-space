import { writable } from 'svelte/store';
import type { ProgramParams, MetaParams } from "./types/ODE"

export const programParams = writable<ProgramParams>({
	cameraTarget:[0,0,0],
	cameraDistance:10,
	cameraYaw:2,
	cameraPitch:0,
	equation : {x:"", y:"", z:""},
	iterate : true,
	iterationStep : 1,
	setNum : 150,
	setLength : 100,
	respawn : false,
	respawnRate : 1100,
	presetCurrent : 2,
	startPos : [0,0,0],
	startRnd : [0,0,0],
	sizeRatio : true,
	pointSize : 0.5,
	vRange:[0,0],
	v : 0.0,
	vStep : 0.0001,
	dt : 0.01,
})

export const metaParams = writable<MetaParams>({
	needsUpdate:true,
	dimMap:["x","y","z"],
	showGrid:false,
});