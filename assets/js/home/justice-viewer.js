import * as THREE from '../../vendor/three/three.module.min.js';
import { GLTFLoader } from '../../vendor/three/GLTFLoader.js';
import { RoomEnvironment } from '../../vendor/three/RoomEnvironment.js';

const TURN_SECONDS = 36;

export async function initJusticeViewer() {
  const stage = document.querySelector('.justice-stage');
  const canvas = stage?.querySelector('.justice-canvas');
  const status = stage?.querySelector('[data-statue-status]');
  if (!stage || !canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    stage.setAttribute('aria-busy', 'false');
    if (status) status.textContent = '3D view unavailable in this browser';
    return;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .01, 50);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf5dfb8, 0x151c1a, 1.5));
  const key = new THREE.DirectionalLight(0xffe0a8, 3.2);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xadc6d3, 2.3);
  rim.position.set(3, 3, -3);
  scene.add(rim);

  const turntable = new THREE.Group();
  scene.add(turntable);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let angle = -.18;
  let ready = false;
  let disposed = false;

  function resize() {
    if (disposed) return;
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Fit all sides of the rotating object, including its sword and pedestal.
    const verticalDistance = 1.05 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const horizontalDistance = .66 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    camera.position.set(0, .14, Math.max(verticalDistance, horizontalDistance) * 1.05);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function draw(now) {
    if (disposed || !ready || paused || !visible || document.hidden) { frame = 0; return; }
    frame = requestAnimationFrame(draw);
    if (now - lastTime < 1000 / 30) return;
    const delta = lastTime ? Math.min((now - lastTime) / 1000, .1) : 0;
    lastTime = now;
    angle = (angle + delta * Math.PI * 2 / TURN_SECONDS) % (Math.PI * 2);
    turntable.rotation.y = angle;
    renderer.render(scene, camera);
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (ready && visible && !paused && !document.hidden && !disposed) frame = requestAnimationFrame(draw);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const intersectionObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  });
  intersectionObserver.observe(stage);
  const onVisibility = () => sync();
  const onPreference = () => { paused = reduced.matches; sync(); };
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', onPreference);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    paused = true;
    sync();
    stage.classList.remove('is-3d-ready');
    stage.querySelector('.justice-statue')?.removeAttribute('aria-hidden');
    if (status) status.textContent = '3D view interrupted. Reload to retry.';
  });

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reduced.removeEventListener('change', onPreference);
    scene.traverse(object => {
      if (!object.isMesh) return;
      object.geometry.dispose();
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        for (const value of Object.values(material)) if (value?.isTexture) value.dispose();
        material.dispose();
      }
    });
    environment.dispose();
    renderer.dispose();
  }
  window.addEventListener('pagehide', event => { if (event.persisted) sync(); else dispose(); });
  window.addEventListener('pageshow', sync);

  try {
    const gltf = await new GLTFLoader().loadAsync(new URL('../../../models/justice-sculpture.glb', import.meta.url).href);
    if (disposed) return;
    const model = gltf.scene;
    let meshCount = 0;
    model.traverse(object => {
      if (!object.isMesh) return;
      meshCount++;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        // Preserve the scan's fine detail while matching the bronze/gold scene.
        material.color.multiply(new THREE.Color(0xba996c));
        material.metalness = .72;
        material.roughness = .47;
        material.envMapIntensity = 1.1;
        if (material.map) material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      }
    });
    if (!meshCount) throw new Error('Sculpture has no geometry');
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('Invalid sculpture bounds');
    const scale = 2 / size.y;
    model.scale.multiplyScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    turntable.add(model);
    turntable.rotation.y = angle;
    ready = true;
    resize();
    stage.classList.add('is-3d-ready');
    stage.querySelector('.justice-statue')?.setAttribute('aria-hidden', 'true');
    stage.setAttribute('aria-busy', 'false');
    if (status) status.textContent = '';
    sync();
  } catch (error) {
    stage.setAttribute('aria-busy', 'false');
    if (status) status.textContent = '3D sculpture could not load';
    console.error('3D sculpture:', error);
  }
}
