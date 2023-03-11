
import type { ODE } from "./ODE"

interface Point {
	x:number,
	y:number,
	z:number,
}

export class PointSet {
	count = 0;
	pos:Point;
	points:Point[] = [];
	lifeCount = 0;
	lifeRand = 0;	// lifetime randomizer
	lastDir:Point;
	ode:ODE;
	
	
    constructor(ode:ODE){
		this.ode = ode;
		const sPos = ode.params.startPos;
		const sRand = ode.params.startRnd;
		
		this.points = [];

		this.lifeCount = 0;	// iterations counter
		this.lifeRand = Math.random();  // random factor

		this.pos = {
			x : (Math.random()-0.5)*sRand[0] + sPos[0],
			y : (Math.random()-0.5)*sRand[1] + sPos[1], 
			z : (Math.random()-0.5)*sRand[2] + sPos[2],
		}
		this.lastDir = {...this.pos};
		
    }

	lifeMax() {
		return this.ode.params.respawnRate +this.ode.params.respawnRate*this.lifeRand/2;
	}
	
	

    update(){
		update(this);
    }
}
function update(set:PointSet){
	var x = set.pos.x;
	var y = set.pos.y;
	var z = set.pos.z;
	const dt = set.ode.params.dt;
	const v = set.ode.params.v;

	
	const equation = set.ode.equation;
	const length = set.ode.params.setLength;
	const respawn = set.ode.params.respawn;
	const iterationStep =  set.ode.params.iterationStep;
	
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
	

	if(set.ode.params.iterate)
	{
		for(let i = 0; i < iterationStep; i++)
		{
			[x,y,z] = euler(x,y,z,v,dt, equation);
		}
		
	}
	
	set.pos = {x,y,z};
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
