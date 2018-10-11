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
      this.scaler = 1;

      // this.bigSphereTexture = Loader.loadTexture('res/ivertex2.png');
      // this.bigSphereTexture.minFilter = THREE.LinearFilter;
      // this.bigSphereTexture.magFilter = THREE.LinearFilter;
      // this.bigSphereMaterial = new THREE.MeshStandardMaterial({
      //   shading: THREE.FlatShading,
      //   metalness: 1,
      //   roughness: 0.5,
      //   map: this.bigSphereTexture,
      //   emissive: 0x111111,
      //   emissiveMap: this.bigSphereTexture,
      //   emissiveIntensity:1,

      // });

      // // Giant sphere
      // this.bigSphereGeometry = new THREE.SphereGeometry(4000,1000,1000);
      // this.bigSphere = new THREE.Mesh(this.bigSphereGeometry, this.bigSphereMaterial)
      // this.bigSphere.scale.x = -1;
      // this.bigSphere.scale.y = -1;
      // this.bigSphere.scale.z = -1;
      // this.bigSphere.rotation.z = -Math.PI /2;
      // this.bigSphere.position.y = 3000;
      // this.bigSphere.position.z = -1500;
      // this.scene.add(this.bigSphere);


	//bigass cylinder
	var geometryCylinder = new THREE.CylinderGeometry(3000,3000,6000,64,12, true);
	var materialCylinder = new THREE.MeshBasicMaterial({
		wireframe: true,
    color: 0x881DF7,
	});
  
  this.cylinderWrapper = new THREE.Object3D();
  this.cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
  
  this.cylinder.rotation.z = 1.57;

  var geometryHackCylinder = new THREE.CylinderGeometry(2950,2950,6000,64,12, true);

	var hackCylinderMaterial = new THREE.MeshBasicMaterial({
    color: 0x0E0011,
	});

  this.goodHackCylinder = new THREE.Mesh(geometryHackCylinder,hackCylinderMaterial);
  this.goodHackCylinder.rotation.z = 1.57;

  this.cylinderWrapper.add(this.goodHackCylinder);
  this.cylinderWrapper.add(this.cylinder);
  this.scene.add(this.cylinderWrapper);
  
  this.castleTexture = Loader.loadTexture('res/test.png');
  this.castleTexture.minFilter = THREE.LinearFilter;
  this.castleTexture.magFilter = THREE.LinearFilter;
  this.castleMaterial = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0.5,
    map: this.castleTexture,
    emissive: 0x30F5E0,
    emissiveMap: this.castleTexture,
    emissiveIntensity:1,
  });
      
  this.mathThingy = 2 * Math.PI / 10;


      this.castles = [];

      var t = Date.now() / 1000; // The number of seconds elapsed since 1 January 1970 00:00:00 UTC

      for(let i = 0; i < 10; i++)
      {
        var turretGeometry = new THREE.BoxGeometry(100, 300, 100);
        var wallGeometry = new THREE.BoxGeometry(200, 100, 50);

        var castle = new THREE.Group();
        
        let turretOffset = 150;
        let turretHeightFromGround = 150;
        let wallHeightFromGround = -50;

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
        wall1.position.y = -wallHeightFromGround;
        castle.add(wall1);

        var wall2 = new THREE.Mesh(wallGeometry,this.castleMaterial);
        wall2.position.z = -turretOffset;
        wall2.position.y = -wallHeightFromGround;

        castle.add(wall2);

        var wall3 = new THREE.Mesh(wallGeometry,this.castleMaterial);
        wall3.position.x = turretOffset;
        wall3.position.y = -wallHeightFromGround;

        wall3.rotation.y = Math.PI/2;
        castle.add(wall3);

        var wall4 = new THREE.Mesh(wallGeometry,this.castleMaterial);
        wall4.position.x = -turretOffset;
        wall4.position.y = -wallHeightFromGround;
        wall4.rotation.y = Math.PI/2;
        castle.add(wall4);

        this.castles.push(castle); 
        this.cylinderWrapper.add(castle);
        // castle.position.z = -1000;


        castle.position.y = 3000 * Math.sin(this.mathThingy * i);
        castle.position.z = 3000 * Math.cos(this.mathThingy * i);
        castle.rotation.x = ((-2  * Math.PI) / (10) * i) + Math.PI/2;

        if(i % 2 == 0){
          castle.position.x = 200;
        }
        else {
          castle.position.x = -200;
        }
      }

      this.camera.far = 10000;
      this.camera.position.y = 3500;
      this.camera.position.z = 1000;
      this.camera.rotation.x = -0.3;
      
      

      // let light = new THREE.PointLight(0xffffff, 1, 10000);
      // light.position.set(50, 50, 50);
      // this.scene.add(light);
    }

    update(frame) {
      super.update(frame);

      if(BEAN % 4 == 0 && BEAT)
      {
        this.scaler = 1;
      }
      
      this.scaler *= 0.95;

      const progress = 1 - this.scaler;
      var targetRotation = Math.PI * 0.5 * (Math.floor(BEAN / 4));
      // castle.rotation.y = lerp(targetRotation - Math.PI * 0.5, targetRotation, progress);
      
      // this.castles.forEach(castle => {       
      //   castle.rotation.y = lerp(targetRotation - Math.PI * 0.5, targetRotation, progress);
      // });

      this.castles[4].rotation.y = easeOut(0, Math.PI, F(frame, 100, 4));
      this.castles[5].rotation.y = easeOut(0, Math.PI, F(frame, 108, 4));
      this.castles[6].rotation.y = easeOut(0, Math.PI, F(frame, 116, 4));
      this.castles[7].rotation.y = easeOut(0, Math.PI, F(frame, 124, 4));
      this.castles[8].rotation.y = easeOut(0, Math.PI, F(frame, 132, 4));
      this.castles[9].rotation.y = easeOut(0, Math.PI, F(frame, 140, 4));
      this.castles[0].rotation.y = easeOut(0, Math.PI, F(frame, 148, 4));

      // Move world into view in the start of the effect
      this.cylinderWrapper.position.y = easeOut(-3000, 0, F(frame, 96, 4));

      this.cylinderWrapper.rotation.x = (
        easeOut(0, this.mathThingy, F(frame, 96, 4)) +
        easeOut(0, this.mathThingy, F(frame, 104, 4)) +
        easeOut(0, this.mathThingy, F(frame, 112, 4)) +
        easeOut(0, this.mathThingy, F(frame, 120, 4)) +
        easeOut(0, this.mathThingy, F(frame, 128, 4)) +
        easeOut(0, this.mathThingy, F(frame, 136, 4)) +
        easeOut(0, this.mathThingy, F(frame, 144, 4))
      ) + Math.PI / 20;
    }
  }

  global.neonCityNode = neonCityNode;
})(this);
