import * as React from "react";
import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {
  BokehShader,
  BokehDepthShader
} from 'three/examples/jsm/shaders/BokehShader2.js';
// import { Vector3 } from "three";


class Galaxy extends React.Component{
  constructor(props) {
    super(props);
  
    // Initializing the state 
    this.state = { color: 'lightgreen' };
  }
  componentDidMount() {
    //funcions
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      postprocessing.rtTextureDepth.setSize(window.innerWidth, window.innerHeight);
      postprocessing.rtTextureColor.setSize(window.innerWidth, window.innerHeight);
      postprocessing.bokeh_uniforms["textureWidth"].value = window.innerWidth;
      postprocessing.bokeh_uniforms["textureHeight"].value = window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onPointerMove(event: { isPrimary: boolean; clientX: number; clientY: number; }) {
      // if (event.isPrimary === false) return;

      // mouse.x = (event.clientX - windowHalfX) / windowHalfX;
      // mouse.y = - (event.clientY - windowHalfY) / windowHalfY;

      // postprocessing.bokeh_uniforms['focusCoords'].value.set(event.clientX / window.innerWidth, 1 - (event.clientY / window.innerHeight));

      // mouse.x = (event.clientX - windowHalfX) / windowHalfX;
      // mouse.y = -(event.clientY - windowHalfY) / windowHalfY;
      // raycaster.setFromCamera(mouse, camera);

      // const intersections = raycaster.intersectObjects( [points[0]], false );
      // const intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

      // if(intersection !=null)
      // {
      //   lensmesh.position.copy( intersection.point );
      //   lensmesh.scale.set( 0.6, 0.6, 0.6 );
      // }

      // raycaster.setFromCamera(mouse, camera);
      // const intersects = raycaster.intersectObjects(scene.children, true);
      // const targetDistance = (intersects.length > 0) ? intersects[0].distance : 1000;
      // distance += (targetDistance - distance) * 0.03;
      // const sdistance = smoothstep(camera.near, camera.far, distance);
      // const ldistance = linearize(1 - sdistance);
      // postprocessing.bokeh_uniforms['focalDepth'].value = ldistance;
      // effectController['focalDepth'] = ldistance;
      // console.log(ldistance);
    }

    function initPostprocessing() {

      postprocessing.camera.position.z = 0.1;
      // postprocessing.scene.add(postprocessing.camera);
      postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight
      );
      postprocessing.rtTextureColor = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight
      );

      const bokeh_shader = BokehShader;
      postprocessing.bokeh_uniforms = THREE.UniformsUtils.clone(
        bokeh_shader.uniforms
      );

      postprocessing.bokeh_uniforms["tColor"].value =
        postprocessing.rtTextureColor.texture;
      postprocessing.bokeh_uniforms["tDepth"].value =
        postprocessing.rtTextureDepth.texture;
      postprocessing.bokeh_uniforms["textureWidth"].value = window.innerWidth;
      postprocessing.bokeh_uniforms["textureHeight"].value = window.innerHeight;

      postprocessing.materialBokeh = new THREE.ShaderMaterial({
        uniforms: postprocessing.bokeh_uniforms,
        vertexShader: bokeh_shader.vertexShader,
        fragmentShader: bokeh_shader.fragmentShader,
        defines: {
          RINGS: shaderSettings.rings,
          SAMPLES: shaderSettings.samples
        }
      });

      postprocessing.quad = new THREE.Mesh(
        new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
        postprocessing.materialBokeh
      );
      postprocessing.quad.position.z = -0.5;
      postprocessing.scene.add(postprocessing.quad);
    }

    function shaderUpdate() {
      postprocessing.materialBokeh.defines.RINGS = shaderSettings.rings;
      postprocessing.materialBokeh.defines.SAMPLES = shaderSettings.samples;
      postprocessing.materialBokeh.needsUpdate = true;
    }
    function linearize(depth: number) {
      const zfar = camera.far;
      const znear = camera.near;
      return (-zfar * znear) / (depth * (zfar - znear) - zfar);
    }

    function smoothstep(near: number, far: number, depth: number) {
      const x = saturate((depth - near) / (far - near));
      return x * x * (3 - 2 * x);
    }

    function saturate(x: number) {
      return Math.max(0, Math.min(1, x));
    }

    const matChanger = function () {
      for (const e in effectController) {
        if (e in postprocessing.bokeh_uniforms) {
          postprocessing.bokeh_uniforms[e].value = effectController[e];
        }
      }
      postprocessing.enabled = effectController.enabled;
      postprocessing.bokeh_uniforms["znear"].value = camera.near;
      postprocessing.bokeh_uniforms["zfar"].value = camera.far;
      camera.setFocalLength(effectController.focalLength);
      // console.log(postprocessing.bokeh_uniforms);
    };

    const tick = () => {
      // console.log(camera.position);
      const elapsedTime = clock.getElapsedTime();

      controls.update();
      camera.lookAt(0, 0, 0);

      let delta = elapsedTime - oldtime;
      let halflife = 10;
      if (delta > halflife || oldtime === 0) {
        for (let i = 0, l = parameters.count[0]; i < l; i++) {
          changex[i] = (Math.random() - 0.5) * parameters.change;
          changey[i] = ((Math.random() - 0.5) * parameters.change) / 2;
          changez[i] = (Math.random() - 0.5) * parameters.change;
        }
        oldtime = elapsedTime;
      }
      let positionss = points[0].geometry.attributes.position.array;

      let index = 0;
      for (let i = 0, l = parameters.count[0]; i < l; i++) {
        positionss[index] =
          basepositionss[index] + changex[i] * (delta - halflife / 2.0);
        positionss[index + 1] =
          basepositionss[index + 1] + changey[i] * (delta - halflife / 2.0);
        positionss[index + 2] =
          basepositionss[index + 2] + changez[i] * (delta - halflife / 2.0);
        index = index + 3;
      }
      camera.position.x +=
        changex[0] * 20 * Math.cos((delta / halflife) * Math.PI * 0.16);
      camera.position.z +=
        changex[0] * 20 * Math.sin((delta / halflife) * Math.PI * 0.16);

      camera.updateMatrixWorld();
      if (effectController.jsDepthCalculation) {
        //add bloom effect controller
      }
      if (postprocessing.enabled) {
        renderer.clear();
        renderer.setRenderTarget(postprocessing.rtTextureColor);
        renderer.clear();
        renderer.render(scene, camera);
        scene.overrideMaterial = materialDepth;
        renderer.setRenderTarget(postprocessing.rtTextureDepth);
        renderer.clear();
        renderer.render(scene, camera);
        scene.overrideMaterial = null;
        renderer.setRenderTarget(null);
        renderer.render(postprocessing.scene, postprocessing.camera);
      } else {
        scene.overrideMaterial = null;
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(scene, camera);
      }


      points[0].geometry.attributes.position.needsUpdate = true;
      points[0].material.needsUpdate = true;
      // lensmesh.geometry.attributes.position.needsUpdate = true;
      // stats.update();
      window.requestAnimationFrame(tick);

    };

    //variable definitions
    let lensmesh = new THREE.Mesh();
    let materialDepth: THREE.ShaderMaterial;
    let container;//, stats: Stats;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    let distance = 0.1;
    let effectController: { [key: string]: any } = {
      enabled: true,
      jsDepthCalculation: true,
      shaderFocus: false,
      fstop: 2.2,
      maxblur: 0.325,
      showFocus: false,
      focalDepth: 0.05,
      manualdof: false,
      vignetting: false,
      depthblur: false,
      threshold: 0.5,
      gain: 2.0,
      bias: 0.5,
      fringe: 0.1,
      focalLength: 35,
      noise: true,
      pentagon: false,
      dithering: 0.0001,
      zfar: 0.2,
      znear: 0.1,
    };

    let bokeh_uniformss: { [key: string]: any } =
    {
      bias: { value: 0.5 },
      depthblur: { value: false },
      dithering: { value: 0.0001 },
      focalDepth: { value: 0.05 },
      focalLength: { value: 35 },
      focusCoords: { value: new THREE.Vector2() },
      fringe: { value: 0.7 },
      fstop: { value: 2.2 },
      gain: { value: 2 },
      manualdof: { value: false },
      maxblur: { value: 0.325 },
      noise: { value: true },
      pentagon: { value: false },
      shaderFocus: { value: false },
      showFocus: { value: false },
      tColor: { value: new THREE.Texture() },
      tDepth: { value: new THREE.Texture() },
      textureHeight: { value: 639 },
      textureWidth: { value: 1280 },
      threshold: { value: 0.5 },
      vignetting: { value: false },
      zfar: { value: 0.2 },
      znear: { value: 0.1 },

    }

    const postprocessing = {
      enabled: true,
      rtTextureColor: new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight
      ),
      scene: new THREE.Scene(),
      materialBokeh: new THREE.ShaderMaterial(),
      quad: new THREE.Mesh(),
      bokeh_uniforms: bokeh_uniformss,
      rtTextureDepth: new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight
      ),
      camera: new THREE.OrthographicCamera(
        window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        -10000,
        10000
      ),
    };

    const shaderSettings = {
      rings: 3,
      samples: 4
    };

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const scene = new THREE.Scene();
    const parameters = {
      count: [30000, 2000, 15000],
      size: [0.0003, 0.0007, 0.0002],
      radius: [0.2, 0.3, 0.2],
      randomnessH: [0.01, 0.04, 0.02],
      randomnessV: [0, 0.04, 0.0005],
      colors: [
        [
          "#00FFFF",
          "#0d5ab9",
          "#0d5ab9",
          "#b930cb",
          "#0d5ab9",
          "#00FFFF",
          "#0d5ab9"
        ],
        [
          "#05a7ff",
          "#05a7ff",
          "#00FFFF",
          "#00FFFF",
          "#00FFFF",
          "#00FFFF",
          "#00FFFF"
        ],
        [
          "#00FFFF",
          "#7EC8E3",
          "#7EC8E3",
          "#b930cb",
          "#0d5ab9",
          "#00FFFF",
          "#b930cb"
        ]
      ],
      randomnessHDiff: [Math.PI / 1.65, Math.PI / 4, Math.PI / 2],
      randomnessVDiff: [Math.PI / 1.8, Math.PI / 3, Math.PI / 3],
      numOfRings: 7,
      sineNum: 16,
      sineYShift: 4,
      numOfClasses: 3,
      sineHPower: 1 / 600,
      sineVPower: 1 / 2000,
      change: 1 / 1000000
    };

    // let material = null;
    let geometry;
    let points: any[] = [];
    let oldtime = 0.0;
    let changex = new Float32Array(parameters.count[0]);
    let changey = new Float32Array(parameters.count[0]);
    let changez = new Float32Array(parameters.count[0]);
    let basepositionss = new Float32Array(parameters.count[0] * 3);

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    const camera = new THREE.PerspectiveCamera(
      50,
      sizes.width / sizes.height,
      0.0000001,
      2000
    );

    camera.filmGauge = 35;
    camera.filmOffset = 0;
    camera.zoom = 1;
    camera.focus = 0.2;

    camera.position.x = 0.036;
    camera.position.y = 0.028;
    camera.position.z = 0.014;
    // scene.add(camera);

    container = document.createElement("div");
    document.body.appendChild(container);

    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const clock = new THREE.Clock();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    const depthShader = BokehDepthShader;

    materialDepth = new THREE.ShaderMaterial({
      uniforms: depthShader.uniforms,
      vertexShader: depthShader.vertexShader,
      fragmentShader: depthShader.fragmentShader
    });

    materialDepth.uniforms["mNear"].value = camera.near;
    materialDepth.uniforms["mFar"].value = camera.far;

    // stats = new (Stats as any)();
    // container.appendChild(stats.dom);

    container.style.touchAction = "auto";
    container.addEventListener("pointermove", onPointerMove);

    // const gui = new GUI();
    // gui.add(effectController, "enabled").onChange(matChanger);
    // gui.add(effectController, "jsDepthCalculation").onChange(matChanger);
    // gui.add(effectController, "shaderFocus").onChange(matChanger);
    // gui
    //   .add(effectController, "focalDepth", 0.0, 0.1)
    //   .listen()
    //   .onChange(matChanger);
    // gui
    //   .add(effectController, "znear", 0.0, 2.0)
    //   .listen()
    //   .onChange(matChanger);
    // gui
    //   .add(effectController, "zfar", 0.0, 2.0)
    //   .listen()
    //   .onChange(matChanger);
    // gui.add(effectController, "fstop", 0.1, 22, 0.001).onChange(matChanger);
    // gui.add(effectController, "maxblur", 0.0, 5.0, 0.025).onChange(matChanger);
    // gui.add(effectController, "showFocus").onChange(matChanger);
    // gui.add(effectController, "manualdof").onChange(matChanger);
    // gui.add(effectController, "vignetting").onChange(matChanger);
    // gui.add(effectController, "depthblur").onChange(matChanger);
    // gui.add(effectController, "threshold", 0, 1, 0.001).onChange(matChanger);
    // gui.add(effectController, "gain", 0, 100, 0.001).onChange(matChanger);
    // gui.add(effectController, "bias", 0, 3, 0.001).onChange(matChanger);
    // gui.add(effectController, "fringe", 0, 5, 0.001).onChange(matChanger);
    // gui.add(effectController, "focalLength", 16, 80, 0.001).onChange(matChanger);
    // gui.add(effectController, "noise").onChange(matChanger);
    // gui.add(effectController, "dithering", 0, 0.001, 0.0001).onChange(matChanger);
    // gui.add(effectController, "pentagon").onChange(matChanger);
    // gui.add(shaderSettings, "rings", 1, 8).step(1).onChange(shaderUpdate);
    // gui.add(shaderSettings, "samples", 1, 13).step(1).onChange(shaderUpdate);



    window.addEventListener("resize", onWindowResize);

    //generate galaxy
    var loader = new THREE.TextureLoader();
    var texture = loader.load(
      process.env.PUBLIC_URL + "/circletex.png"
    );
    for (let index = 0; index < 3; index++) {
      const material = new THREE.PointsMaterial({
        size: parameters.size[index],
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        map: texture,
      });
      let varr = 0;
      if (index > 0) {
        varr = 1;
      }
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count[index] * 3);
      const colors = new Float32Array(parameters.count[index] * 3);
      let numInRing = parameters.count[index] / parameters.numOfRings;
      console.log(numInRing);
      let ringstops = [0, numInRing * 0.05, numInRing * 0.3, numInRing * 0.8, numInRing * 1.5, numInRing * 2.5, numInRing * 4.5];
      let ringendings = [numInRing * 0.05, numInRing * 0.25, numInRing * 0.5, numInRing * 0.7, numInRing * 1.0, numInRing * 2.0, numInRing * 2.5];
      if (index > 0) {
        ringstops = [0, numInRing, numInRing * 2, numInRing * 3, numInRing * 4, numInRing * 5, numInRing * 6];
        ringendings = [numInRing, numInRing, numInRing, numInRing, numInRing, numInRing, numInRing];
      }
      for (let i = 0; i < parameters.count[index]; i++) {
        const i3 = i * 3;
        let M1 = 0;
        if (i > ringstops[6]) {
          M1 = 6;
        }
        else if (i > ringstops[5]) {
          M1 = 5;
        }
        else if (i > ringstops[4]) {
          M1 = 4;
        }
        else if (i > ringstops[3]) {
          M1 = 3;
        }
        else if (i > ringstops[2]) {
          M1 = 2;
        }
        else if (i > ringstops[1]) {
          M1 = 1;
        }
        else if (i > ringstops[0]) {
          M1 = 0;
        }
        // let M1 = Math.floor(
        //   i / (numInRing)
        // );

        // if(index==0 && M1==0 && i%20==0)
        // {
        //   continue;
        // }
        // if(index==1 && M1==0)
        // {
        //   varr=0;
        // }
        const radius =
          parameters.radius[index] *
          ((M1 + varr) / 60 +
            (Math.random() - 0.5) * parameters.randomnessH[index] +
            Math.sin(
              (i * Math.PI * parameters.sineNum * M1) /
              parameters.numOfRings /
              (ringendings[M1] / 2) +
              M1 * parameters.randomnessHDiff[index]
            ) *
            parameters.sineHPower);

        positions[i3] =
          Math.cos(
            (i * Math.PI) / (ringendings[M1] / 2)
          ) * radius;
        positions[i3 + 1] =
          (Math.random() - 0.5) * parameters.randomnessV[index] +
          Math.sin(
            ((i * Math.PI * parameters.sineNum * M1) / parameters.numOfRings +
              (M1 * Math.PI) / parameters.sineYShift) /
            (ringendings[M1] / 2) +
            M1 * parameters.randomnessVDiff[index]
          ) *
          parameters.sineVPower;
        positions[i3 + 2] =
          Math.sin(
            (i * Math.PI) / (ringendings[M1] / 2)
          ) * radius;
        const mixedColor = new THREE.Color(parameters.colors[index][M1]);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
      if (index === 0) {
        basepositionss = positions;

      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      let pointss = new THREE.Points(geometry, material);
      scene.add(pointss);
      points.push(pointss);
    }

    //bokeh post processing
    initPostprocessing();
    matChanger();

    //lens processing
    // const sphereGeometry = new THREE.SphereGeometry( 0.0005 );

    // const lensmaterial = new THREE.MeshPhysicalMaterial({})
    // lensmaterial.transmission = 1.0
    // lensmaterial.roughness = 0.00
    // lensmaterial.metalness = 0
    // lensmaterial.clearcoat = 0.5
    // lensmaterial.color = new THREE.Color(0xFFFFFF)
    // lensmaterial.ior = 1.2
    // lensmaterial.thickness = 0.005

    // lensmesh = new THREE.Mesh(sphereGeometry, lensmaterial)
    // lensmesh.position.set(0, 0, 0);

    // scene.add(lensmesh);

    //render loop
    tick();

  }
  render(){
        return <div id="galaxy">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </div>;
}
}
export default Galaxy