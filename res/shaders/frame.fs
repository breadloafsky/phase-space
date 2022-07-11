varying lowp vec2 vTexcoord;
uniform sampler2D uTexture;
precision lowp float;

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main(void) {

    
    
    gl_FragColor = texture2D(uTexture, vTexcoord);

    //gl_FragColor = vec4(0.3,0.5,0.2,1.0);
}
