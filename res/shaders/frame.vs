attribute vec2 aTexcoord;
attribute vec2 aPos;
varying lowp vec2 vTexcoord;

void main(void) {
    gl_Position = vec4(aPos.x,aPos.y, 0.0, 1.0);
    vTexcoord = aTexcoord;
}