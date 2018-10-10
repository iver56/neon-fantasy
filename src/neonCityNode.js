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

      this.castleTexture = Loader.loadTexture('res/test.png');
      this.castleTexture.minFilter = THREE.LinearFilter;
      this.castleTexture.magFilter = THREE.LinearFilter;
      this.castleMaterial = new THREE.MeshStandardMaterial({
        shading: THREE.FlatShading,
        metalness: 1,
        roughness: 0.5,
        map: this.castleTexture,
        emissive: 0xffffff,
        emissiveMap: this.castleTexture,
        emissiveIntensity:1,
      });
      
      this.castles = [];

      for(let i = 0; i < 1; i++)
      {
        var turretGeometry = new THREE.BoxGeometry(100, 300, 100);
        var wallGeometry = new THREE.BoxGeometry(200, 100, 50);

        var castle = new THREE.Group();
        
        let turretOffset = 150;
        let turretHeightFromGround = 100;

        var turret1 = new THREE.Mesh(turretGeometry, this.castleMaterial);
        turret1.position.x = turretOffset;
        turret1.position.z = turretOffset;
        turret1.position.y = turretHeightFromGround;
        castle.add(turret1);

        var turret2 = new THREE.Mesh(turretGeometry, this.castleMaterial);
        turret2.position.x = -turretOffset;
        turret2.position.z = -turretOffset;
        turret2.position.y = turretHeightFromGround;
        castle.add(turret2);

        var turret3 = new THREE.Mesh(turretGeometry, this.castleMaterial);
        turret3.position.x = -turretOffset;
        turret3.position.z = turretOffset;
        turret3.position.y = turretHeightFromGround;
        castle.add(turret3);

        var turret4 = new THREE.Mesh(turretGeometry, this.castleMaterial);
        turret4.position.x = turretOffset;
        turret4.position.z = -turretOffset;
        turret4.position.y = turretHeightFromGround;
        castle.add(turret4);

        var wall1 = new THREE.Mesh(wallGeometry,this.castleMaterial);
        wall1.position.z = turretOffset;
        castle.add(wall1);

        var wall2 = new THREE.Mesh(wallGeometry,this.castleMaterial);
        wall2.position.z = -turretOffset;
        castle.add(wall2);

        var wall3 = new THREE.Mesh(wallGeometry,this.castleMaterial);
        wall3.position.x = turretOffset;
        wall3.rotation.y = Math.PI/2;
        castle.add(wall3);

        var wall4 = new THREE.Mesh(wallGeometry,this.castleMaterial);
        wall4.position.x = -turretOffset;
        wall4.rotation.y = Math.PI/2;
        castle.add(wall4);

        this.castles.push(castle);

        this.scene.add(castle);

      }

      this.camera.position.z = 1000;

      // let light = new THREE.PointLight(0xffffff, 1, 10000);
      // light.position.set(50, 50, 50);
      // this.scene.add(light);
    }

    update(frame) {
      super.update(frame);

      this.castles.forEach(castle => {
        castle.rotation.x += 0.01;
        castle.rotation.y += 0.01;

      });
    }
  }

  global.neonCityNode = neonCityNode;
})(this);
