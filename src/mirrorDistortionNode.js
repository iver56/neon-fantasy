(function(global) {
  class mirrorDistortionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput()
      };

      super(id, options);
    }

    update(frame) {
      super.update(frame);

      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.frame.value = frame;
    }
  }

  global.mirrorDistortionNode = mirrorDistortionNode;
})(this);
