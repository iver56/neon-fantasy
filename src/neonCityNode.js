(function (global) {
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
      this.scaler = 1;
      this.random = new global.Random(666);

      demo.nm.nodes.bloom.opacity = 0.99;

      this.createSun();
      this.createStars();
      this.createCylinder();

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
      const emblemTexture = Loader.loadTexture('res/transparentlys.png');
      emblemTexture.minFilter = THREE.LinearFilter;
      emblemTexture.magFilter = THREE.LinearFilter;
      emblemTexture.transparent = true;
      const emblemMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: emblemTexture
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
      }
      
      const wallGeometry = new THREE.BoxGeometry(200, 100, 1);
      const wallHeightFromGround = -50;
      const createWall = (offsetX, offsetZ, rotation) => {
        var wall = new THREE.Mesh(wallGeometry, castleMaterial);
        wall.position.x = offsetX;
        wall.position.z = offsetZ;
        wall.position.y = -wallHeightFromGround;
        wall.rotation.y = rotation;
        return wall;
      }

      for (let i = 0; i < 10; i++) {

        var castle = new THREE.Group();

        castle.add(createTurret(turretOffset, turretOffset));
        castle.add(createTurret(-turretOffset, turretOffset));
        castle.add(createTurret(turretOffset, -turretOffset));
        castle.add(createTurret(-turretOffset, -turretOffset));

        castle.add(createWall(0, turretOffset, 0));
        castle.add(createWall(0, -turretOffset, 0));
        castle.add(createWall(turretOffset, 0, Math.PI/2));
        castle.add(createWall(-turretOffset, 0, Math.PI/2));

        var emblem = new THREE.Mesh(emblemGeometry, emblemMaterial);
        emblem.position.y = -200 ;
        this.emblems.push(emblem);
        castle.add(emblem);

        castle.position.x = i % 2 == 0 ? 300 : -300;
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
      this.sunMoveY = 120;
      this.sunMoveX = 280;

      this.cameraMoveBean = 108;
      this.cameraRotationY = 0.3;

      this.emblemPositionStart = 0;
      this.emblemPositionEnd = 500;
    }

    createSun() {
      this.sunTexture = Loader.loadTexture('res/ivertex2.png');
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

      this.bigSphere = new THREE.Mesh(new THREE.SphereGeometry(200, 32, 32),
        this.sunMaterial)
      var bigSphereLight = new THREE.PointLight(ballColor.getHex(), 4000, 2500);
      this.bigSphere.add(bigSphereLight);

      this.bigSphere.position.y = 3500
      this.bigSphere.position.z = -3000;
      this.bigSphereOffsetX = 700;
      this.scene.add(this.bigSphere);
    }

    createStars() {
      this.spheres = [];
      const starGeometry = new THREE.SphereGeometry(10, 10, 10);
      var starMaterial = new THREE.MeshBasicMaterial();

      for (let i = 0; i < 600; i++) {
        var sphere = new THREE.Mesh(starGeometry, starMaterial);

        sphere.position.y = this.random() * 4000;
        sphere.position.x = -4000 + this.random() * 8000;
        sphere.position.z = -3000;
        this.spheres.push(sphere);

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

    animateEmblemIn(emblem, bean, frame){
      let scale = easeOut(0, 1.5, F(frame, bean, 4));
      emblem.scale.set(scale, scale, scale);
      emblem.position.y = this.emblemPositionStart + easeOut(0, this.emblemPositionEnd, F(frame, bean, 4));
    }

    update(frame) {
      super.update(frame);

      if (BEAN % 4 == 0 && BEAT) {
        this.scaler = 1;
      }

      this.scaler *= 0.95;

      // Update sun
      this.sunMaterial.emissiveIntensity = 1 + this.scaler * 0.15;
      var sunScale = 1 + this.scaler * 0.05
      this.bigSphere.scale.set(sunScale, sunScale, sunScale);
      
      this.bigSphere.position.x = (2000 +
        easeOut(0, -this.sunMoveX, F(frame, this.sunMoveBean + 8 * 1, 4)) +
        easeOut(0, -this.sunMoveX, F(frame, this.sunMoveBean + 8 * 2, 4)) +
        easeOut(0, -this.sunMoveX, F(frame, this.sunMoveBean + 8 * 3, 4)) +
        easeOut(0, -this.sunMoveX, F(frame, this.sunMoveBean + 8 * 4, 4)) +
        easeOut(0, -this.sunMoveX, F(frame, this.sunMoveBean + 8 * 5, 4)) +
        easeOut(0, -this.sunMoveX, F(frame, this.sunMoveBean + 8 * 6, 4)) +
        easeOut(0, -this.sunMoveX, F(frame, this.sunMoveBean + 8 * 7, 4))
      );

      this.bigSphere.position.y = (2700 +
        easeOut(0, this.sunMoveY, F(frame, this.sunMoveBean + 8 * 1, 4)) +
        easeOut(0, this.sunMoveY, F(frame, this.sunMoveBean + 8 * 2, 4)) +
        easeOut(0, this.sunMoveY, F(frame, this.sunMoveBean + 8 * 3, 4)) +
        easeOut(0, this.sunMoveY, F(frame, this.sunMoveBean + 8 * 4, 4)) +
        easeOut(0, this.sunMoveY, F(frame, this.sunMoveBean + 8 * 5, 4)) +
        easeOut(0, this.sunMoveY, F(frame, this.sunMoveBean + 8 * 6, 4)) +
        easeOut(0, this.sunMoveY, F(frame, this.sunMoveBean + 8 * 7, 4))
        );
      // Update sun end
        
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
      this.cylinderWrapper.position.y = easeOut(-3000, 0, F(frame, 96, 4));

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
        this.spheres[0].material.color.setRGB(scale, scale, scale);

        for (let i = 0; i < this.spheres.length; i++) {
          const sphere = this.spheres[i];
          sphere.scale.x = scale;
          sphere.scale.y = scale;
        }
      } else if (BEAN >= 220) {
        const scale = easeOut(1, 0.00001, escapeProgress);

        // All spheres use the same material, so we can access from e.g. the 1st sphere
        this.spheres[0].material.color.setRGB(scale, scale, scale);

        for (let i = 0; i < this.spheres.length; i++) {
          const sphere = this.spheres[i];
          sphere.scale.x = scale;
          sphere.scale.y = scale;
        }
      }

      // CAMERA
      this.camera.position.x = easeOut(
        0,
        180.27,
        escapeProgress
      );
      this.camera.position.y = easeOut(
        3500,
        3773.14,
        escapeProgress
      );
      this.camera.position.z = easeOut(1000, -2252.4, escapeProgress);

      this.camera.rotation.x = -0.3;
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
  }

  global.neonCityNode = neonCityNode;
})(this);
