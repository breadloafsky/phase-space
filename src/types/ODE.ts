import { Camera } from "../camera";
import { PointSet } from "./Set";
import { ProgramParams, MetaParams } from "./Params";
import { Bifurcation } from "./Bifurcation";
import { utils } from "../utils";



export class ODE {
	sets:PointSet[] = [];
    camera:Camera;
    params:ProgramParams = new ProgramParams();
	equationString = {x:"",y:"",z:""};
	equation:any = {};
	bifurcation:number[] = [];
    constructor(){
        this.camera = new Camera(this.params);
		this.update();
    }

	getEquationFunction(val:string)
	{
		try {
				let eq = new Function("x,y,z,v", "return " + utils.parse(val) ) as (x:number,y:number,z:number,v:number)=> number;
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

    pointsCount() {
        let count = 0;
        this.sets.forEach(s =>{
            count += s.points.length;
        });

        return count;
    }

    update()
    {
		let resetEquation = false;
		["x","y","z"].forEach(e => {
			if((this.params.equation as any)[e] != (this.equationString as any)[e])
				resetEquation = true;
		});
		if(resetEquation)	//	update equation function
		{
			Object.entries(this.params.equation).forEach(([key,val]) => {
				this.equation[key] =	this.getEquationFunction((this.params.equation as any)[key]);
			});
			this.equationString = {...this.params.equation};
		}
        this.updateSetsLength();
        this.sets.forEach((s,i) =>{
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


