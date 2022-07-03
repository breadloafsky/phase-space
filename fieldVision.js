



export function FieldVector(vectors,i,k,j){

    this.x = i;
    this.y = j;
    this.z = k;
    this.points=[];
    this.distance = 0;
    vectors.push(this);
}



FieldVector.prototype.update = function(){
    var x = this.x;
    var y = this.y;
    var z = this.z;
    this.points = [];

    

    /* for (let f = 0; f < 40; f++) {
        x = equation.x(x, y, z, t, f);
        y = equation.y(x, y, z, t, f);
        z = equation.z(x, y, z, t, f);
        if(f>10)
        this.points.push({
            x: x,
            y: y,
            z: z,
        });
    } */
    const lastPoint = this.points[this.points.length-1];
    this.distance = vec3.distance([this.x,this.y,this.z],[lastPoint.x,lastPoint.y,lastPoint.z]);
}

