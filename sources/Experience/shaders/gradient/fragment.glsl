varying vec2 vUv;

void main() {
	vec3 startColor = vec3(1.0, 0.0, 0.0);
	vec3 endColor = vec3(0.0, 1.0, 0.0);
	vec3 finalColor = mix(startColor, endColor, vUv.y);

	gl_FragColor = vec4(finalColor, 1.0);
}