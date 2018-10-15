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

      this.canvas.width = 960;
      this.canvas.height = 540;

      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.fadeInTime = 0;

      this.strings = [
        {text:'You have been watching', start: 416, duration: 12, position: {x: 170, y: 180}},
        {text:'a demo called', start: 428, duration: 16, position: {x: 250, y: 280}},
        {text:'"Neon Fantasy"', start: 432, duration: 12, position: {x: 360, y: 360}},
        {text:'written in JavaScript', start: 444, duration: 16, position: {x: 160, y: 100}},
        {text:'by iverjo & fawds', start: 448, duration: 12, position: {x: 290, y: 190}},
        {text:'presented at Work-Work', start: 460, duration: 16, position: {x: 200, y: 360}},
        {text:'2018-10-25', start: 464, duration: 12, position: {x: 360, y: 430}}
      ];
    }

    update(frame) {
      super.update(frame);

      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.fillStyle = '#F72871';

      this.ctx.font = '5em Courier New';

      for (let thatString of this.strings) {
        if (BEAN >= thatString.start - this.fadeInTime && BEAN < thatString.start + thatString.duration) {
          const fadeInProgress = F(frame, thatString.start - this.fadeInTime, this.fadeInTime);
          const textProgress = F(frame, thatString.start, 12);
          this.ctx.save();
          this.ctx.globalAlpha = lerp(0, 1, fadeInProgress);
          this.ctx.fillText(
            thatString.text,
            thatString.position.x - textProgress * 50,
            thatString.position.y
          );
          this.ctx.restore();
        }
      }
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.outroNode = outroNode;
})(this);
