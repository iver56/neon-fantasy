(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class tunnelNode extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      var geometry = new THREE.SphereGeometry(5, 32, 32);
      var material = new THREE.MeshBasicMaterial({color: 0xffffff});

      this.spheres = [];
      for (let i = 0; i < 800; i++) {
        var sphere = new THREE.Mesh(geometry, material);
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 200;
    }

    update(frame) {
      super.update(frame);

      for (let i = 0; i < this.spheres.length; i++) {
        var sphere = this.spheres[i];
        sphere.position.x = 500 * Math.sin(i);
        sphere.position.y = 50 * easeOut(0, 1, F(frame, 192, 4));
      }
    }
  }

  global.tunnelNode = tunnelNode;
})(this);
