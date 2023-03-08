
import type { ODE } from "./ODE"

interface Point {
	x:number,
	y:number,
	z:number,
}

export class PointSet {
	count = 0;
	x=0;
	y=0;
	z=0;
	points:Point[] = [];
	lifeCount = 0;
	lifeRand = 0;	// lifetime randomizer
	lastDir = {};
	ode:ODE;
	
	
    constructor(ode:ODE){
		this.ode = ode;
		const sPos = ode.params.startPos;
		const sRand = ode.params.startRnd;
		this.x = (Math.random()-0.5)*sRand[0] + sPos[0],
		this.y = (Math.random()-0.5)*sRand[1] + sPos[1], 
		this.z = (Math.random()-0.5)*sRand[2] + sPos[2],
		this.points = [];

		this.lifeCount = 0;	// iterations counter
		this.lifeRand = Math.random();  // random factor
    }

	lifeMax() {
		return this.ode.params.respawnRate +this.ode.params.respawnRate*this.lifeRand/2;
	}
	
	

    update(){
		update(this);
    }
}
function update(set:PointSet){
	var x = set.x;
	var y = set.y;
	var z = set.z;
	const dt = set.ode.params.dt;
	const v = set.ode.params.v;

	
	
	const equation = set.ode.equation;
	const length = set.ode.params.setLength;
	const respawn = set.ode.params.respawn;
	const diffSub =  set.ode.params.iterationStep;
	
	if(respawn)
	{
		// set respawn
		if(set.lifeCount >= set.lifeMax())
		{
			set.ode.sets.splice(set.ode.sets.indexOf(set), 1);
			set.ode.sets.push(new PointSet(set.ode));
			return;
		}
		set.lifeCount++;
	}
	set.points = [];

for (let i = 0; i < length; i++) {
	set.points.push({
		x: x,
		y: y,
		z: z,
	});
	[x,y,z] = euler(x,y,z,v,dt, equation);
}

[x,y,z] = euler(x,y,z,v,dt, equation);

set.lastDir = {x,y,z};

	if(set.ode.params.iterate)
	{
		if(diffSub < length)
		{
			set.x = set.points[diffSub].x;
			set.y = set.points[diffSub].y;
			set.z = set.points[diffSub].z;
		}
		else if(diffSub >= length){	
			x = set.points[length-1].x;
			y = set.points[length-1].y;
			z = set.points[length-1].z;

			for(let i = 0; i < diffSub-length+1; i++)
			{
				[x,y,z] = euler(x,y,z,v,dt, equation);
			}
			set.x = x;
			set.y = y;
			set.z = z;
		}
		
	}
}





//	Euler method for differentiation
//	ToDo: replace with Runge-Kutta method
function euler(x:number,y:number,z:number,v:number,dt:number, equation : { [key: string]: (x:number,y:number,z:number,v:number)=> number }|null)
{
	if(equation && equation.x instanceof Function)
	{
		const _x = x;
		const _y = y;
		const _z = z;
		x += equation.x(_x, _y, _z, v)*dt;
		y += equation.y(_x, _y, _z, v)*dt;
		z += equation.z(_x, _y, _z, v)*dt;
	}
	
    return ([x,y,z]);
}

export function generateTree() {
	return new Set();
}
