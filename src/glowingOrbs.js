(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class glowingOrbs extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.scaler = 1;
      this.angle = 0;

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

        var light = new THREE.PointLight(color.getHex(), 1, 800);
        this.lights.push(light);

        var sphereMaterial = new THREE.MeshBasicMaterial({color: color.getHex()});
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 32),
          sphereMaterial);
        sphere.add(light);
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      // Cubes
      this.cubePosCheckX = 0;
      this.cubePosCheckY = 0;

      var cubeGeometry = new THREE.BoxGeometry(30, 30, 30);
      var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

      this.cubes = [];
      for (let i = 0; i < 800; i++) {
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cubes.push(cube);
        this.scene.add(cube);

        cube.position.x = (Math.random() * 1600) - 800;
        cube.position.y = (Math.random() * 1000) - 500;
        cube.position.z = (Math.random() * 100) - 150;
      }
    }


    update(frame) {
      super.update(frame);

      let bloomAmount = this.scaler + 0.4;
      if (BEAN >= 28) {
        bloomAmount += lerp(2.5, 0, F(frame, 28, 4));
      }
      demo.nm.nodes.bloom.opacity = bloomAmount;

      if (BEAN % 4 === 0 && BEAT && BEAN >= 28) {
        this.scaler = 1;
      } else if (BEAT && (BEAN === 19 || BEAN === 20 || BEAN === 23 || BEAN === 25)) {
        this.scaler += 0.4;
      }
      this.scaler *= 0.95;

      this.angle += this.scaler * 0.15;

      const camera1Progress = F(frame, 0, 24);
      const orbPathTransitionProgress = F(frame, 8, 16);
      const camera2Progress = F(frame, 12, 8);

      // Update sphere positions
      const firstSphere = this.spheres[0];
      firstSphere.position.x = smoothstep(
        -1000 + 8 * frame,
        Math.sin(this.angle) * 300,
        orbPathTransitionProgress
      );
      firstSphere.position.y = smoothstep(
        100,
        Math.cos(this.angle) * 300,
        orbPathTransitionProgress
      );

      const otherOrbsIntroProgress = F(frame, 21, 4);
      this.spheres[1].visible = BEAN >= 16; // Reveal second sphere
      this.spheres[2].visible = BEAN >= 20; // Reveal third sphere
      for (let i = 1; i < 3; i++) {
        var sphere = this.spheres[i];
        const radius = smoothstep(1300, 300, otherOrbsIntroProgress - i);
        sphere.position.x = radius * Math.sin(this.angle + i * (2 / 3) * Math.PI);
        sphere.position.y = radius * Math.cos(this.angle + i * (2 / 3 * Math.PI));
      }

      // Update cube scaling
      for (let i = 0; i < this.cubes.length; i++) {
        let cube = this.cubes[i];
        let scaleDelta = 0.15 * Math.sin(i) + 0.3;
        cube.scale.x = smoothstep(
          0.0001,
          scaleDelta + Math.atan(0.5 + this.scaler),
          F(0 | (frame - i / 3), 0, 4)
        );
        cube.scale.y = cube.scale.x;
        cube.scale.z = cube.scale.x;
      }


      this.camera.position.x = smoothstep(-1207, 0, camera1Progress);
      this.camera.position.y = smoothstep(-707, 0, camera1Progress);
      this.camera.position.z = smoothstep(0, 1000, camera2Progress - 0.1);

      /*this.camera.lookAt(
        new THREE.Vector3(
          475.59,
          219.78,
          -143.64
        )
      );*/
      this.camera.rotation.y = smoothstep(-1, 0, camera2Progress);
      this.camera.rotation.x = smoothstep(Math.PI / 2, 0, camera2Progress + 0.2);
      //this.camera.rotation.z =

      //-407.91,-327.22,-97.19
      //475.59,219.78,-143.64

      // Scale up with guitar
      if (BEAN >= 28 && BEAN < 32) {
        let sphereScaleTarget = 1 + (1 - this.scaler) * 2;
        if (BEAN >= 27 && BEAN <= 29) {
          sphereScaleTarget += lerp(1, 0, F(frame, 27, 2));
        }
        for (let i = 0; i < 3; i++) {
          const sphere = this.spheres[i];
          sphere.scale.x = sphereScaleTarget;
          sphere.scale.y = sphereScaleTarget;
        }
      }

      // Scale down with guitar
      if (BEAN >= 32 && BEAN < 54) {
        var less = 0.01;
        less -= this.scaler * 0.01;
        for (let i = 0; i < 3; i++) {
          var sphere = this.spheres[i];
          sphere.scale.x -= less;
          sphere.scale.y -= less;
        }
      }

      // Start spinning cubes, moving from center to edge
      if (BEAN >= 32 && BEAN < 48) {
        const positionIncrease = 13;
        this.cubePosCheckX += this.scaler * positionIncrease;
        this.cubePosCheckY += this.scaler * positionIncrease;
        for (let i = 0; i < this.cubes.length; i++) {

          let cube = this.cubes[i];
          const checkX = Math.abs(cube.position.x) < this.cubePosCheckX;
          const checkY = Math.abs(cube.position.y) < this.cubePosCheckY;

          if (checkX && checkY) {
            cube.rotation.x += this.scaler * 0.2;
            cube.rotation.y += this.scaler * 0.2;
            cube.rotation.z += this.scaler * 0.2;
          }
        }
      }

      // Lerp cubes to donut shapes
      if (BEAN >= 48 && BEAN < 64) {
        for (let i = 0; i < this.cubes.length; i++) {

          var cube = this.cubes[i];
          var progress = this.scaler * 0.07;

          if (i < 100) {
            cube.position.x = lerp(cube.position.x, 100 * Math.cos(i / 9), progress);
            cube.position.y = lerp(cube.position.y, 100 * Math.sin(i / 9), progress);
          }
          else if (i < 350) {
            cube.position.x = lerp(cube.position.x, 300 * Math.cos(i / 9), progress);
            cube.position.y = lerp(cube.position.y, 300 * Math.sin(i / 9), progress);
          }
          else {
            cube.position.x = lerp(cube.position.x, 500 * Math.cos(i / 9), progress);
            cube.position.y = lerp(cube.position.y, 500 * Math.sin(i / 9), progress);
          }
        }
      }

      // Spin donuts, zoom in, spread cube z axis
      if (BEAN >= 64 && BEAN < 80) {
        this.camera.position.z -= this.scaler * 10;

        let less = 0.01;
        less += this.scaler * 0.03;
        for (let i = 0; i < 3; i++) {
          let sphere = this.spheres[i];
          sphere.scale.x = Math.max(0, sphere.scale.x - less);
          sphere.scale.y = Math.max(0, sphere.scale.y - less);
        }

        for (let i = 0; i < this.cubes.length; i++) {
          let cube = this.cubes[i];

          if (i < 100) {
            cube.position.x = Math.sin(-this.angle + i) * 100;
            cube.position.y = Math.cos(-this.angle + i) * 100;
            cube.position.z -= this.scaler * i % 8;
          }
          else if (i < 350) {
            cube.position.x = Math.sin(this.angle + i) * 300;
            cube.position.y = Math.cos(this.angle + i) * 300;
            cube.position.z -= this.scaler * i % 8;
          }
          else {
            cube.position.x = Math.sin(-this.angle + i) * 500;
            cube.position.y = Math.cos(-this.angle + i) * 500;
            cube.position.z -= this.scaler * i % 8;
          }
        }
      }

      this.camera.fov = easeOut(45, 1, F(frame, 92, 3));
      this.camera.updateProjectionMatrix();
    }

    // end at 96

    warmup(renderer) {
      this.update(0);
      this.render(renderer);
    }
  }

  global.glowingOrbs = glowingOrbs;
})(this);
