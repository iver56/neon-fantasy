(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class grandSphere extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.scaler = 1;
      this.angle = 0;

      var ballColor = new THREE.Color();
      ballColor.setHSL(
        (.5 + 0.64) % 1,
        .5,
        .5
      );

      this.ballTexture = Loader.loadTexture('res/shallow-water.jpg');
      this.ballTexture.minFilter = THREE.LinearFilter;
      this.ballTexture.magFilter = THREE.LinearFilter;
      this.ballMaterial = new THREE.MeshStandardMaterial({
        shading: THREE.FlatShading,
        metalness: 1,
        roughness: 0.5,
        map: this.ballTexture,
        emissive: 0xffffff,
        emissiveMap: this.ballTexture,
        emissiveIntensity: 1,
      });

      this.frame = 0;

      this.enterTransitionProgress = 0;

      this.bigSphere = new THREE.Mesh(
        new THREE.SphereGeometry(100, 32, 32),
        this.ballMaterial
      );
      var bigSphereLight = new THREE.PointLight(ballColor.getHex(), 1, 850);
      this.bigSphere.add(bigSphereLight);

      this.scene.add(this.bigSphere);
      // Orbs

      this.lights = [];
      this.spheres = [];


      for (let i = 0; i < 3; i++) {
        var color = new THREE.Color();
        color.setHSL(
          (.5 + 0.15 * i) % 1,
          .5,
          .5
        );

        var light = new THREE.PointLight(color.getHex(), 1, 850);
        this.lights.push(light);

        var sphereMaterial = new THREE.MeshBasicMaterial({color: color.getHex()});
        var sphere = new THREE.Mesh(
          new THREE.SphereGeometry(50, 32, 32),
          sphereMaterial
        );
        sphere.scale.x = 0.000001;
        sphere.scale.y = 0.000001;
        sphere.scale.z = 0.000001;


        sphere.add(light);
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      // Cubes
      var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);

      this.cubeGridWidth = 50;
      this.cubes = [];
      for (let i = 0; i < 1200; i++) {
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xdddddd});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cubes.push(cube);
        this.scene.add(cube);
      }

      this.originalCubeColor = [34 / 255, 34 / 255, 34 / 255];

      this.targetCubeColors = [
        [126 / 255, 143 / 255, 252 / 255], [0, 0, 0], [126 / 255, 143 / 255, 252 / 255], [0, 0, 0],
        [126 / 255, 143 / 255, 252 / 255], [0, 0, 0], [126 / 255, 143 / 255, 252 / 255]
      ];
      this.target2CubeColors = [
        [255 / 255, 43 / 255, 255 / 255], [0, 0, 0], [174 / 255, 37 / 255, 255 / 255], [0, 0, 0],
        [255 / 255, 40 / 255, 255 / 255], [0, 0, 0], [255 / 255, 49 / 255, 146 / 255]
      ];

      this.targetCubeScales = [49 / 640, 80 / 640, 131 / 640, 217 / 640, 342 / 640, 585 / 640, 1400 / 640];
      this.targetRotations = [
        0,
        THREE.Math.degToRad(-4.29),
        THREE.Math.degToRad(-11.15),
        THREE.Math.degToRad(-16.75),
        THREE.Math.degToRad(-20.77),
        THREE.Math.degToRad(-27.61),
        THREE.Math.degToRad(-33.0)
      ];
      this.targetAspectRatios = [
        16/16,
        15/16,
        14/16,
        13/16,
        12/16,
        10/16,
        9/16
      ];

      this.to1D = (x, y) => {
        return (y * this.cubeGridWidth + x);
      }
    }

    getCubeOrientation(i) {
      const cube = this.cubes[i];

      const x = i % this.cubeGridWidth;
      const y = Math.floor(i / this.cubeGridWidth);

      const distanceX = this.bigSphere.position.x - cube.position.x;
      const distanceY = this.bigSphere.position.y - cube.position.y;
      const distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

      const progress = 1 - this.scaler;
      const targetRotation = (Math.PI * 0.5 * (Math.floor(BEAN / 4))) % (Math.PI * 2);

      const z = easeOut(
        easeOut(-1000, distance - 500, this.enterTransitionProgress),
        -20,
        F(this.frame, 276, 4)
      );

      return {
        rotation: {
          x: lerp(targetRotation - Math.PI * 0.5, targetRotation, progress),
          y: lerp(targetRotation - Math.PI * 0.5, targetRotation, progress)
        },
        position: {
          x: -900 + 100 * (x) + ((y % 2) * 50),
          y: -600 + y * 50,
          z: z
        }
      }
    }

    update(frame) {
      this.frame = frame;
      super.update(frame);

      const glooooowProgress = F(frame, 256, 8);
      demo.nm.nodes.bloom.opacity = lerp(0.5, 1.5 + 3 * this.scaler, glooooowProgress);

      if (BEAN % 4 === 0 && BEAT) {
        this.scaler = 1;
      }

      this.scaler *= 0.95;

      this.angle += this.scaler * 0.15;

      this.enterTransitionProgress = F(frame, 224, 4);

      const transition1Progress = F(frame, 280, 4);
      const transition2Progress = F(frame, 284, 4);

      if (transition1Progress < 0) {
        this.bigSphere.position.x = easeIn(
          0,
          Math.sin(this.angle * 0.2 * Math.PI) * 300,
          this.enterTransitionProgress
        );
        this.bigSphere.position.y = easeIn(
          0,
          Math.cos(this.angle * 0.2 * Math.PI) * 300,
          this.enterTransitionProgress
        );
      }

      for (let i = 0; i < this.cubes.length; i++) {
        const cube = this.cubes[i];

        const cubeOrientation = this.getCubeOrientation(i);
        cube.rotation.x = cubeOrientation.rotation.x;
        cube.rotation.y = cubeOrientation.rotation.y;
        cube.position.x = cubeOrientation.position.x;
        cube.position.y = cubeOrientation.position.y;
        cube.position.z = cubeOrientation.position.z;
        cube.scale.x = 1;
        cube.scale.y = 1;
      }

      this.camera.position.z = easeIn(400, 1000, this.enterTransitionProgress);

      const cameraRotationProgress = F(frame, 272, 8);
      if (cameraRotationProgress >= 0) {
        this.camera.position.z = 400;
        this.camera.rotation.z = ((0 | (BEAN / 4)) % 2 === 0 ? this.scaler : -this.scaler);
        this.bigSphere.visible = false;
      } else {
        this.bigSphere.visible = true;
      }

      if (transition1Progress >= 0) {
        demo.nm.nodes.bloom.opacity = easeIn(1.5 + 3 * this.scaler, 1.1, transition1Progress);

        let counter = 0;
        for (let x = 8; x < 11; x++) {
          for (let y = 10; y < 13; y++) {
            const i = this.to1D(x, y);
            const cube = this.cubes[i];

            const cubeOrientation = this.getCubeOrientation(i);
            cube.position.x = easeOut(cubeOrientation.position.x, 0, transition1Progress);
            cube.position.y = easeOut(cubeOrientation.position.y, 0, transition1Progress);
            cube.position.z = easeOut(
              cubeOrientation.position.z,
              -0.01 * counter,
              transition1Progress - 0.13 * counter
            );
            cube.rotation.x = easeOut(cubeOrientation.rotation.x, 0, transition1Progress);
            cube.rotation.y = easeOut(cubeOrientation.rotation.y, 0, transition1Progress);
            if (counter < 7) {
              cube.scale.x = easeOut(1, this.targetCubeScales[counter], transition1Progress);
              cube.scale.y = cube.scale.x * this.targetAspectRatios[counter];
              cube.rotation.z = easeOut(0, this.targetRotations[counter], transition2Progress);

              if (transition2Progress < 0) {
                cube.material.emissive.setRGB(
                  lerp(this.originalCubeColor[0], this.targetCubeColors[counter][0], transition1Progress),
                  lerp(this.originalCubeColor[1], this.targetCubeColors[counter][1], transition1Progress),
                  lerp(this.originalCubeColor[2], this.targetCubeColors[counter][2], transition1Progress)
                );
              } else {
                cube.material.emissive.setRGB(
                  lerp(this.targetCubeColors[counter][0], this.target2CubeColors[counter][0], transition2Progress),
                  lerp(this.targetCubeColors[counter][1], this.target2CubeColors[counter][1], transition2Progress),
                  lerp(this.targetCubeColors[counter][2], this.target2CubeColors[counter][2], transition2Progress)
                );
              }

              counter++;
            } else {
              cube.scale.x = easeOut(1, 0.000000001, transition1Progress);
              cube.scale.y = cube.scale.x;
            }
          }
        }

        this.camera.rotation.z = lerp(
          this.scaler,
          0,
          transition1Progress
        );
        this.camera.position.z = easeOut(400, 64, transition1Progress)
      }
    }

    warmup(renderer) {
      this.update(2551);
      this.render(renderer);
    }
  }

  global.grandSphere = grandSphere;
})(this);
