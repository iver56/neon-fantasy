(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class boxPumper extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      let geometry = new THREE.SphereGeometry(12.2, 12, 12);
      let material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});

      this.spheres = [];
      for (let i = 0; i < 3; i++) {
        let sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = -50 + i * 50;
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      // city columns
      const planeGeometry = new THREE.PlaneGeometry(1, 1, 1);
      this.cityCols = [];
      for (let i = 0; i < 50; i++) {
        const planeMaterial = new THREE.MeshBasicMaterial({
          color: 0xEA21F7,
          side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.cityCols.push(plane);
        this.scene.add(plane);
      }

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = 0.0;

      const t = frame / 60;

      if (BEAN < 354) {
        const scaleProgress = F(frame, 348, 4);
        for (let i = 0; i < this.spheres.length; i++) {
          let sphere = this.spheres[i];
          sphere.scale.y = smoothstep(1, 48, scaleProgress);
          sphere.visible = true;
        }

        for (let i = 0; i < this.cityCols.length; i++) {
          let cityCol = this.cityCols[i];
          cityCol.visible = false;
        }
      } else {
        for (let i = 0; i < this.spheres.length; i++) {
          let sphere = this.spheres[i];
          sphere.visible = false;
        }

        for (let i = 0; i < this.cityCols.length; i++) {
          let cityCol = this.cityCols[i];

          const height = 9 + 30 * Math.pow(0.5 + 0.5 * Math.sin(i * 1337), 2);

          cityCol.position.x = -100 + i * 4 + Math.sin(i * 997) + 20 * Math.sin(t);
          cityCol.scale.y = height;
          cityCol.position.y = cityCol.scale.y / 2 + 9;
          cityCol.scale.x = 3;
          cityCol.visible = true;
        }
      }
    }
  }

  global.boxPumper = boxPumper;
})(this);
