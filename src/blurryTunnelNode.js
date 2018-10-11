(function(global) {
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
      ]
    }

    update(frame) {
      super.update(frame);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(8, 4.5);

      const t = frame / 60;
      const scalingFactor = 0.08;
      const rectWidth = 0.2;

      const color = this.colors[(0 | (BEAN / 4) + 5) % this.colors.length];
      this.ctx.strokeStyle = BEAN % 4 < 2 ? color : 'black';
      this.ctx.strokeRect(- rectWidth / 2, - rectWidth / 2, rectWidth, rectWidth);

      this.ctx.rotate(0.005 * Math.sin(1.2 * t));

      this.ctx.drawImage(
        this.canvas,
        -8 - scalingFactor * 2,
        -4.5 - scalingFactor,
        16 + 4 * scalingFactor,
        9 + 2 * scalingFactor
      );
      this.ctx.restore();
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.blurryTunnelNode = blurryTunnelNode;
})(this);
