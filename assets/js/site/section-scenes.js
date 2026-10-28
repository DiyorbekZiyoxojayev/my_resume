import * as THREE from '../../vendor/three/three.module.min.js';
import { RoomEnvironment } from '../../vendor/three/RoomEnvironment.js';
import { createSectionModels } from './section-models.js';

// A single movable canvas serves all five section stages. Offscreen stages
// retain their last real render as a snapshot, rather than keeping five GPUs busy.
export function initSectionScenes() {
  const stages = [...document.querySelectorAll('.section-stage')];
  if (!stages.length) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, .1, 20);
  camera.position.set(0,.12,4.5);
  camera.lookAt(0,0,0);
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room,.04);
  scene.environment=environment.texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe5e9da,0x18271c,1.3));
  const key=new THREE.DirectionalLight(0xffe1b0,2.5);key.position.set(-3,4,4);scene.add(key);
  key.castShadow=true;
  key.shadow.mapSize.set(matchMedia('(max-width:600px)').matches?512:1024,matchMedia('(max-width:600px)').matches?512:1024);
  Object.assign(key.shadow.camera,{left:-2.4,right:2.4,top:2.4,bottom:-2.4,near:.5,far:12});
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias=-.0003;key.shadow.normalBias=.015;key.shadow.radius=3;
  const rim=new THREE.DirectionalLight(0xadc5c4,1.6);rim.position.set(3,1,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xf5eee0,.8);fill.position.set(1,1,5);scene.add(fill);
  const models=createSectionModels();
  models.forEach(model=>{model.visible=false;scene.add(model);});
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(7,7),new THREE.ShadowMaterial({color:0x000000,opacity:.28}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.06;floor.receiveShadow=true;scene.add(floor);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const visibility=new Map();
  let active=null,model=null,frame=0,previous=0,time=0,disposed=false;
  const pointer={x:0,y:0},view={x:0,y:0};
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
  function followPointer(event){
    if(!active||reduced.matches||!finePointer.matches)return;
    const box=active.parentElement.getBoundingClientRect();
    const inside=event.clientX>=box.left&&event.clientX<=box.right&&event.clientY>=box.top&&event.clientY<=box.bottom;
    pointer.x=inside?((event.clientX-box.left)/box.width-.5)*2:0;
    pointer.y=inside?((event.clientY-box.top)/box.height-.5)*2:0;
  }
  document.addEventListener('pointermove',followPointer,{passive:true});

  function resize() {
    if(!active||disposed)return;
    const {width,height}=active.getBoundingClientRect();
    if(!width||!height)return;
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.4));
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.position.z=Math.max(4.15,3.35/camera.aspect);
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
  }
  const resizeObserver=new ResizeObserver(resize);
  function capture() {
    if(!active||!model)return;
    try {
      renderer.render(scene,camera);
      let snapshot=active.querySelector('.section-scene-snapshot');
      if(!snapshot){snapshot=document.createElement('img');snapshot.className='section-scene-snapshot';snapshot.alt='';active.prepend(snapshot);}
      snapshot.src=renderer.domElement.toDataURL('image/webp',.84);
      snapshot.hidden=false;
    } catch { /* CSS fallback remains available if a snapshot cannot be made. */ }
  }
  function draw(now) {
    if(disposed||!active||document.hidden||reduced.matches||document.body.classList.contains('document-open')){frame=0;return;}
    frame=requestAnimationFrame(draw);
    if(now-previous<1000/24)return;
    time+=previous?Math.min((now-previous)/1000,.12):0;
    previous=now;
    view.x+=(pointer.x-view.x)*.06;view.y+=(pointer.y-view.y)*.06;
    model.rotation.y=-.3+time*.12+view.x*.08;
    model.position.y=Math.sin(time*.6)*.018;
    camera.position.x=view.x*.14;camera.position.y=.12-view.y*.07;camera.lookAt(0,0,0);
    model.userData.animate?.(time);
    renderer.render(scene,camera);
  }
  function sync() {
    cancelAnimationFrame(frame);frame=0;previous=0;
    if(active&&!document.hidden&&!reduced.matches&&!disposed&&!document.body.classList.contains('document-open'))frame=requestAnimationFrame(draw);
  }
  function choose() {
    const next=[...visibility].filter(([,ratio])=>ratio>0).sort((a,b)=>b[1]-a[1])[0]?.[0]||null;
    if(next===active)return;
    capture();
    renderer.domElement.remove();
    if(model)model.visible=false;
    resizeObserver.disconnect();
    active=next;model=next?models.get(next.dataset.scene):null;
    if(model){
      model.visible=true;
      pointer.x=pointer.y=0;
      view.x=view.y=0;camera.position.x=0;camera.position.y=.12;camera.lookAt(0,0,0);
      model.rotation.y=-.3+time*.14;
      active.append(renderer.domElement);
      const snapshot=active.querySelector('.section-scene-snapshot');
      if(snapshot)snapshot.hidden=true;
      active.classList.add('has-3d-render');
      resizeObserver.observe(active);
      resize();
    }
    sync();
  }
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)visibility.set(entry.target,entry.isIntersecting?entry.intersectionRatio:0);
    choose();
  },{threshold:[0,.1,.4,.7,1]});
  stages.forEach(stage=>observer.observe(stage));
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('documentpreviewchange',sync);
  reduced.addEventListener('change',sync);
  window.addEventListener('pagehide',event=>{
    if(event.persisted){cancelAnimationFrame(frame);return;}
    disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();
    document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);
    document.removeEventListener('documentpreviewchange',sync);
    document.removeEventListener('pointermove',followPointer);
    const geometries=new Set(),materials=new Set(),textures=new Set();
    scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)materials.add(object.material);});
    geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>{for(const value of Object.values(material))if(value?.isTexture)textures.add(value);material.dispose();});
    textures.forEach(texture=>texture.dispose());
    key.shadow.dispose();
    environment.dispose();renderer.dispose();
  });
  window.addEventListener('pageshow',sync);
}
