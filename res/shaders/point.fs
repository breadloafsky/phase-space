varying lowp vec4 vColor;
varying lowp vec3 vPos; 
precision lowp float;
void main(void) {
    vec4 col = vColor;
    float r = length(gl_PointCoord-vec2(0.5));
    if(r > 0.5)
    discard;
    //col = col/(sin(r*50.)/10.+1.);
    col = col/(r+0.5);
    gl_FragColor = col;
}