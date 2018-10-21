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

      this.fadeInTime = 1;
      this.fadeOutTime = 4;

      this.strings = [
        {text:'Thanks for watching', start: 416, duration: 16, position: {x: 190, y: 180}},
        {text:'Neon Fantasy', start: 428, duration: 18, position: {x: 270, y: 280}},
        {text:'by iverjo & fawds', start: 432, duration: 14, position: {x: 380, y: 380}},
        {text:'Written in JavaScript', start: 444, duration: 18, position: {x: 200, y: 100}},
        {text:'for ARM DemoCompo', start: 448, duration: 14, position: {x: 300, y: 200}},
        {text:'Presented at Work-Work', start: 460, duration: 24, position: {x: 205, y: 330}},
        {text:'2018-10-25', start: 464, duration: 20, position: {x: 365, y: 430}}
      ];

      this.backgroundTexture = Loader.loadTexture('res/bg.png');
    }

    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = 1.1;

      this.ctx.drawImage(
        this.backgroundTexture.image, 0, 0, this.canvas.width, this.canvas.height
      );

      const t = frame / 150;
      this.ctx.fillStyle = 'white';
      const bottom = 0 | easeOut(easeOut(400, 70, F(frame, 414, 2)), 400, F(frame, 488, 4));
      for (let i = bottom; i < 400; i++) {
        const s = 149 / (i * 30 + 699);
        const q = s * 99;
        this.ctx.fillRect(
          960 * (9999 + Math.tan(i / 9) - s * t) % 980 - q,
          270 + 270 * Math.sin(s * 2e3),
          q,
          q
        );
      }

      this.ctx.font = '5.5em zekton-rg';

      for (let thatString of this.strings) {
        if (BEAN >= thatString.start - this.fadeInTime && BEAN < thatString.start + thatString.duration + this.fadeOutTime) {
          const fadeInProgress = F(
            frame,
            thatString.start - this.fadeInTime,
            this.fadeInTime
          );
          const fadeOutProgress = F(
            frame,
            thatString.start + thatString.duration - this.fadeOutTime,
            this.fadeOutTime
          );
          const textProgress = F(frame, thatString.start, 12);
          this.ctx.save();
          this.ctx.fillStyle = `rgba(255, 76, 149, ${easeIn(0, easeOut(1, 0, fadeOutProgress), fadeInProgress)})`;
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
