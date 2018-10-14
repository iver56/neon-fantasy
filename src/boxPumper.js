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

      // road segments
      this.roadSegments = [];
      for (let i = 0; i < 50; i++) {
        const planeMaterial = new THREE.MeshBasicMaterial({
          color: 0xEA21F7,
          side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.roadSegments.push(plane);
        this.scene.add(plane);
      }

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = lerp(0.0, 0.99, F(frame, 352, 4));

      const t = frame / 60;

      const colorizationProgress = F(frame, 354, 3);
      const zoomToCityProgress = F(frame, 356, 4);

      this.camera.position.x = smoothstep(
        -10.64,
        0,
        zoomToCityProgress
      );
      this.camera.position.y = smoothstep(
        17.04,
        0,
        zoomToCityProgress
      );
      this.camera.position.z = smoothstep(
        10.08,
        100,
        zoomToCityProgress
      );
      this.camera.lookAt(
        new THREE.Vector3(
          smoothstep(-9.96, 0, zoomToCityProgress),
          smoothstep(16.96, 0, zoomToCityProgress),
          smoothstep(0, 0, zoomToCityProgress)
        )
      );

      for (let i = 0; i < this.cityCols.length; i++) {
        let cityCol = this.cityCols[i];

        const height = 9 + 30 * Math.pow(0.5 + 0.5 * Math.sin(i * 1337), 2);

        cityCol.position.x = smoothstep(
          -100 + i * 5,
          -100 + i * 4 + Math.sin(i * 997) - 20 * Math.sin(t),
          zoomToCityProgress
        );
        cityCol.scale.y = height;
        cityCol.position.y = cityCol.scale.y / 2 + 9;
        cityCol.scale.x = 3;

        cityCol.material.color.setHSL(
          (.5 + 0.1 * Math.sin(i *997)) % 1,
          .5,
          .5
        );
      }

      if (BEAN < 356) {
        const scaleProgress = F(frame, 348, 4);
        for (let i = 0; i < this.spheres.length; i++) {
          let sphere = this.spheres[i];
          sphere.scale.y = smoothstep(1, 55, scaleProgress);
          sphere.visible = true;
        }

        for (let i = 0; i < this.roadSegments.length; i++) {
          let roadSeg = this.roadSegments[i];
          roadSeg.visible = false;
        }
      } else {
        for (let i = 0; i < this.spheres.length; i++) {
          let sphere = this.spheres[i];
          sphere.visible = false;
        }

        for (let i = 0; i < this.roadSegments.length; i++) {
          let roadSeg = this.roadSegments[i];

          const depth = (10000 + i - t * 5) % this.roadSegments.length;

          roadSeg.position.z = 110 - 40 * depth;
          roadSeg.position.y = -5;
          roadSeg.position.x = 2 * Math.sin(t + Math.PI / 2) * Math.pow(depth, 1.337);
          roadSeg.scale.x = 1000 / (depth + 50);
          roadSeg.scale.y = 25;
          roadSeg.visible = true;
          roadSeg.rotation.x = 0.5 * Math.PI;
          roadSeg.rotation.z = 0.02 * Math.sin(t + Math.PI / 2) * Math.pow(depth, 1.337);

          roadSeg.material.color.setHSL(
            .61 + 0.1 * Math.sin(i * 997),
            .5 + 0.1 * Math.sin(i * 16),
            .5
          );
        }
      }
    }
  }

  global.boxPumper = boxPumper;
})(this);
