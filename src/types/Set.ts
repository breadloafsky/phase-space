
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
	changeDir:number = 0 // direction of the change;
	pointDistance:number = 0 // direction of the change;
	
	
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
	const delta = set.ode.params.delta;
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
	

	if(set.ode.params.integrate)
	{
		for(let i = 0; i < iterationStep; i++)
		{
			[x,y,z] = RK4Step(x,y,z,v,delta, equation);
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
		[x,y,z] = RK4Step(x,y,z,v,delta, equation);
	}
	[x,y,z] = RK4Step(x,y,z,v,delta, equation);
	set.lastDir = {x,y,z};

	

	computeBifurcation(x,y,z,set);
}

// calculate values for bifurcation diagram
function computeBifurcation(x:number,y:number,z:number,set:PointSet) {
	let old_distance = set.pointDistance;
	let dir = 0;
	set.pointDistance = Math.sqrt(x*x+y*y+z*z);

	
	if(set.pointDistance > old_distance)
		dir = 1;
	else if(set.pointDistance < old_distance)
		dir = -1;

	if(dir != set.changeDir)
	{
		set.changeDir = dir;
		if(set.ode.bifurcation.length >= 100)
			set.ode.bifurcation.shift();
		set.ode.bifurcation.push(set.pointDistance);
	}
}

//	Runge-Kutta 4th order
function RK4Step(x:number,y:number,z:number,v:number,h:number, equation : { [key: string]: (x:number,y:number,z:number,v:number)=> number }|null) {
	if(equation && equation.x instanceof Function)
	{
		const kx0 = equation.x(x,y,z,v);
		const ky0 = equation.y(x,y,z,v);
		const kz0 = equation.z(x,y,z,v);
		const kx1 = equation.x(x+0.5*h*kx0,y+0.5*h*ky0, z+0.5*h*kz0, v);
		const ky1 = equation.y(x+0.5*h*kx0,y+0.5*h*ky0, z+0.5*h*kz0, v);
		const kz1 = equation.z(x+0.5*h*kx0,y+0.5*h*ky0, z+0.5*h*kz0, v);
		const kx2 = equation.x(x+0.5*h*kx1,y+0.5*h*ky1, z+0.5*h*kz1, v);
		const ky2 = equation.y(x+0.5*h*kx1,y+0.5*h*ky1, z+0.5*h*kz1, v);
		const kz2 = equation.z(x+0.5*h*kx1,y+0.5*h*ky1, z+0.5*h*kz1, v);
		const kx3 = equation.x(x+h*kx2,y+h*ky2, z+h*kz2, v);
		const ky3 = equation.y(x+h*kx2,y+h*ky2, z+h*kz2, v);
		const kz3 = equation.z(x+h*kx2,y+h*ky2, z+h*kz2, v);

		return [ x+h/6*(kx0+2*(kx1+kx2)+kx3), y+h/6*(ky0+2*(ky1+ky2)+ky3),
			z+h/6*(kz0+2*(kz1+kz2)+kz3) ];
	}
	
	else return [x,y,z];
}



