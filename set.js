import { SingletonFactory } from "./singleton.js";


export function PointSet(){

    
    this.singleton = SingletonFactory.getInstance();
    const sRnd = this.singleton.startRnd;
    const sPos = this.singleton.startPoints;
    this.x = (Math.random()*sRnd[0]-sRnd[0]/2) + sPos[0],
    this.y = (Math.random()*sRnd[1]-sRnd[1]/2) + sPos[1], 
    this.z = (Math.random()*sRnd[2]-sRnd[2]/2) + sPos[2],
    this.a = (Math.random()*sRnd[3]-sRnd[3]/2) + sPos[3],
    this.points = [];
    this.lastIter = 0;

    this.life = 0;
    this.lifeRand = Math.random();  // random factor

    this.lastVector = {};


}

PointSet.prototype.lifeMax = function() {
    return this.singleton.respawnRate +this.singleton.respawnRate*this.lifeRand/2;
}


PointSet.prototype.getVector = function()
{

}


PointSet.prototype.update = function(){

    var x = this.x;
    var y = this.y;
    var z = this.z;
    var a = this.a;
    const dt = this.singleton.dt;
    const v = this.singleton.v;
    const equation = this.singleton.equation;
    const length = this.singleton.setLength;
    const respawn = this.singleton.respawn;


    const iterationStep =  this.singleton.iterationStep;

    
    if(respawn)
    {
        this.life++;

        if(this.life >= this.lifeMax())
        {
            this.singleton.sets.splice(this.singleton.sets.indexOf(this), 1);
            this.singleton.sets.push(new PointSet());
        }
    }
    

  
    this.points = [];
    for (let i = 0; i < length; i++) {
        this.points.push({
            x: x,
            y: y,
            z: z,
            a: a,
        });
        [x,y,z,a] = euler(x,y,z,a,v,dt, equation);
    }

    [x,y,z,a] = euler(x,y,z,a,v,dt, equation);

    this.lastVector = {x,y,z,a};
  
    if(this.singleton.iterate)
    {
        if(iterationStep < length)
        {
            this.x = this.points[iterationStep].x;
            this.y = this.points[iterationStep].y;
            this.z = this.points[iterationStep].z;
        }
        else if(iterationStep >= length){

            
            x = this.points[length-1].x;
            y = this.points[length-1].y;
            z = this.points[length-1].z;
            a = this.points[length-1].a;

            for(let i = 0; i < iterationStep-length+1; i++)
            {

                [x,y,z,a] = euler(x,y,z,a,v,dt, equation);
    

            }
            this.x = x;
            this.y = y;
            this.z = z;
            this.a = a;
            
        }
        
    }
}

function euler(x,y,z,a,v,dt, equation)
{
    const _x = x;
    const _y = y;
    const _z = z;
    const _a = a;
    x += equation.x(_x, _y, _z, _a, v)*dt;
    y += equation.y(_x, _y, _z, _a, v)*dt;
    z += equation.z(_x, _y, _z, _a, v)*dt;
    a += equation.a(_x, _y, _z, _a, v)*dt;

    return ([x,y,z,a]);
}








