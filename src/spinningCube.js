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
      this.cubePosCheckX = 0;
      this.cubePosCheckY = 0;
      
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
      if(BEAN % 4 == 0 && BEAT
        && BEAN != 4
        && BEAN != 8)
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
      for(let i = 0; i < this.cubes.length; i++){
        var cube = this.cubes[i];
        var scaleDelta = 0.15 * Math.sin(i) + 0.3;
        cube.scale.x = scaleDelta + Math.atan(0.5 + this.scaler) ;
        cube.scale.y = scaleDelta + Math.atan(0.5 + this.scaler);
        cube.scale.z = scaleDelta + Math.atan(0.5 + this.scaler);
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

      if(BEAN >= 48 && BEAN < 64)
      {
        const positionIncrease = 13;
        this.cubePosCheckX += this.scaler * positionIncrease;
        this.cubePosCheckY += this.scaler * positionIncrease;
        for(let i = 0; i < this.cubes.length; i++){
           
          var cube = this.cubes[i];
          var checkX = Math.abs(cube.position.x) < this.cubePosCheckX;
          var checkY = Math.abs(cube.position.y) < this.cubePosCheckY;
          
          if(checkX && checkY)
          {
            cube.rotation.x += this.scaler* 0.2;
            cube.rotation.y += this.scaler * 0.2;
            cube.rotation.z += this.scaler * 0.2;
          }            
        }
      }

      if(BEAN >= 64 && BEAN < 80)
      {
        for(let i = 0; i < this.cubes.length; i++){
           
          var cube = this.cubes[i];
          var progress = this.scaler * 0.05;
          
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
    }


    // end at 96 
  }

  global.spinningCube = spinningCube;
})(this);
