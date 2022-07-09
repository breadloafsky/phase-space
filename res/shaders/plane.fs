varying lowp vec4 vColor;
varying lowp vec4 vPos; 
precision lowp float;

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main(void) {
    if(modI(abs(vPos.x*10.),100.) > 1.)
    discard;

    vec4 col = vColor;
    gl_FragColor = col;
}
