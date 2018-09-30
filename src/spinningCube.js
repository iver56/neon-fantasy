(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  
  class spinningCube extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      
      this.scaler = 0;
      this.angle = 0;
      
      // Orbs
      var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
      
      this.lights = [];
      this.spheres = [];
      for (let i = 0; i < 3; i++) {
        var light = new THREE.PointLight(0xffffff, 1, 800);
        this.lights.push(light);

        var sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 32),
          sphereMaterial);
        sphere.add(light);
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }
      
      // Cubes
      var cubeGeometry = new THREE.BoxGeometry(30, 30, 30);
      var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

      this.cubes = [];
      for (let i = 0; i < 800; i++) {
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cubes.push(cube);
        this.scene.add(cube);

        cube.position.x = (Math.random() * 1600) - 800;
        cube.position.y = (Math.random() * 1000) - 500;
        cube.position.z = (Math.random() * 100) -150 ;        
      }
      
      this.camera.position.z = 1000;
    }
    
    update(frame) {
      super.update(frame);

      F(this.frame, 48 + 2112, 24)
      if(BEAN % 4 == 0 && BEAT)
        this.scaler = 1;
      this.scaler *= 0.95;

      this.angle += this.scaler * 0.15;

      // this.spheres[0].position.x = 100;
      for(let i = 0; i < 3; i++){
        var sphere = this.spheres[i];
        sphere.position.x = Math.sin(this.angle + i * (2/3) * Math.PI) * 300;
        sphere.position.y = Math.cos(this.angle + i * (2/3 * Math.PI)) * 300;
      }

// 0
// 12
// 16
    }
  }

  global.spinningCube = spinningCube;
})(this);
