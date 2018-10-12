(function(global) {
  class SceneSwitcherNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
          C: new NIN.TextureInput(),
          D: new NIN.TextureInput(),
          E: new NIN.TextureInput(),
          F: new NIN.TextureInput(),
          G: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
        }
      });
    }

    update() {
      this.inputs.A.enabled = false;
      this.inputs.B.enabled = false;
      this.inputs.C.enabled = false;
      this.inputs.D.enabled = false;

      // enable blurryTunnelNode before it starts, to prepare the tunnel
      this.inputs.E.enabled = BEAN >= 276 && BEAN < 336;

      this.inputs.F.enabled = false;
      this.inputs.G.enabled = false;

      let selectedScene;
      if (BEAN < 96) {
        selectedScene = this.inputs.C;
      } else if (BEAN < 224) {
        selectedScene = this.inputs.B;
      } else if (BEAN < 288) {
        selectedScene = this.inputs.D;
      } else if (BEAN < 320) {
        selectedScene = this.inputs.E;
      } else if (BEAN < 348) {
        selectedScene = this.inputs.F;
      } else if (BEAN < 370) {
        selectedScene = this.inputs.G;
      } else {
        selectedScene = this.inputs.A;
      }

      selectedScene.enabled = true;
      this.outputs.render.setValue(selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
