uniform float frame;
uniform sampler2D under;
uniform sampler2D over;

varying vec2 vUv;

void main() {
    vec4 underColor = texture2D(under, vUv);
    vec4 overColor = texture2D(over, vUv);
    vec4 color = mix(underColor, overColor, vec4(overColor.a));
    gl_FragColor = color;
}
