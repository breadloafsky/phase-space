import { Camera } from "../camera";
import { PointSet } from "./Set";

export interface MetaParams {
    needsUpdate:boolean;
	dimMap:(string|any)[];
	showGrid:boolean;
}

export interface ProgramParams{
    cameraTarget:number[];
    cameraDistance:number;
    cameraYaw:number;
    cameraPitch:number;
    equation : {x:string, y:string, z:string},
    iterate:boolean,
    iterationStep:number,
    setNum:number,
    setLength:number,
    respawn:boolean,
    respawnRate:number,
    presetCurrent:number,
    startPos:number[],
    startRnd:number[],
    sizeRatio:boolean,
    pointSize:number,
    v:number,
    vRange:number[],
    vStep:number,
    dt:number
}


export class ODE {
	sets:PointSet[] = [];
    camera:Camera;
    params:ProgramParams = {
        cameraTarget:[0,0,0],
        cameraDistance:10,
        cameraYaw:2,
        cameraPitch:0,
        equation : {x:"",y:"",z:""},
        iterate : true,
        iterationStep : 1,
        setNum : 150,
        setLength : 100,
        respawn : false,
        respawnRate : 100,
        presetCurrent : 2,
        startPos : [0,0,0],
        startRnd : [0,0,0],
        sizeRatio : true,
        pointSize : 1,
        v : 0.5,
        vRange:[0,0],
        vStep:1,
        dt : 0.01,//0.01,
    }

   
    constructor(){
        this.camera = new Camera(this.params);
		this.update();
    }

    pointsCount() {
        let count = 0;
        this.sets.forEach(s =>{
            count += s.points.length;
        });

        return count;
    }

    update()
    {
        this.updateSetsLength();
        this.sets.forEach(s =>{
			s.update();
		});
    }

    updateSetsLength()
	{
    const s = this.params.setNum - this.sets.length;

		if(s > 0)
		{
			for (let i = 0; i <Math.abs(s); i++)
			{
				this.sets.push(new PointSet(this));
			}
		}
		else if(s < 0)
		for (let i = 0; i < Math.abs(s); i++)
		{
			this.sets.pop();
		}
	}
}
export function generateTree() {
	return new Set();
}
