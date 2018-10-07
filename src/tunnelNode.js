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
      for (let i = 0; i < 600; i++) {
        let sphere = new THREE.Mesh(geometry, material);
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      let light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.workWorkPoints = [
        [25, 25], [250, 25], [135, 207], [25, 25],
        [135, 25], [355, 25], [244, 207], [135, 25],
      ];

      this.camera.position.z = 200;
    }

    getWorkWorkLogoPosition(t) {
      // t between 0 and 7
      const segmentIndex = t | 0;
      const progress = t % 1;
      const nextIndex = segmentIndex + 1;
      const position = this.workWorkPoints[segmentIndex];
      const diffX = this.workWorkPoints[nextIndex][0] - position[0];
      const diffY = this.workWorkPoints[nextIndex][1] - position[1];

      return [position[0] + progress * diffX, position[1] + progress * diffY]
    }

    update(frame) {
      super.update(frame);

      const workWorkTransitionProgress = F(frame, 96 + 8, 4);

      for (let i = 0; i < this.spheres.length; i++) {
        const sphere = this.spheres[i];
        const workWorkPosition = this.getWorkWorkLogoPosition(7 * i / this.spheres.length);
        sphere.position.x = easeOut(
          i * Math.cos(i + frame / 90),
          -130 + 0.666 * workWorkPosition[0],
          workWorkTransitionProgress - i * 0.0009 + Math.cos(frame / 90 + 0.0009 * i)
        );
        sphere.position.y = easeOut(
          i * Math.sin(i + frame / 90),
          75 - 0.666 * workWorkPosition[1],
          workWorkTransitionProgress - i * 0.0009 + Math.cos(frame / 90 + 0.0009 * i)
        );
        sphere.position.z = easeOut(
          easeOut(0, -500 + i, F(frame, 96, 8)),
          0,
          workWorkTransitionProgress
        );
        sphere.scale.x = easeOut(
          easeOut(1, 0.5 + 0.00004 * i ** 1.95, F(frame, 96, 4)),
          0.5,
          workWorkTransitionProgress
        );
        sphere.scale.y = sphere.scale.x;
        sphere.scale.z = sphere.scale.x;
      }
    }
  }

  global.tunnelNode = tunnelNode;
})(this);
