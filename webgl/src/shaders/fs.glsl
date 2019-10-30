#version 300 es

precision mediump float;

in vec3 fsNormal;
in vec3 fsPosition; 
out vec4 outColor;

uniform vec3 mDiffColor; //material diffuse color 
uniform vec3 mSpecColor; //material specular color
uniform float mSpecPower; //power of specular ref
uniform vec3 lightDirection; // directional light direction vec
uniform vec3 lightColor; //directional light color 
uniform vec3 eyePosition; //Observer's position

void main() {

  vec3 nEyeDirection = normalize(eyePosition - fsPosition);
  vec3 nLightDirection = - normalize(lightDirection);
  vec3 nNormal = normalize(fsNormal);
  
  vec3 diffuse = mDiffColor * lightColor * clamp(dot(nLightDirection,nNormal), 0.0, 1.0);
  
  vec3 hVec = normalize(nEyeDirection + nLightDirection);
  
  vec3 blinnSpecular = mSpecColor * lightColor * pow(clamp(dot(nNormal,hVec), 0.0, 1.0), mSpecPower);
  

  outColor = vec4(min(diffuse + blinnSpecular, vec3(1.0, 1.0, 1.0)),1.0); 
}