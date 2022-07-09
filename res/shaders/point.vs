uniform mat4 uView;
uniform mat4 uProjection;   
attribute vec3 aPoint;
attribute float aSize;
attribute vec3 aColorVector;
    
varying lowp vec4 vColor;
varying lowp vec3 vPos;

void main(void) {
    vec3 col = mix(vec3(0.,1.,0.)/1.2,vec3(0.,0.,1.)*2., aColorVector.y);
    col = mix(col,vec3(1.,0.,0.), aColorVector.x); 
    gl_Position = uProjection * uView  * vec4(aPoint, 1.);
    gl_PointSize = aSize * 1000. / gl_Position.z; 

    vPos = aPoint;
    vColor = vec4(col,0.9);
}