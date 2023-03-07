export class MetaParams {
    needsUpdate:boolean = true;
	dimMap:(string|any)[] = ["x","y","z"];
	showGrid:boolean = false;
}

export class ProgramParams{
    cameraTarget:number[] = [0,0,0];
    cameraDistance:number = 10;
    cameraYaw:number = 2;
    cameraPitch:number = 0;
    equation : {x:string, y:string, z:string} = {x:"",y:"",z:""};
    iterate:boolean = true;
    iterationStep:number = 1;
    setNum:number = 100;
    setLength:number = 150;
    respawn:boolean = false;
    respawnRate:number = 100;
    startPos:number[] = [0,0,0];
    startRnd:number[] = [10,10,10];
    sizeRatio:boolean = true;
    pointSize:number = 0.2;
    v:number = 0;
    vRange:number[] = [0,0];
    vStep:number = 0;
    dt:number = 0.01;
}