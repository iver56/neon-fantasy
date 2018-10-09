(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class neonCityNode extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      let geometry = new THREE.SphereGeometry(12.2, 32, 32);
      let material = new THREE.MeshBasicMaterial({color: 0xffffff});

      this.spheres = [];
      for (let i = 0; i < 3; i++) {
        let sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = -50 + i* 50;
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

      for (let i = 0; i < this.spheres.length; i++) {
        let sphere = this.spheres[i];
        const scaleProgress = F(frame, 48, 4);
        sphere.scale.y = smoothstep(1, 48, scaleProgress);
      }
    }
  }

  global.neonCityNode = neonCityNode;
})(this);
