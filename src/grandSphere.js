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

      this.ballTexture = Loader.loadTexture('res/ivertex2.png');
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

      // PARTICLES
      /*

      this.generateParticleSprite = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';

        // https://programmingthomas.wordpress.com/2012/05/16/drawing-stars-with-html5-canvas/
        function star(ctx, x, y, r, p, m) {
          ctx.save();
          ctx.beginPath();
          ctx.translate(x, y);
          ctx.moveTo(0, 0 - r);
          for (let i = 0; i < p; i++) {
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - (r * m));
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - r);
          }
          ctx.fill();
          ctx.restore();
        }

        star(ctx, 8, 8, 7, 5, 0.5);

        return canvas;
      };
      this.ps = new global.ParticleSystem({
        color: new THREE.Color(0xffffff),
        amount: 3000,
        decayFactor: 0.98,
        gravity: 0,
        generateSprite: this.generateParticleSprite
      });
      this.ps.particles.position.x = 0;
      this.ps.particles.position.y = 0;
      this.ps.particles.position.z = 0;
      this.ps.particles.visible = true;
      this.scene.add(this.ps.particles);
      */

      this.bigSphere = new THREE.Mesh(
        new THREE.SphereGeometry(100, 32, 32),
        this.ballMaterial
      );
      var bigSphereLight = new THREE.PointLight(ballColor.getHex(), 1, 850);
      this.bigSphere.add(bigSphereLight);
      // // this.bigSphere.position.z = -75;

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
        sphere.scale.x = 0;
        sphere.scale.y = 0;
        sphere.scale.z = 0;


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
        F(this.frame, 268, 4)
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

      if (BEAN % 4 === 0 && BEAT) {
        this.scaler = 1;
      }

      this.scaler *= 0.95;

      this.angle += this.scaler * 0.15;

      this.enterTransitionProgress = F(frame, 224, 4);
      this.bigSphere.position.x = easeOut(
        0,
        Math.sin(this.angle * 0.2 * Math.PI) * 300,
        this.enterTransitionProgress
      );
      this.bigSphere.position.y = easeOut(
        0,
        Math.cos(this.angle * 0.2 * Math.PI) * 300,
        this.enterTransitionProgress
      );

      const sphereX = this.bigSphere.position.x;
      const sphereY = this.bigSphere.position.y;

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

      this.camera.position.z = easeOut(400, 1000, this.enterTransitionProgress);

      if (BEAN >= 272) {
        const originalColor = 0x222222;
        const colors = [0xff2Bff, 0x000000, 0xae25ff, 0x000000, 0xff28ff, 0x000000, 0xff3192];
        const scales = [49 / 640, 80 / 640, 131 / 640, 217 / 640, 342 / 640, 585 / 640, 1300 / 640];
        const transition1Progress = F(frame, 272, 4);

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
              -0.1 * counter,
              transition1Progress
            );
            cube.rotation.x = easeOut(cubeOrientation.rotation.x, 0, transition1Progress);
            cube.rotation.y = easeOut(cubeOrientation.rotation.y, 0, transition1Progress);
            if (counter < 7) {
              cube.scale.x = easeOut(1, scales[counter], transition1Progress);
              cube.scale.y = cube.scale.x;

              cube.material.emissive.setHex(colors[counter]);
              counter++;
            } else {
              cube.scale.x = easeOut(1, 0, transition1Progress);
              cube.scale.y = cube.scale.x;
            }
          }
        }

        this.camera.position.z = easeOut(1000, 90, transition1Progress)
      }


    }
  }

  global.grandSphere = grandSphere;
})(this);
