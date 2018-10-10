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
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      super.update(frame);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      const t = frame / 60;
      const scalingFactor = 0.1;
      const rectWidth = 0.5;

      this.ctx.font = '5px s';
      this.ctx.strokeStyle = `hsl(${Math.max(0, Math.sin(t * 8) * 180)},90%,${BEAN % 2 ? 70 : 0}%)`;

      this.ctx.strokeRect(8 - rectWidth / 2, 4.5 - rectWidth / 2, rectWidth, rectWidth);
      this.ctx.drawImage(
        this.canvas,
        -scalingFactor * 2,
        -scalingFactor,
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
