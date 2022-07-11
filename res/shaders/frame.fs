varying lowp vec2 vTexcoord;
uniform sampler2D uTexture;
precision lowp float;

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main(void) {

   /*  const float offset_x = 1. / 8000.;  
    const float offset_y = 1. / 8000.;  
    
    vec2 offsets[9];
    offsets[0] = vec2(-offset_x,  offset_y);
    offsets[1] = vec2( 0.0,    offset_y);
    offsets[2] = vec2( offset_x,  offset_y);
    offsets[3] = vec2(-offset_x,  0.0);
    offsets[4] = vec2( 0.0,    0.0);
    offsets[5] = vec2( offset_x,  0.0);
    offsets[6] = vec2(-offset_x, -offset_y);
    offsets[7] = vec2( 0.0,   -offset_y);
    offsets[8] = vec2( offset_x, -offset_y) ;
  
    float kernel[9];
    kernel[0] = 1.;
    kernel[0] = 1.;
    kernel[0] = 1.;
    kernel[0] = 1.;
    kernel[0] = -8.;
    kernel[0] = 1.;
    kernel[0] = 1.;
    kernel[0] =  1.;
    kernel[0] = 1.;
    

    vec3 color = vec3(0.0);
    for(int i = 0; i < 9; i++)
        color += vec3(texture2D(uTexture, vTexcoord.st + offsets[i])) * kernel[i];
    gl_FragColor = vec4(color,1.); */
    //gl_FragColor = vec4(color,1.);


    vec3 color = vec3(texture2D(uTexture, vTexcoord));
    /* for(float i = -0.05; i < 0.05; i+=0.01)
    {
        for(float j = -0.05; j < 0.05; j+=0.01)
        {
            if(vTexcoord.x+i > 0. && vTexcoord.y+j>0. && vTexcoord.x+i < 1. && vTexcoord.y+j<1.)
            color = mix(color,
            vec3(texture2D(uTexture, vec2(vTexcoord.x+i,vTexcoord.y+j)))
            ,0.5);
        }
    }
 */
    gl_FragColor = vec4(color,1.);

}
