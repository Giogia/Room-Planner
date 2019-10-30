#version 300 es

in vec3 inPosition;
in vec3 inNormal;
out vec3 fsNormal;
out vec3 fsPosition;  //Interpolated surface informatio

uniform mat4 matrix; 
uniform mat4 nMatrix;     //matrix do transform normals
uniform mat4 pMatrix;     //matrix do transform positions

void main() {
  fsNormal = mat3(nMatrix)*inNormal; 
  fsPosition = (pMatrix * vec4(inPosition, 1.0)).xyz;
  gl_Position = matrix * vec4(inPosition, 1.0);
}