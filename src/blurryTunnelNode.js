(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class blurryTunnelNode extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      this.resize();

      this.ctx.font = '5px s';

      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.colors = [
        '#F7CC18',
        '#F78B1E',
        '#F72871',
        '#EA21F7',
        '#881DF7',
        '#EA21F7',
        '#F72871',
        '#F78B1E',
      ];

      this.width = 16;
      this.halfWidth = this.width / 2;
      this.height = 0 | (this.width * 9 / 16);
      this.halfHeight = this.height / 2;
    }

    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = 0.3;

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(this.halfWidth, this.halfHeight);

      const t = frame / 60;
      const scalingFactor = 0.08;
      const rectWidth = 0.2;

      const explodeProgress = F(frame, 312, 8);
      if (BEAN < 312) {
        const color = this.colors[(0 | (BEAN / 4) + 5) % this.colors.length];
        this.ctx.strokeStyle = BEAN % 4 < 2 ? color : 'black';
        this.ctx.strokeRect(- rectWidth / 2, - rectWidth / 2, rectWidth, rectWidth);
      } else if (BEAN < 320) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.07 - explodeProgress * 0.07;
        this.ctx.strokeStyle = this.colors[4];
        this.ctx.strokeRect(- rectWidth / 2, - rectWidth / 2, rectWidth, rectWidth);
        this.ctx.restore();
      } else {
        this.ctx.save();
        const color = this.colors[(0 | (BEAN / 4) + 3) % this.colors.length];
        this.ctx.globalAlpha = 0.05;
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(- rectWidth / 2, - rectWidth / 2, rectWidth, rectWidth);
        this.ctx.restore();
      }

      if (BEAN >= 312 && BEAN < 320) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${explodeProgress})`;
        const particleSize = 0.03 + 0.05 * explodeProgress;
        const radius = 0.5 + (1.77 * explodeProgress) ** 2;

        for (let i = 0; i < explodeProgress * 40; i++) {
          this.ctx.fillRect(
            radius * (-0.5 + Math.random()) - particleSize / 2,
            radius * (-0.5 + Math.random()) - particleSize / 2,
            particleSize,
            particleSize
          );
        }
      }

      this.ctx.rotate(
        smoothstep(
          0.005 * Math.sin(1.2 * t),
          0,
          1 - Math.abs(1 - explodeProgress)
        )
      );

      this.ctx.drawImage(
        this.canvas,
        -this.halfWidth - scalingFactor * 2,
        -this.halfHeight - scalingFactor,
        this.width + 4 * scalingFactor,
        this.height + 2 * scalingFactor
      );
      this.ctx.restore();
    }

    resize() {
      this.canvas.width = this.width * GU;
      this.canvas.height = this.height * GU;
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.blurryTunnelNode = blurryTunnelNode;
})(this);
