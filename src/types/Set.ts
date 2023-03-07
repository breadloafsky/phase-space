
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
	equation:any = {};
	equationString = {x:"",y:"",z:""};
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
	getEquationFunction(val:string)
	{
		try {
				let eq = new Function("x,y,z,v", "return " + parse(val) ) as (x:number,y:number,z:number,v:number)=> number;
				if(typeof eq === 'function')
				{
					if(typeof eq(1, 1, 1, 1) == "number" && eq(1, 1, 1, 1) == eq(1, 1, 1, 1))	// check sample output
					{
						return eq;
					}	
				}
		} catch (e) {
			console.log("Equation Error");
		}
	}
	

    update(){
		var x = this.x;
		var y = this.y;
		var z = this.z;
		const dt = this.ode.params.dt;
		const v = this.ode.params.v;

		let resetEquation = false;

		//	check if the equation changed
		["x","y","z"].forEach(e => {
			if((this.ode.params.equation as any)[e] != (this.equationString as any)[e])
				resetEquation = true;
		});
		
		
		if(resetEquation)	//	update equation function
		{
			Object.entries(this.ode.params.equation).forEach(([key,val]) => {
				this.equation[key] = this.getEquationFunction((this.ode.params.equation as any)[key]);
			});
			this.equationString = {...this.ode.params.equation};
		}
		
		const equation = this.equation;
		const length = this.ode.params.setLength;
		const respawn = this.ode.params.respawn;
		const diffSub =  this.ode.params.iterationStep;
		
		if(respawn)
		{
			// set respawn
			if(this.lifeCount >= this.lifeMax())
			{
				this.ode.sets.splice(this.ode.sets.indexOf(this), 1);
				this.ode.sets.push(new PointSet(this.ode));
				return;
			}
			this.lifeCount++;
		}
		this.points = [];

    for (let i = 0; i < length; i++) {
        this.points.push({
            x: x,
            y: y,
            z: z,
        });
        [x,y,z] = euler(x,y,z,v,dt, equation);
    }

    [x,y,z] = euler(x,y,z,v,dt, equation);

    this.lastDir = {x,y,z};
  
		if(this.ode.params.iterate)
		{
			if(diffSub < length)
			{
				this.x = this.points[diffSub].x;
				this.y = this.points[diffSub].y;
				this.z = this.points[diffSub].z;
			}
			else if(diffSub >= length){	
				x = this.points[length-1].x;
				y = this.points[length-1].y;
				z = this.points[length-1].z;

				for(let i = 0; i < diffSub-length+1; i++)
				{
					[x,y,z] = euler(x,y,z,v,dt, equation);
				}
				this.x = x;
				this.y = y;
				this.z = z;
			}
			
		}
    }
}
function parse(str:string){
	str = str.replace(/([A-z])\w+/g, 'Math.$&');
	return str;
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
