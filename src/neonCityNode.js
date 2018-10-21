(function (global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class neonCityNode extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      this.scaler = 1;
      this.scalerIntegrated = 0;
      this.random = new global.Random(666);

      demo.nm.nodes.bloom.opacity = 0.99;

      this.createBackground();

      this.createSun();

      this.stars = [];
      this.starPositionsX = [];
      this.starPositionsY = [];

      this.createStars();

      this.createCylinder();

      this.createShoutoutText();

      const castleTexture = Loader.loadTexture('res/castle.png');
      castleTexture.minFilter = THREE.LinearFilter;
      castleTexture.magFilter = THREE.LinearFilter;
      const castleMaterial = new THREE.MeshStandardMaterial({
        metalness: 1,
        roughness: 0.5,
        map: castleTexture,
        emissive: 0x30F5E0,
        emissiveMap: castleTexture,
        emissiveIntensity: 1
      });

      this.mathThingy = 2 * Math.PI / 10;

      const emblemGeometry = new THREE.PlaneGeometry(200, 200, 1);
      const emblemTexture = Loader.loadTexture('res/shieldemblem.png');
      emblemTexture.minFilter = THREE.LinearFilter;
      emblemTexture.magFilter = THREE.LinearFilter;
      emblemTexture.transparent = true;
      const emblemMaterial = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        // map: emblemTexture,
        emissive: 0x30F5E0,
        emissiveMap: emblemTexture,
        emissiveIntensity: 1,
        transparent: true,
        // opacity: 0.5,
        // alphaTest: 0.5,
        blending: THREE.AdditiveBlending
      });
      this.castles = [];
      this.emblems = [];
      const turretOffset = 150;

      const turretGeometry = new THREE.BoxGeometry(100, 300, 100);
      const turretHeightFromGround = 150;
      const createTurret = (offsetX, offsetZ) => {
        var turret = new THREE.Mesh(turretGeometry, castleMaterial);
        turret.position.x = offsetX;
        turret.position.z = offsetZ;
        turret.position.y = turretHeightFromGround;
        return turret;
      };

      const wallGeometry = new THREE.BoxGeometry(200, 150, 40);
      const wallHeightFromGround = -75;
      const createWall = (offsetX, offsetZ, rotation) => {
        var wall = new THREE.Mesh(wallGeometry, castleMaterial);
        wall.position.x = offsetX;
        wall.position.z = offsetZ;
        wall.position.y = -wallHeightFromGround;
        wall.rotation.y = rotation;
        return wall;
      };

      for (let i = 0; i < 10; i++) {

        var castle = new THREE.Group();

        castle.add(createTurret(turretOffset, turretOffset));
        castle.add(createTurret(-turretOffset, turretOffset));
        castle.add(createTurret(turretOffset, -turretOffset));
        castle.add(createTurret(-turretOffset, -turretOffset));

        castle.add(createWall(0, turretOffset, 0));
        castle.add(createWall(0, -turretOffset, 0));
        castle.add(createWall(turretOffset, 0, Math.PI / 2));
        castle.add(createWall(-turretOffset, 0, Math.PI / 2));

        var emblem = new THREE.Mesh(emblemGeometry, emblemMaterial);
        emblem.position.y = -200;
        this.emblems.push(emblem);
        castle.add(emblem);

        castle.position.x = i % 2 == 0 ? 380 : -380;
        castle.position.y = 3000 * Math.sin(this.mathThingy * i);
        castle.position.z = 3000 * Math.cos(this.mathThingy * i);

        castle.rotation.x = ((-2 * Math.PI) / (10) * i) + Math.PI / 2;

        this.castles.push(castle);
        this.cylinderWrapper.add(castle);
      }

      this.camera.far = 10000;

      this.cylinderSpinBean = 96;
      this.castleSpinBean = 100;

      this.sunMoveBean = 96;
      this.sunMoveY = 60;
      this.sunMoveX = 120;

      this.cameraMoveBean = 108;
      this.cameraRotationY = 0.3;

      this.emblemPositionStart = 0;
      this.emblemPositionEnd = 500;

      this.starPoints = [];
      for (let i = 0; i < 11; i++) {
        this.starPoints.push(neonCityNode.getStarPoint(i));
      }
    }

    static getStarPoint(i) {
      const t = i / 10;
      const radius = 500 + 500 * 2 * Math.abs(
        (t * 5) - Math.floor(t * 5 + 0.5)
      ) - 1;
      const phi = t * Math.PI * 2;
      return [
        radius * Math.cos(phi),
        radius * Math.sin(phi)
      ];
    }

    getStarPosition(t) {
      // t between 0 and this.starPoints.length - 1
      const segmentIndex = t | 0;
      const progress = t % 1;
      const nextIndex = segmentIndex + 1;
      const position = this.starPoints[segmentIndex];
      const diffX = this.starPoints[nextIndex][0] - position[0];
      const diffY = this.starPoints[nextIndex][1] - position[1];

      return [
        position[0] + progress * diffX,
        position[1] + progress * diffY
      ];
    }

    createBackground() {
      const backgroundTexture = Loader.loadTexture('res/bg.png');
      backgroundTexture.minFilter = THREE.LinearFilter;
      backgroundTexture.magFilter = THREE.LinearFilter;
      const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundTexture,
        transparent: true
      });
      const backgroundGeometry = new THREE.PlaneGeometry(16 * 660, 9 * 660, 1);
      this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
      this.background.rotation.x = -0.3;
      this.background.position.y = 2200;
      this.background.position.z = -4000;
      this.scene.add(this.background);
    }

    createShoutoutText() {
      this.shoutoutCanvas = document.createElement('canvas');
      this.shoutoutCtx = this.shoutoutCanvas.getContext('2d');
      this.shoutoutCanvas.width = 512;
      this.shoutoutCanvas.height = 512;

      this.shoutoutTexture = new THREE.Texture(this.shoutoutCanvas);
      this.shoutoutTexture.minFilter = THREE.LinearFilter;
      this.shoutoutTexture.magFilter = THREE.LinearFilter;
      this.shoutoutPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1200, 1200, 1),
        new THREE.MeshBasicMaterial({
          map: this.shoutoutTexture,
          transparent: true,
        })
      );
      this.scene.add(this.shoutoutPlane);

      this.shoutoutStrings = [
        'Hackheim',
        'Arm',
        'Work-Work',
        'Altair',
        'Still',
        'Ninjadev',
        'Holon',
        'Solskogen',
      ]
    }

    createSun() {
      this.sunTexture = Loader.loadTexture('res/shallow-water.jpg');
      this.sunTexture.minFilter = THREE.LinearFilter;
      this.sunTexture.magFilter = THREE.LinearFilter;
      this.sunMaterial = new THREE.MeshStandardMaterial({
        shading: THREE.FlatShading,
        metalness: 1,
        roughness: 0.5,
        map: this.sunTexture,
        emissive: 0xffffff,
        emissiveMap: this.sunTexture,
        emissiveIntensity: 1
      });

      var ballColor = new THREE.Color();
      ballColor.setHSL(
        (.5 + 0.64) % 1,
        .5,
        .5
      );

      this.bigSphere = new THREE.Mesh(new THREE.SphereGeometry(200, 32, 32), this.sunMaterial);
      var bigSphereLight = new THREE.PointLight(ballColor.getHex(), 4000, 2500);
      this.bigSphere.add(bigSphereLight);

      this.bigSphere.position.y = 3500;
      this.bigSphere.position.z = -3000;
      this.bigSphere.rotation.x = -0.3;
      this.scene.add(this.bigSphere);
    }

    createStars() {
      const starGeometry = new THREE.SphereGeometry(10, 10, 1);
      var starMaterial = new THREE.MeshBasicMaterial();

      for (let i = 0; i < 800; i++) {
        var sphere = new THREE.Mesh(starGeometry, starMaterial);

        sphere.position.y = this.random() * 4000;
        sphere.position.x = -5000 + this.random() * 10000;
        sphere.position.z = -3000;
        sphere.rotation.x = Math.PI / 2;
        this.stars.push(sphere);
        this.starPositionsX.push(sphere.position.x);
        this.starPositionsY.push(sphere.position.y);

        this.scene.add(sphere);
      }
    }

    createCylinder() {
      var geometryCylinder = new THREE.CylinderGeometry(3000, 3000, 6000, 64, 12, true);
      var materialCylinder = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x881DF7,
      });

      this.cylinderWrapper = new THREE.Object3D();
      this.cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);

      this.cylinder.rotation.z = 1.57;

      const geometryHackCylinder = new THREE.CylinderGeometry(2950, 2950, 6000, 64, 12, true);
      const hackCylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x0E0011 });
      this.goodHackCylinder = new THREE.Mesh(geometryHackCylinder, hackCylinderMaterial);
      this.goodHackCylinder.rotation.z = 1.57;

      this.cylinderWrapper.add(this.goodHackCylinder);
      this.cylinderWrapper.add(this.cylinder);
      this.scene.add(this.cylinderWrapper);
    }

    animateEmblemIn(emblem, bean, frame) {
      let scale = easeOut(0.0000001, 1, F(frame, bean, 4));
      emblem.scale.set(scale, scale, scale);
      emblem.position.y = this.emblemPositionStart + easeOut(0, this.emblemPositionEnd, F(frame, bean, 4));
    }

    updateShoutoutText(frame) {
      if (BEAN < 97 || BEAN > 160) {
        this.shoutoutPlane.visible = false;
        return;
      } else {
        this.shoutoutPlane.visible = true;
      }

      const shouldRedraw = (BEAN < 99) || (BEAT && (BEAN - 2) % 8 === 0);
      const stringIndex = 0 | ((BEAN - 96) / 8);
      const twoFour = (0 | (BEAN / 4)) % 2 === 1;
      const fromLeft = stringIndex % 2 === 0;

      if (shouldRedraw) {
        this.shoutoutCtx.clearRect(0, 0, this.shoutoutCanvas.width, this.shoutoutCanvas.height);
        this.shoutoutTexture.needsUpdate = true;

        this.shoutoutCtx.textAlign = fromLeft ? 'right' : 'left';
        this.shoutoutCtx.textBaseline = 'middle';
        this.shoutoutCtx.font = '6.5em zekton-rg';
        this.shoutoutCtx.fillStyle = '#30F5E0';

        this.shoutoutCtx.fillText(
          this.shoutoutStrings[stringIndex],
          fromLeft ? this.shoutoutCanvas.width : 0,
          this.shoutoutCanvas.height / 2
        );
      } else {
        this.shoutoutTexture.needsUpdate = false;
      }

      this.shoutoutPlane.position.z = -500;

      const startBean = this.castleSpinBean + 8 * stringIndex;
      if (twoFour) {
        this.shoutoutPlane.material.opacity = 1.0;
        this.shoutoutPlane.rotation.x = 0;

        this.shoutoutPlane.position.y = 3150;

        if (fromLeft) {
          this.shoutoutPlane.position.x = easeOut(
            -1400,
            -530,
            F(frame, startBean, 4)
          );
        } else {
          this.shoutoutPlane.position.x = easeOut(
            1400,
            530,
            F(frame, startBean, 4)
          );
        }
      } else {
        // one three
        const oneThreeProgress = F(frame, startBean - 4, 4);
        this.shoutoutPlane.material.opacity = easeOut(
          1.0, 0.0, F(frame, startBean - 4, 2)
        );

        this.shoutoutPlane.rotation.x = easeOut(
          0, Math.PI / 2, oneThreeProgress * 3
        );

        this.shoutoutPlane.position.y = easeOut(
          3150,
          BEAN >= 160 ? 2500 : 3370,
          oneThreeProgress
        );
        if (fromLeft) {
          this.shoutoutPlane.position.x = easeOut(
            530,
            830,
            oneThreeProgress
          );
        } else {
          this.shoutoutPlane.position.x = easeOut(
            -530,
            -830,
            oneThreeProgress
          );
        }
      }
    }

    update(frame) {
      super.update(frame);

      if (BEAN % 4 == 0 && BEAT) {
        this.scaler = 1;
      }

      this.scaler *= 0.95;
      this.scalerIntegrated += this.scaler;

      // Update sun
      this.sunMaterial.emissiveIntensity = 1 + this.scaler * 0.15;
      var sunScale = 1 + this.scaler * 0.05;
      this.bigSphere.scale.set(sunScale, sunScale, sunScale);

      if (BEAN < 160) {
        let posX = 2000;
        let posY = 2700;
        for (let i = 0; i <= 7; i++) {
          posX += easeOut(0, -this.sunMoveX, F(frame, this.sunMoveBean + 8 * i, 4));
          posY += easeOut(0, this.sunMoveY, F(frame, this.sunMoveBean + 8 * i, 4));
        }

        this.bigSphere.position.x = posX;
        this.bigSphere.position.y = posY;
      } else {
        this.bigSphere.position.x = 1040 - easeOut(0, 1040, F(frame, 160, 4));
        this.bigSphere.position.y = 3180 + easeOut(0, -980, F(frame, 160, 4)); // 60
      }
      // Update sun end

      this.updateShoutoutText(frame);

      this.castles[4].rotation.y = easeOut(0, -Math.PI, F(frame, this.castleSpinBean + 8 * 0, 4));
      this.castles[5].rotation.y = easeOut(0, Math.PI, F(frame, this.castleSpinBean + 8 * 1, 4));
      this.castles[6].rotation.y = easeOut(0, -Math.PI, F(frame, this.castleSpinBean + 8 * 2, 4));
      this.castles[7].rotation.y = easeOut(0, Math.PI, F(frame, this.castleSpinBean + 8 * 3, 4));
      this.castles[8].rotation.y = easeOut(0, -Math.PI, F(frame, this.castleSpinBean + 8 * 4, 4));
      this.castles[9].rotation.y = easeOut(0, Math.PI, F(frame, this.castleSpinBean + 8 * 5, 4));
      this.castles[0].rotation.y = easeOut(0, -Math.PI, F(frame, this.castleSpinBean + 8 * 6, 4));
      this.castles[1].rotation.y = easeOut(0, Math.PI, F(frame, this.castleSpinBean + 8 * 7, 4));
      this.castles[2].rotation.y = easeOut(0, -Math.PI, F(frame, this.castleSpinBean + 8 * 8, 4));
      this.castles[3].rotation.y = easeOut(0, Math.PI, F(frame, this.castleSpinBean + 8 * 9, 4));

      this.animateEmblemIn(this.emblems[4], this.castleSpinBean + 8 * 0, frame);
      this.animateEmblemIn(this.emblems[5], this.castleSpinBean + 8 * 1, frame);
      this.animateEmblemIn(this.emblems[6], this.castleSpinBean + 8 * 2, frame);
      this.animateEmblemIn(this.emblems[7], this.castleSpinBean + 8 * 3, frame);
      this.animateEmblemIn(this.emblems[8], this.castleSpinBean + 8 * 4, frame);
      this.animateEmblemIn(this.emblems[9], this.castleSpinBean + 8 * 5, frame);
      this.animateEmblemIn(this.emblems[0], this.castleSpinBean + 8 * 6, frame);
      this.animateEmblemIn(this.emblems[1], this.castleSpinBean + 8 * 7, frame);
      this.animateEmblemIn(this.emblems[2], this.castleSpinBean + 8 * 8, frame);
      this.animateEmblemIn(this.emblems[3], this.castleSpinBean + 8 * 9, frame);

      // Move world into view in the start of the effect
      if (BEAN < 160) {
        this.cylinderWrapper.position.y = easeOut(-3000, 0, F(frame, 96, 4));
      }
      else {
        this.cylinderWrapper.position.y = easeOut(0, -3000, F(frame, 160, 8));
      }

      this.cylinderWrapper.rotation.x = (this.scaler * 0.005 +
        easeOut(0, this.mathThingy, F(frame, this.cylinderSpinBean + 8 * 0, 4)) +
        easeOut(0, this.mathThingy, F(frame, this.cylinderSpinBean + 8 * 1, 4)) +
        easeOut(0, this.mathThingy, F(frame, this.cylinderSpinBean + 8 * 2, 4)) +
        easeOut(0, this.mathThingy, F(frame, this.cylinderSpinBean + 8 * 3, 4)) +
        easeOut(0, this.mathThingy, F(frame, this.cylinderSpinBean + 8 * 4, 4)) +
        easeOut(0, this.mathThingy, F(frame, this.cylinderSpinBean + 8 * 5, 4)) +
        easeOut(0, this.mathThingy, F(frame, this.cylinderSpinBean + 8 * 6, 4)) +
        easeOut(0, this.mathThingy, F(frame, this.cylinderSpinBean + 8 * 7, 4))
      ) + Math.PI / 20;


      const enterProgress = F(frame, 96, 4);
      const escapeProgress = F(frame, 220, 4);

      // STARS
      if (BEAN <= 100) {
        const scale = easeOut(0.00000001, 1, enterProgress);

        // All spheres use the same material, so we can access from e.g. the 1st sphere
        this.stars[0].material.color.setRGB(scale, scale, scale);

        for (let i = 0; i < this.stars.length; i++) {
          const sphere = this.stars[i];
          sphere.scale.x = scale;
          sphere.scale.z = scale;
        }
      } else if (BEAN >= 220) {
        const scale = easeOut(1, 0.00001, escapeProgress);

        // All spheres use the same material, so we can access from e.g. the 1st sphere
        this.stars[0].material.color.setRGB(scale, scale, scale);

        for (let i = 0; i < this.stars.length; i++) {
          const sphere = this.stars[i];
          sphere.scale.x = scale;
          sphere.scale.z = scale;
        }
      }

      // CAMERA
      this.camera.position.y = easeOut(
        3500,
        2430.14,
        escapeProgress
      );
      this.camera.position.z = easeOut(1000, -2252.4, escapeProgress);
      this.camera.rotation.x = -0.3;

      if (BEAN < 160) {
        this.camera.rotation.y = (
          easeOut(0, -this.cameraRotationY, F(frame, this.cylinderSpinBean + 8 * 0, 4)) +
          easeOut(0, this.cameraRotationY, F(frame, this.cylinderSpinBean + 8 * 1, 4)) +
          easeOut(0, -this.cameraRotationY, F(frame, this.cylinderSpinBean + 8 * 2, 4)) +
          easeOut(0, this.cameraRotationY, F(frame, this.cylinderSpinBean + 8 * 3, 4)) +
          easeOut(0, -this.cameraRotationY, F(frame, this.cylinderSpinBean + 8 * 4, 4)) +
          easeOut(0, this.cameraRotationY, F(frame, this.cylinderSpinBean + 8 * 5, 4)) +
          easeOut(0, -this.cameraRotationY, F(frame, this.cylinderSpinBean + 8 * 6, 4)) +
          easeOut(0, this.cameraRotationY, F(frame, this.cylinderSpinBean + 8 * 7, 4))
        ) + Math.PI / 20;
      }
      else {
        this.camera.rotation.y = smoothstep(Math.PI / 20, 0, F(frame, 160, 4));
      }

      // Background
      if (BEAN <= 100) {
        this.background.material.opacity = lerp(0.0, 1.0, enterProgress);
      } else if (BEAN >= 220) {
        this.background.material.opacity = lerp(1.0, 0.0, escapeProgress);
      }

      const calculateHeartPositionX = (i) => {
        let x = Math.sin(i);
        return 3 * 512 * x * x * x;
      };
      const calculateHeartPositionY = (i) => {
        return 2400 + 96 * (
          13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i)
        );
      };

      // Animate heart
      if (BEAN >= 160 && BEAN < 168) {
        let heartProgress = F(frame, 160, 5);
        for (let i = 0; i < this.stars.length; i++) {
          let star = this.stars[i];
          star.position.x = smoothstep(
            this.starPositionsX[i], calculateHeartPositionX(i), heartProgress
          );
          star.position.y = smoothstep(
            this.starPositionsY[i], calculateHeartPositionY(i), heartProgress
          );
        }
      }

      // Star
      if (BEAN >= 168 && BEAN < 176) {
        const starProgress = F(frame, 168, 5);

        for (let i = 0; i < this.stars.length; i++) {
          let star = this.stars[i];
          const starT = 10 * i / this.stars.length;
          const xy = this.getStarPosition(starT);
          const phi = smoothstep(0, -Math.PI, F(frame, 172, 5));
          const starX = 1.5 * (xy[0] * Math.cos(phi) - xy[1] * Math.sin(phi));
          const starY = 2200 + 1.5 * (xy[0] * Math.sin(phi) + xy[1] * Math.cos(phi));

          star.position.x = smoothstep(calculateHeartPositionX(i), starX, starProgress);
          star.position.y = smoothstep(calculateHeartPositionY(i), starY, starProgress);
        }
      }

      const starQuarter = this.stars.length / 4;
      const bubbleRadius = 800;
      const offsetY = 2200;
      const smallRingFactor = 0.4;
      
      let bubbleProgress = F(frame, 176, 4);
      const bubblePosX = (offset, i) => {
        return offset + 0.5 * bubbleRadius * Math.sin(Math.PI / 60 * i)
          + 0.5 * bubbleRadius * Math.sin((i % starQuarter) * 0.1 * bubbleProgress);
      };
      const bubblePosY = (offset, i, small) => {
        return offset + bubbleRadius * small * Math.cos(Math.PI / 60 * i) + offsetY;
      };

      if (BEAN >= 176 && BEAN < 184) {
        for (let i = 0; i < this.stars.length; i++) {
          const starT = 10 * i / this.stars.length;
          const xy = this.getStarPosition((starT * 97) % 10);
          const phi = smoothstep(0, -Math.PI, F(frame, 172, 5));
          const starX = 1.5 * (xy[0] * Math.cos(phi) - xy[1] * Math.sin(phi));
          const starY = 2200 + 1.5 * (xy[0] * Math.sin(phi) + xy[1] * Math.cos(phi));
          
          let star = this.stars[i];
          let small = i % 2 == 0 ? 1 : smallRingFactor;

          const updateBubblePositions = (x, y) => {
            let bubbleX = bubblePosX(x * bubbleRadius, i);
            let bubbleY = bubblePosY(y * bubbleRadius, i, small);
            star.position.x = smoothstep(starX, bubbleX, bubbleProgress);
            star.position.y = smoothstep(starY, bubbleY, bubbleProgress);
          };

          if (i < starQuarter) {
            updateBubblePositions(1, 1);
          } else if (i < starQuarter * 2) {
            updateBubblePositions(-1, 1);
          } else if (i < starQuarter * 3) {
            updateBubblePositions(1, -1);
          } else if (i < starQuarter * 4) {
            updateBubblePositions(-1, -1);
          }
        }
      }

      // Cylinder wormhole
      const xOffset = 900;
      if (BEAN >= 184 && BEAN < 220) {
        let wormholeProgress = F(frame, 184, 36);
        let wormholeTransitionProgress = F(frame, 184, 5);
        let bigBallTransformProgress = F(frame, 204, 5);
        const t = (frame - 1600) / 80;

        for (let i = 0; i < this.stars.length; i++) {
          let star = this.stars[i];

          let small = i % 2 === 0 ? 1 : smallRingFactor;
          let starWaveY = 4000 - i * 5;
          let starWaveX = (
            xOffset +
            1000 * Math.sin(i + wormholeProgress / 3 * 2 * Math.PI) * (
              1 - 0.5 * Math.sin(i * Math.PI / this.stars.length)
            ) +
            lerp(
              0,
              Math.pow(this.scaler, 0.3) * 120 * Math.sin(this.scalerIntegrated / 3 - i / 90),
              F(frame, 192, 1)
            )
          );

          const updateCylinderPositions = (x, y) => {
            if (BEAN < 204) {
              let bubbleX = bubblePosX(x * bubbleRadius, i);
              let bubbleY = bubblePosY(y * bubbleRadius, i, small);
              star.position.x = smoothstep(bubbleX, starWaveX, wormholeTransitionProgress);
              star.position.y = smoothstep(bubbleY, starWaveY, wormholeTransitionProgress);
              star.position.z = -3000;
            } else {
              // Big ball with bands
              const d = i / 42;
              const b = 63 * i + t;
              star.position.y = smoothstep(
                starWaveY,
                2810 + 830 * Math.cos(d),
                bigBallTransformProgress
              );
              star.position.x = smoothstep(
                starWaveX,
                860 * Math.sin(d) * Math.sin(b) * lerp(
                  1,
                  1 + 0.08 * Math.pow(this.scaler, 0.3) * Math.sin(this.scalerIntegrated / 3 - star.position.y / 290),
                  F(frame, 212, 1)
                ),
                bigBallTransformProgress
              );
              star.position.z = smoothstep(
                -3000,
                -1900 / (Math.sin(d) * Math.cos(b) + 1.9),
                bigBallTransformProgress
              )
            }
          };

          if (i < starQuarter) {
            updateCylinderPositions(-1, -1);
          } else if (i < starQuarter * 2) {
            updateCylinderPositions(-1, 1);
          } else if (i < starQuarter * 3) {
            updateCylinderPositions(1, -1);
          } else if (i < starQuarter * 4) {
            updateCylinderPositions(1, 1);
          }
        }
      }
    }

    warmup(renderer) {
      this.update(1093);
      this.render(renderer);
    }
  }

  global.neonCityNode = neonCityNode;
})(this);
