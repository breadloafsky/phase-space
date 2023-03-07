import { Camera } from "../camera";
import { PointSet } from "./Set";
import { ProgramParams, MetaParams } from "./Params";



export class ODE {
	sets:PointSet[] = [];
    camera:Camera;
    params:ProgramParams = new ProgramParams();


   
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
export function generateTree() {
	return new Set();
}
