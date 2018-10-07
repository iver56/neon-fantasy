(function(global) {
  class afterTunnelNode extends NIN.THREENode {
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

      
      for (let i = 0; i < 3; i++) 
      {
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
          sphere.scale.x = 0;
          sphere.scale.y = 0;
          sphere.scale.z = 0;
          

        sphere.add(light);
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      
      // Cubes
      var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
      var cubeMaterialWhite = new THREE.MeshLambertMaterial({color: 0xdddddd});
      var cubeMaterialBlack = new THREE.MeshLambertMaterial({color: 0x222222});

      this.cubes = [];
      for (let i = 0; i < 1200; i++) {

        const x = i % 50;
        const y = Math.floor(i/50);

        var cube = new THREE.Mesh(cubeGeometry, cubeMaterialWhite);
        this.cubes.push(cube);
        this.scene.add(cube);

        cube.position.x = -900 + 100 * (x) + ((y % 2) * 50);
        cube.position.y = -600 + y * 50;
        cube.position.z = -150;

      }

      // var light = new THREE.PointLight(0xffffff, 1, 10000);
      // light.position.set(0, 0, 100);
      // this.scene.add(light);

      this.camera.position.z = 1000;
    }

    update(frame) {
      super.update(frame);

      if(BEAN % 4 == 0 && BEAT)
        {
          this.scaler = 1;
        }
        
        this.scaler *= 0.95;

        this.angle += this.scaler * 0.15;
        const rotationSpeed = 0.05;
        const rotationSpeedConstant = 0.005;

      for(let i = 0; i < this.cubes.length; i++){
           
        var cube = this.cubes[i];
        // const x = i % 50;
        // const y = Math.floor(i/50);
        // var test = (x + y) % 3 == 0;

        // if(test){
        //   cube.scale.x = this.scaler;
        //   cube.scale.y = this.scaler;
        //   cube.scale.z = this.scaler;
        // }

        const progress = 1-this.scaler;
        // var startRotation = Math.floor(BEAN / 4);
        var targetRotation = Math.PI * 0.5 * (Math.floor(BEAN / 4));
        cube.rotation.x = lerp(targetRotation - Math.PI * 0.5, targetRotation, progress);
        cube.rotation.y = lerp(targetRotation - Math.PI * 0.5, targetRotation, progress);

        // cube.rotation.x += this.scaler * rotationSpeed + Math.random() * rotationSpeedConstant;
        // cube.rotation.y += this.scaler * rotationSpeed + Math.random() * rotationSpeedConstant;                    
      }

      

    }
  }

  global.afterTunnelNode = afterTunnelNode;
})(this);
