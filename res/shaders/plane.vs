attribute vec4 aVertexPosition;
  uniform mat4 uView;
  uniform mat4 uProjection;   
  uniform mat4 uModel;
   
  varying lowp vec4 vColor;
  varying lowp vec4 vPos;
  
  void main(void) {
    gl_Position = uProjection * uView  * uModel * aVertexPosition;
    vec3 col = vec3(0.5,0.3,1.0);



    vPos = uModel*aVertexPosition;

    col = mix(col,vec3(0.5,0.5,0.5), gl_Position.z/100.);

    col = col-(gl_Position.z/400.);
      
    vColor = vec4(col,0.9);    
  }
  