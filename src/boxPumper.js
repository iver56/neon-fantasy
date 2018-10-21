(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class boxPumper extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.camera.near = 0.1;

      this.snarePumper = 0;

      this.avgBarPower = [
        0.03995973130127326,
        0.035914819653420064,
        0.024812822856103721,
        0.019965229302449377,
        0.01641718101126138,
        0.01219577227582823,
        0.0084967362081906855,
        0.0066816180336877395,
        0.005603657589574872,
        0.0050808975377011345,
        0.005250259812406025,
        0.004825915962458144,
        0.0047933078972314325,
        0.00462622379986742,
        0.003489999386804935,
        0.0034550347460631645,
        0.0023198680798594074,
        0.00225343069341784,
        0.002260510422985606,
        0.002196416854241614,
        0.002183600742469756,
        0.002164816721345884,
        0.002161796941345131,
        0.001976902960733933,
        0.001975547782917297,
      ];
      this.sampleFreq = 44100;  // fallback in case of incompatible nin
      if (demo.music && demo.music.audioContext && demo.music.audioContext.sampleRate) {
        this.sampleFreq = demo.music.audioContext.sampleRate;
      }
      this.nyquistFreq = this.sampleFreq / 2;
      this.maxMel = 2595 * Math.log10(1 + this.nyquistFreq / 700);
      this.numBins = 1024;  // fallback in case of incompatible nin
      if (demo.music && demo.music.getFftSize) {
        this.numBins = demo.music.getFftSize() / 2;
      }
      this.freqPerBin = this.nyquistFreq / this.numBins;
      this.numBars = 25;

      // city columns
      const planeGeometry = new THREE.PlaneGeometry(1, 1, 1);
      this.cityCols = [];
      for (let i = 0; i < 50; i++) {
        const planeMaterial = new THREE.MeshBasicMaterial({
          color: 0xEA21F7,
          side: THREE.FrontSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.cityCols.push(plane);
        this.scene.add(plane);
      }

      // road segments
      this.roadSegments = [];
      for (let i = 0; i < this.numBars * 2; i++) {
        const planeMaterial = new THREE.MeshBasicMaterial({
          color: 0xEA21F7,
          side: THREE.BackSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.roadSegments.push(plane);
        this.scene.add(plane);
      }

      this.createBackground();

      this.camera.position.z = 100;
    }

    createBackground() {
      const backgroundTexture = Loader.loadTexture('res/bg_stripy.png');
      backgroundTexture.minFilter = THREE.LinearFilter;
      backgroundTexture.magFilter = THREE.LinearFilter;
      const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundTexture,
        transparent: true
      });
      const backgroundGeometry = new THREE.PlaneGeometry(16 * 90, 9 * 90, 1);
      this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
      this.background.position.z = -800;
      this.scene.add(this.background);
    }

    getBinAmplitude(fft, i) {
      const fraction = i / this.numBars;
      const mel = this.maxMel * fraction;
      const nextMel = mel + this.maxMel / this.numBars;
      const lowerFreqBound = 700 * (Math.pow(10, mel / 2595) - 1);
      const upperFreqBound = 700 * (Math.pow(10, nextMel / 2595) - 1);
      const lowerBin = 0 | Math.round(lowerFreqBound / this.freqPerBin);
      const upperBin = 0 | Math.round(upperFreqBound / this.freqPerBin);
      const numBins = upperBin - lowerBin;
      const fftSlice = fft.slice(lowerBin, upperBin);
      const fftAvgDb = fftSlice.reduce((a, b) => a + b, 0) / numBins;
      const linearAvg = Math.pow(10, fftAvgDb / 20);  // ranges from 0 to 1
      return clamp(0.01, Math.pow(linearAvg / this.avgBarPower[i], 2), 3);
    }

    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = lerp(
        0.0,
        1.0,
        F(frame, 354, 4)
      ) + lerp(
        0.0,
        1.2,
        F(frame, 390, 10)
      );

      if (BEAN >= 384 && BEAN < 388) {
        demo.nm.nodes.bloom.opacity += lerp(3.5, 0.0, F(frame, 384, 3));
      }

      const t = frame / 60;

      if((BEAN + 4) % 8 === 0 && BEAT) {
        this.snarePumper = 1;
      }
      this.snarePumper *= 0.96;

      const colorizationProgress = F(frame, 354, 3);
      const zoomToCityProgress = F(frame, 354, 8);

      this.camera.position.x = easeOut(
        -10.0,
        0,
        zoomToCityProgress
      );
      this.camera.position.y = easeOut(
        17.04,
        0,
        zoomToCityProgress
      );
      this.camera.position.z = smoothstep(
        0.36,
        100,
        zoomToCityProgress - 0.08
      );
      this.camera.lookAt(
        new THREE.Vector3(
          easeOut(-10.0, 0, zoomToCityProgress),
          easeOut(17.04, 0, zoomToCityProgress),
          easeOut(0, 0, zoomToCityProgress)
        )
      );
      this.camera.fov = smoothstep(170, 45, zoomToCityProgress);
      this.camera.updateProjectionMatrix();

      const fft = demo.music ? demo.music.getFFT() : [];

      for (let i = 0; i < this.cityCols.length; i++) {
        let cityCol = this.cityCols[i];

        let distFromMiddle = Math.min(Math.abs(this.numBars - i), this.numBars - 1);
        let fftOffset = this.getBinAmplitude(fft, distFromMiddle);

        const bassPumper = easeOut(
          1,
          0,
          F(frame, 8 * (0 | (BEAN / 8)), 5)
        );

        const height = 5 + (0.9 + 0.1 * bassPumper) * (
          15 * Math.pow(0.5 + 0.5 * Math.sin(i * 1337), 2)
        ) + bassPumper + 88 * fftOffset;

        cityCol.position.x = smoothstep(
          -100 + i * 5,
          -100 + i * 4 + Math.sin(i * 997) - 20 * Math.sin(t),
          zoomToCityProgress
        );
        cityCol.scale.y = height;
        cityCol.position.y = cityCol.scale.y / 2 + 9;
        cityCol.scale.x = smoothstep(2.66, 3 + 1.7 * this.snarePumper, zoomToCityProgress);

        cityCol.material.color.setHSL(
          (.5 + 0.1 * Math.sin(i * 997)) % 1,
          .5,
          smoothstep(1, 0.5, colorizationProgress)
        );
      }

      for (let i = 0; i < this.roadSegments.length; i++) {
        let roadSeg = this.roadSegments[i];

        const depth = (10000 + i - t * 5) % this.roadSegments.length;

        roadSeg.position.z = 110 - 40 * depth;
        roadSeg.position.y = smoothstep(-40, -5, zoomToCityProgress);

        roadSeg.position.x = 2 * Math.sin(t + Math.PI / 2) * Math.pow(depth, 1.337);
        roadSeg.scale.x = 1000 / (depth + 50);
        roadSeg.scale.y = 25;
        roadSeg.visible = true;
        roadSeg.rotation.x = 0.5 * Math.PI;
        roadSeg.rotation.z = 0.02 * Math.sin(t + Math.PI / 2) * Math.pow(depth, 1.337);

        roadSeg.material.color.setHSL(
          .61 + 0.1 * Math.sin(i * 997),
          .5 + 0.1 * Math.sin(i * 16),
          .5
        );
      }

      // Background
      this.background.material.opacity = lerp(0.0, 1.0, F(frame, 360, 8));

      if (BEAN >= 410) {
        const outProgress = F(frame, 410, 4);

        demo.nm.nodes.bloom.opacity = lerp(2.2, 1.1, outProgress);

        for (let i = 0; i < this.roadSegments.length; i++) {
          let roadSeg = this.roadSegments[i];
          roadSeg.position.y += lerp(0, -60, outProgress);
        }
        for (let i = 0; i < this.cityCols.length; i++) {
          let cityCol = this.cityCols[i];
          cityCol.position.x -= easeOut(0, 110, outProgress);
        }
      }
    }

    warmup(renderer) {
      this.update(4033);
      this.render(renderer);
    }
  }

  global.boxPumper = boxPumper;
})(this);
