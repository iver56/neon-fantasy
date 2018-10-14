(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class outroNode extends NIN.THREENode {
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

      this.outroText = 'Thanks for hosting this demo compo';
    }

    update(frame) {
      super.update(frame);

      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.fillStyle = '#F72871';

      const textProgress = F(frame, 416, 16);

      this.ctx.font = '0.5em Courier New';
      this.ctx.fillText(this.outroText, 16 - textProgress * 16, 6.5);

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

  global.outroNode = outroNode;
})(this);
