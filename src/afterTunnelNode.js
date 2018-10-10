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

      var ballColor = new THREE.Color();
      ballColor.setHSL(
        (.5+ 0.64) % 1,
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
          emissiveIntensity:1,
        });
// PARTICLES
this.generateParticleSprite = function() {
  const canvas = document.createElement( 'canvas' );
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
      
      this.bigSphere = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 32),
        this.ballMaterial)
      var bigSphereLight = new THREE.PointLight(ballColor.getHex(), 1, 850);
      this.bigSphere.add(bigSphereLight);
      // // this.bigSphere.position.z = -75;

      this.scene.add (this.bigSphere);
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
          
        var light = new THREE.PointLight(color.getHex(), 1, 850);
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
      for (let i = 0; i < 1200; i++) 
      {

        const x = i % 50;
        const y = Math.floor(i/50);

        var cube = new THREE.Mesh(cubeGeometry, cubeMaterialWhite);
        this.cubes.push(cube);
        this.scene.add(cube);

        cube.position.x = -900 + 100 * (x) + ((y % 2) * 50);
        cube.position.y = -600 + y * 50;
      }

      this.camera.position.z = 1000;
    }

    update(frame) 
    {
      super.update(frame);

      if(BEAN % 4 == 0 && BEAT)
      {
        this.scaler = 1;
      }
      
      this.scaler *= 0.95;

      this.angle += this.scaler * 0.15;
            
      this.bigSphere.position.x = Math.sin(this.angle * 0.2* Math.PI) * 300;
      this.bigSphere.position.y = Math.cos(this.angle * 0.2* Math.PI) * 300;
      
      const sphereX = this.bigSphere.position.x;
      const sphereY = this.bigSphere.position.y;
      
      for(let i = 0; i < this.cubes.length; i++){
           
        var cube = this.cubes[i];

        var cubeX = cube.position.x;
        var cubeY = cube.position.y;

        var distanceX = sphereX - cubeX;
        var distanceY = sphereY - cubeY;

        var distance = Math.sqrt((distanceX * distanceX)+(distanceY * distanceY));

        cube.position.z = distance -500


        const progress = 1 - this.scaler;
        var targetRotation = Math.PI * 0.5 * (Math.floor(BEAN / 4));
        cube.rotation.x = lerp(targetRotation - Math.PI * 0.5, targetRotation, progress);
        cube.rotation.y = lerp(targetRotation - Math.PI * 0.5, targetRotation, progress);
      }     
    }
  }

  global.afterTunnelNode = afterTunnelNode;
})(this);
