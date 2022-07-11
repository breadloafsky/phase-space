varying lowp vec4 vColor;
varying lowp vec4 vPos; 
precision lowp float;

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main(void) {

    if(modI(abs(vPos.x*10.),100.) > 1. && modI(abs(vPos.z*10.),100.) > 1.)
    discard;

    vec4 col = vColor;


    col = vec4(1.,1.,1.,0.8);

    
    gl_FragColor = col;
}
