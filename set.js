



export function PointSet(sets){
    this.x = Math.random()*100;
    this.y = Math.random()*100;
    this.z = Math.random()*100;
    this.points = [];
  
    this.size = 0.1;
    this.lastIter = 0;

    this.previousTime=0;
    this.dt =2 * Math.random();
    this.startTime=null;
    sets.push(this);
    this.timeoffset = 0;
}



PointSet.prototype.update = function(mode, time,length,equation,t){

    var x = this.x;
    var y = this.y;
    var z = this.z;
    



    if(mode === "normal")
    {
        if(this.points.length > length)
        {
            for (let i = length-1; i < this.points.length; i++) {
                this.points.splice(0,1);
            }
        }

        if(this.points.length < length)
        {
            for (let i = 0; i < length-1; i++) {
                x = equation.x(x, y, z, t, i);
                y = equation.y(x, y, z, t, i);
                z = equation.z(x, y, z, t, i);
    
                this.points.push({
                    x: x,
                    y: y,
                    z: z,
                });
            }
            this.x = x;
            this.y = y;
            this.z = z;
        }
       
    
    
        if(time != null && time > this.previousTime+10*this.dt)
        {
            const i = 1;
            //for(let i = 0;  i < 1; i++)
            {
                this.points.splice(0,1);
                x = equation.x(x, y, z, t, i);
                y = equation.y(x, y, z, t, i);
                z = equation.z(x, y, z, t, i);
    
                this.points.push({
                    x: x,
                    y: y,
                    z: z,
                });
            }
    
            this.x = x;
            this.y = y;
            this.z = z;
    
            this.previousTime = time;
        }
    
    
        
    }

    else if(mode === "prediction")
    {
        this.points = [];
        for (let i = 0; i < length; i++) {
            x = equation.x(x, y, z, t, i);
            y = equation.y(x, y, z, t, i);
            z = equation.z(x, y, z, t, i);

            this.points.push({
                x: x,
                y: y,
                z: z,
            });
        }



        if(time != null && time > this.previousTime+10*this.dt)
        {

            this.x = this.points[1].x;
            this.y = this.points[1].y;
            this.z = this.points[1].z;
            this.previousTime = time;
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