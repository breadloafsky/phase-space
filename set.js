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

        x += equation.x(x, y, z, a, v);
        y += equation.y(x, y, z, a, v);
        z += equation.z(x, y, z, a, v);
        a += equation.a(x, y, z, a, v);
    }


    x += equation.x(x, y, z, a, v);
    y += equation.y(x, y, z, a, v);
    z += equation.z(x, y, z, a, v);
    a += equation.a(x, y, z, a, v);

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
                x += equation.x(x, y, z, a, v);
                y += equation.y(x, y, z, a, v);
                z += equation.z(x, y, z, a, v);
                a += equation.a(x, y, z, a, v);

            }
            this.x = x;
            this.y = y;
            this.z = z;
            this.a = a;
            
        }
        
    }
        
  
        
    



}











/* function setUp(pointSet, sets){
    const id = sets.length;
    const tablist = document.querySelector("#setTabs");
    const paramList = document.querySelector("#setParams");

    const ui= document.createElement('div');
    const tab = document.createElement('div');
    ui.appendChild(document.querySelector("#template").content.cloneNode(true))
    tab.appendChild(document.createTextNode(id+1));
    ui.dataset.set = id;
    tab.dataset.set = id;
    

    ui.querySelector(".btn-delete").addEventListener("click", () =>{
        deleteSet(sets,id);
    });


    ui.querySelector(".pointNumber").addEventListener("input", (e) =>{
        pointSet.pointNumber = e.target.value;
    });

    ui.querySelector(".size").addEventListener("input", (e) =>{
        pointSet.size = e.target.value;
    });
    
    tab.addEventListener("click", () => {
       select();
    });

    function deleteSet(sets,id)
    {
        document.querySelectorAll(`[data-set='${id}']`).forEach(e =>{
            e.remove();
        });
        sets.splice(id, 1); 
        if(tablist.children.length > 0)
        {
            tablist.children[tablist.children.length-1].dataset.selected = "true";
            paramList.children[tablist.children.length-1].hidden = false;
        }
        

    }


    function select()
    {
        [...tablist.children].forEach(c => c.dataset.selected ="false");
        tab.dataset.selected ="true";
        [...paramList.children].forEach(c => c.hidden =true);
        ui.hidden = false;
    }
   

    paramList.appendChild(ui);
    tablist.appendChild(tab);

    
    select();
    sets.push(pointSet);
} */