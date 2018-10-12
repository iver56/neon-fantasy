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

      let geometry = new THREE.SphereGeometry(5, 12, 12);
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

      this.scaler = 0;
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

      const workWorkTransitionProgress = F(frame, 328, 4);

      if(BEAN >= 336 && BEAN % 4 === 0 && BEAT && BEAN < 348) {
        this.scaler = 1;
      }
      this.scaler *= 0.95;

      const cameraZoomProgress = F(frame, 344, 4);
      this.camera.position.x = easeOut(0, -22.35, cameraZoomProgress);
      this.camera.position.y = easeOut(0, 28.63, cameraZoomProgress);
      this.camera.position.z = easeOut(200, 3.29, cameraZoomProgress);
      this.camera.lookAt(
        new THREE.Vector3(
          easeOut(0, -22.32, cameraZoomProgress),
          easeOut(0, 28.65, cameraZoomProgress),
          easeOut(0, 0.4, cameraZoomProgress)
        )
      );
      this.camera.rotation.z = easeOut(0, -1.03, cameraZoomProgress);

      for (let i = 0; i < this.spheres.length; i++) {
        const sphere = this.spheres[i];
        const workWorkPosition = this.getWorkWorkLogoPosition(7 * i / this.spheres.length);
        sphere.position.x = easeOut(
          i * Math.cos(i + frame / 90),
          -130 + 0.666 * workWorkPosition[0],
          workWorkTransitionProgress - i * 0.0009 + Math.cos(frame / 90 + 0.0009 * i + 3.1)
        );
        sphere.position.y = easeOut(
          i * Math.sin(i + frame / 90),
          75 - 0.666 * workWorkPosition[1],
          workWorkTransitionProgress - i * 0.0009 + Math.cos(frame / 90 + 0.0009 * i + 3.1)
        );
        sphere.scale.x = easeOut(
          easeOut(
            easeOut(0.0001, 0.5 + 0.00004 * i ** 1.95, F(frame, 320, 8) - i * 0.004),
            0.5,
            workWorkTransitionProgress
          ),
          0.08,
          cameraZoomProgress
        ) + lerp(0.5 * this.scaler, 0, F(frame, 344, 4));
        sphere.scale.y = sphere.scale.x;
        sphere.scale.z = sphere.scale.x;
      }

   }



  }

  global.tunnelNode = tunnelNode;
})(this);
