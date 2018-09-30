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

      let geometry = new THREE.SphereGeometry(5, 32, 32);
      let material = new THREE.MeshBasicMaterial({color: 0xffffff});

      this.spheres = [];
      for (let i = 0; i < 800; i++) {
        let sphere = new THREE.Mesh(geometry, material);
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      let light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 200;
    }

    update(frame) {
      super.update(frame);

      for (let i = 0; i < this.spheres.length; i++) {
        const sphere = this.spheres[i];
        sphere.position.x = i * Math.cos(i + frame / 90);
        sphere.position.y = i * Math.sin(i + frame / 90);
        sphere.position.z = easeOut(0, -500 + i, F(frame, 192, 8));
        sphere.scale.x = easeOut(1, 0.5 + 0.00004 * i ** 1.95, F(frame, 192, 4));
        sphere.scale.y = sphere.scale.x;
        sphere.scale.z = sphere.scale.x;
      }
    }
  }

  global.tunnelNode = tunnelNode;
})(this);
