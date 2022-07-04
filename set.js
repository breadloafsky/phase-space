import { SingletonFactory } from "./singleton.js";


export function PointSet(){

    this.singleton = SingletonFactory.getInstance();
    const sRnd = this.singleton.startRnd;
    this.x = (Math.random()*sRnd-sRnd/2) + this.singleton.startX ,//* (Math.random() < 0.5 ? -1 : 1);
    this.y = (Math.random()*sRnd-sRnd/2) + this.singleton.startY, 
    this.z = (Math.random()*sRnd-sRnd/2) + this.singleton.startZ,
    this.points = [];

    this.lastIter = 0;

    this.previousTime=0;
    this.dt =2 * Math.random();
    this.startTime=null;

    this.timeoffset = 0;

    this.life = 0;
    this.lifeMax = this.singleton.respawnRate +this.singleton.respawnRate * Math.random();

}


PointSet.prototype.update = function(time){

    var x = this.x;
    var y = this.y;
    var z = this.z;
    const v = this.singleton.v;
    const equation = this.singleton.equation;
    const length = this.singleton.setLength;
    const respawn = this.singleton.respawn;

    
    if(respawn)
    {
        this.life++;

        if(this.life >= this.lifeMax)
        {
            this.singleton.sets.splice(this.singleton.sets.indexOf(this), 1);
            this.singleton.sets.push(new PointSet());
        }
    }
    else if (this.life > 0)
    {
        this.life = 0
        this.lifeMax = 1;
    }
    
   
  
    this.points = [];
    for (let i = 0; i < length; i++) {
        this.points.push({
            x: x,
            y: y,
            z: z,
        });

        x += equation.x(x, y, z, v);
        y += equation.y(x, y, z, v);
        z += equation.z(x, y, z, v);
    }



    if(time != null && time > this.previousTime+10*this.dt)
    {

        this.x = this.points[1].x;
        this.y = this.points[1].y;
        this.z = this.points[1].z;
        this.previousTime = time;
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