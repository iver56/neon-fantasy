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
        cube.position.z = (Math.random() * 100) -150 ;        
      }
      
      this.camera.position.z = 1000;
    }
    
    
    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = this.scaler;

      if(BEAN % 4 === 0 && BEAT
        && BEAN !== 4
        && BEAN !== 8)
        {
          this.scaler = 1;

        }
        
        this.scaler *= 0.95;

        this.angle += this.scaler * 0.15;

      // Update sphere positions
      for(let i = 0; i < 3; i++){
        var sphere = this.spheres[i];
        sphere.position.x = Math.sin(this.angle + i * (2/3) * Math.PI) * 300;
        sphere.position.y = Math.cos(this.angle + i * (2/3 * Math.PI)) * 300;
      }

      // Update cube scaling
      for (let i = 0; i < this.cubes.length; i++) {
        let cube = this.cubes[i];
        let scaleDelta = 0.15 * Math.sin(i) + 0.3;
        cube.scale.x = smoothstep(
          0.0001,
          scaleDelta + Math.atan(0.5 + this.scaler),
          F(0 | (frame - i / 3), 0, 8)
        );
        cube.scale.y = cube.scale.x;
        cube.scale.z = cube.scale.x;
      }

      this.spheres[1].visible = BEAN >= 12; // Reveal second sphere
      this.spheres[2].visible = BEAN >= 16; // Reveal third sphere
      
      // Scale up with guitar
      if(BEAN >= 28 && BEAN < 32)
      {
        for(let i = 0; i < 3; i++){
          var sphere = this.spheres[i];
          sphere.scale.x = 1 + (1 - this.scaler) * 2;
          sphere.scale.y = 1 + (1 - this.scaler) * 2;
        }
      }

      // Scale down with guitar
      if(BEAN >= 32 && BEAN < 54)
      {
        var less = 0.01;
        less -= this.scaler * 0.01;
        for(let i = 0; i < 3; i++){
          var sphere = this.spheres[i];
          sphere.scale.x -= less;
          sphere.scale.y -= less;
        }
      }

      // Start spinning cubes, moving from center to edge
      if(BEAN >= 32 && BEAN < 48)
      {
        const positionIncrease = 13;
        this.cubePosCheckX += this.scaler * positionIncrease;
        this.cubePosCheckY += this.scaler * positionIncrease;
        for(let i = 0; i < this.cubes.length; i++){
           
          let cube = this.cubes[i];
          const checkX = Math.abs(cube.position.x) < this.cubePosCheckX;
          const checkY = Math.abs(cube.position.y) < this.cubePosCheckY;
          
          if(checkX && checkY)
          {
            cube.rotation.x += this.scaler* 0.2;
            cube.rotation.y += this.scaler * 0.2;
            cube.rotation.z += this.scaler * 0.2;
          }            
        }
      }

      // Lerp cubes to donut shapes
      if(BEAN >= 48 && BEAN < 64)
      {
        for(let i = 0; i < this.cubes.length; i++){
           
          var cube = this.cubes[i];
          var progress = this.scaler * 0.07;
          
          if(i < 100)
          {
            cube.position.x = lerp(cube.position.x, 100 * Math.cos(i / 9), progress);
            cube.position.y = lerp(cube.position.y, 100 * Math.sin(i / 9), progress);
          }
          else if(i < 350) 
          {
            cube.position.x = lerp(cube.position.x, 300 * Math.cos(i / 9), progress);
            cube.position.y = lerp(cube.position.y, 300 * Math.sin(i / 9), progress);
          }
          else 
          {
            cube.position.x = lerp(cube.position.x, 500 * Math.cos(i / 9), progress);
            cube.position.y = lerp(cube.position.y, 500 * Math.sin(i / 9), progress);
          }          
        }
      }

      // Spin donuts, zoom in, spread cube z axis
      if(BEAN >= 64 && BEAN < 80)
      {
        this.camera.position.z -= this.scaler * 10;

        let less = 0.01;
        less += this.scaler * 0.03;
        for(let i = 0; i < 3; i++){
          let sphere = this.spheres[i];
          sphere.scale.x = Math.max(0, sphere.scale.x - less);
          sphere.scale.y = Math.max(0, sphere.scale.y - less);
        }

        for(let i = 0; i < this.cubes.length; i++){
          let cube = this.cubes[i];

          if(i < 100)
          {
            cube.position.x = Math.sin(-this.angle + i) * 100;
            cube.position.y = Math.cos(-this.angle + i) * 100;
            cube.position.z -= this.scaler * i % 8;
          }
          else if(i < 350)
          {
            cube.position.x = Math.sin(this.angle + i) * 300;
            cube.position.y = Math.cos(this.angle + i) * 300;
            cube.position.z -= this.scaler * i % 8;
          }
          else{
            cube.position.x = Math.sin(-this.angle + i) * 500;
            cube.position.y = Math.cos(-this.angle + i) * 500;
            cube.position.z -= this.scaler * i % 8;
          }
        }
      }

      this.camera.fov = easeOut(45, 1, F(frame, 92, 4));
      this.camera.updateProjectionMatrix();
    }
    // end at 96 
  }

  global.spinningCube = spinningCube;
})(this);
