
export const shaders = {

	pointVs:`
		uniform mat4 uView;
		uniform mat4 uProjection;   
		attribute vec3 aPoint;
		attribute float aSize;
		attribute vec3 aColorVector;
			
		varying lowp vec4 vColor;
		varying lowp vec3 vPos;

		void main(void) {
			vec3 col = mix(vec3(0.,1.,0.)/1.8,vec3(0.,0.,1.)*2., aColorVector.y);
			col = mix(col,vec3(1.,0.,0.), aColorVector.x); 

			col = normalize(col);
			gl_Position = uProjection * uView  * vec4(aPoint, 1.);
			gl_PointSize = aSize * 1000. / gl_Position.z; 
			vPos = aPoint;
		vColor = vec4(col,0.9);
	}
`,
	pointFs:`
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
`,
planeVs:`
	attribute vec4 aVertexPosition;
	uniform mat4 uView;
	uniform mat4 uProjection;   
	uniform mat4 uModel;
	
	varying lowp vec4 vColor;
	varying lowp vec4 vPos;
	
	void main(void) {
		gl_Position = uProjection * uView  * uModel * aVertexPosition;

		
		vec3 col = vec3(0.5,0.5,0.5);



		vPos = uModel*aVertexPosition;

		//col = mix(col,vec3(0.5,0.5,0.5), gl_Position.z/100.);

		col = col-(gl_Position.z/400.);
		
		vColor = vec4(col,0.9);    
	}`
	,
	planeFs:`
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

			if(vPos.x*100. <= 10. && vPos.x*100. >= -10. && vPos.z*100. <= 10. && vPos.z*100. >= -10.)
			{
				col.y = col.y*2.;
			}
			else{
				if(vPos.x*100. <= 10. && vPos.x*100. >= -10.)
				{
					col.z = col.z*3.;
				}

				if(vPos.z*100. <= 10. && vPos.z*100. >= -10.)
				{
				
					col.x = col.x*2.;
				}
			}
			//col = vec4(1.,1.,1.,0.8);
			
			gl_FragColor = col;
		}`

,
frameVs:`
attribute vec2 aTexcoord;
attribute vec2 aPos;
varying lowp vec2 vTexcoord;

void main(void) {
	gl_Position = vec4(aPos.x,aPos.y, 0.0, 1.0);
	vTexcoord = aTexcoord;
}`
,

frameFs:`
varying lowp vec2 vTexcoord;
uniform sampler2D uTexture;
precision lowp float;

float modI(float a,float b) {
float m=a-floor((a+0.5)/b)*b;
return floor(m+0.5);
}

void main(void) {

	vec3 color = vec3(texture2D(uTexture, vTexcoord));
	gl_FragColor = vec4(color,1.);

}
`
}


