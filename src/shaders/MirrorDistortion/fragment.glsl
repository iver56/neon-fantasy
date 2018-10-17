uniform sampler2D tDiffuse;
uniform float frame;

varying vec2 vUv;

void main() {
    vec2 pos;

    if (frame < 4465.0) {
        pos.x = 0.5 + abs(0.5 - vUv.x);
        pos.y = vUv.y;
    } else if (frame < 4556.0) {
        pos.x = min(0.5 + abs(0.5 - vUv.x) + 0.01 * cos(vUv.y * 19.0 + frame / 30.0), 1.0);
        pos.y = vUv.y;
    } else {
        pos.x = min(0.5 + abs(0.5 - vUv.x) + 0.01 * cos(vUv.y * 19.0 + frame / 30.0), 1.0);
        pos.y = min(
            vUv.y + (0.002 + 0.0007 * (frame - 4556.0)) * sin(vUv.x * 15.0 + frame / 45.0),
            1.0
        );
    }

    gl_FragColor = texture2D(tDiffuse, pos);
}
