import * as THREE from '../../vendor/three/three.module.min.js';
import { createSceneMaterials, beveledBox } from './scene-materials.js';

// Original geometry for the five section illustrations. No downloaded models.
export function createSectionModels() {
  const materials = createSceneMaterials();
  const {steel,dark,gold,glass,edge,stone,paper,leather,signal} = materials;

  function add(parent, geometry, material, position = [0, 0, 0]) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = material !== glass && material !== signal;
    mesh.receiveShadow = material !== glass;
    parent.add(mesh);
    return mesh;
  }
  const box = (parent, dimensions, position, material = steel) => add(parent, beveledBox(...dimensions), material, position);
  function tube(parent, points, radius = .009, material = gold) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    return add(parent, new THREE.TubeGeometry(curve, 32, radius, 7, false), material);
  }
  function ring(parent, radius, position = [0, 0, 0], material = gold, thickness = .009) {
    return add(parent, new THREE.TorusGeometry(radius, thickness, 7, 72), material, position);
  }
  function cube(parent, size, position) {
    const mesh = box(parent, [size, size, size], position, glass);
    const outline=new THREE.BoxGeometry(size-.008,size-.008,size-.008);
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(outline), edge);
    outline.dispose();
    mesh.add(lines);
    const core = box(mesh, [size * .52, size * .52, size * .52], [0, 0, 0], dark);
    core.rotation.y = .22;
    for(let i=0;i<3;i++)box(core,[size*.4,.005,.005],[0,size*.265,(i-1)*size*.12],gold);
    for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])sphere(mesh,.012,[x*size*.48,y*size*.48,z*size*.48],steel);
    return mesh;
  }
  function sphere(parent, radius, position, material = gold) {
    return add(parent, new THREE.SphereGeometry(radius, radius<.025?10:32, radius<.025?8:24), material, position);
  }
  const models = new Map();

  const law = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const book = box(law, [1.05, .015, .65], [0, -.78 + i * .1, 0], i % 2 ? leather : dark);
    book.rotation.y = i % 2 ? -.1 : .12;
    box(book, [.96, .055, .59], [0, .04, 0], paper);
    box(book, [1.05, .015, .65], [0, .08, 0], i % 2 ? leather : dark);
    for(let band=0;band<3;band++) box(book,[.018,.06,.012],[-.36+band*.36,.04,.326],gold);
  }
  add(law, new THREE.CylinderGeometry(.035, .06, 1.23, 24), gold, [0, -.04, 0]);
  add(law, new THREE.CylinderGeometry(.17, .23, .07, 32), steel, [0, -.52, 0]);
  for(let i=0;i<5;i++) {
    add(law,new THREE.CylinderGeometry(.07+i*.012,.08+i*.012,.035,48),i%2?steel:gold,[0,-.48+i*.065,0]);
  }
  const balance = new THREE.Group(); balance.position.y = .58; law.add(balance);
  box(balance, [1.65, .035, .045], [0, 0, 0], gold);
  sphere(balance, .06, [0, .04, 0]);
  const hangers=[];
  for (const side of [-1, 1]) {
    const x = side * .78;
    const hanger=new THREE.Group();hanger.position.x=x;balance.add(hanger);hangers.push(hanger);
    const profile = [[0, 0], [.07, .005], [.17, .04], [.23, .095], [.23,.103], [.17,.05], [.07,.017], [0,.012]].map(p => new THREE.Vector2(...p));
    add(hanger, new THREE.LatheGeometry(profile, 64), gold, [0, -.61, 0]);
    const lip = ring(hanger, .23, [0, -.515, 0]); lip.rotation.x = Math.PI / 2;
    for (let chain = 0; chain < 3; chain++) {
      const a = chain * Math.PI * 2 / 3;
      const end=new THREE.Vector3(Math.cos(a)*.22,-.52,Math.sin(a)*.22);
      const direction=end.clone().normalize();
      for(let link=0;link<13;link++) {
        const chainLink=add(hanger,new THREE.TorusGeometry(.011,.0026,5,12),gold,end.clone().multiplyScalar((link+.5)/13).toArray());
        chainLink.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);
        chainLink.rotateY(link%2?Math.PI/2:0);
      }
    }
  }
  law.userData.animate = t => { balance.rotation.z = Math.sin(t * .55) * .035; hangers.forEach(hanger=>hanger.rotation.z=-balance.rotation.z); };
  models.set('about', law);

  const bank = new THREE.Group();
  for (let i = 0; i < 3; i++) box(bank, [1.8 - i * .13, .09, .8 - i * .07], [0, -.76 + i * .09, 0], i % 2 ? gold : stone);
  for (const [x,z] of [[-.57,0],[0,0],[.57,0],[-.57,-.32],[.57,-.32]]) {
    add(bank, new THREE.CylinderGeometry(.075, .095, 1.06, 24), stone, [x, .03, z]);
    add(bank, new THREE.CylinderGeometry(.14, .14, .07, 24), gold, [x, -.48, z]);
    add(bank, new THREE.CylinderGeometry(.14, .14, .08, 24), gold, [x, .55, z]);
    for (let flute = 0; flute < 8; flute++) {
      const a = flute * Math.PI / 4;
      tube(bank, [[x + Math.cos(a) * .082, -.42, z + Math.sin(a) * .082], [x + Math.cos(a) * .072, .48, z + Math.sin(a) * .072]], .003, gold);
    }
  }
  box(bank,[1.45,.94,.06],[0,.02,-.39],dark);
  box(bank,[.26,.65,.025],[0,-.12,-.35],gold);
  for(const y of [-.46,.5,.57]) box(bank,[1.63,.035,.64],[0,y,-.08],steel);
  const roof = new THREE.Shape(); roof.moveTo(-.93, .65); roof.lineTo(0, 1.03); roof.lineTo(.93, .65); roof.closePath();
  box(bank,[1.85,.075,.5],[0,.615,0],steel);
  add(bank, new THREE.ExtrudeGeometry(roof, { depth: .22, bevelEnabled: true, bevelSize: .025, bevelThickness: .015, bevelSegments: 3, steps: 1 }), gold, [0, 0, -.11]);
  const coin = add(bank, new THREE.CylinderGeometry(.23, .23, .05, 48), gold, [.8, -.32, .55]); coin.rotation.x = Math.PI / 2;
  const coinRim = ring(bank, .2, [.8, -.32, .581], steel); coinRim.rotation.z = .1;
  bank.userData.animate = t => { coin.rotation.z = t * .18; };
  models.set('experience', bank);

  const data = new THREE.Group();
  const nodes = [[-.55, -.27, .25], [.42, .12, .05], [.05, .76, -.25], [-.68, .55, -.38], [.7, -.64, -.15]];
  const cubes=nodes.map((position, i) => { const mesh = cube(data, i < 2 ? .6 : .37, position); mesh.rotation.set(i * .12, .18 * i, -.06 * i); return mesh; });
  const curves = [];
  for (const [a, b] of [[0,1],[1,2],[0,3],[1,4],[2,3]]) {
    const start = nodes[a], end = nodes[b];
    const points = [start, [(start[0]+end[0])/2, (start[1]+end[1])/2, .3], end];
    tube(data, points, .007, steel);
    curves.push(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))));
  }
  const signals = curves.slice(0, 3).map(() => sphere(data, .028, [0,0,0],signal));
  data.userData.animate = t => {
    signals.forEach((point, i) => point.position.copy(curves[i].getPoint((t * .09 + i * .32) % 1)));
    cubes.forEach((mesh,i)=>{mesh.rotation.y=.18*i+t*(i%2?.055:-.04);mesh.rotation.x=i*.12+Math.sin(t*.3+i)*.06;});
  };
  models.set('projects', data);

  const credentials = new THREE.Group();
  const document = new THREE.Group(); document.rotation.y = -.18; credentials.add(document);
  box(document, [.98, 1.38, .075], [0, .08, 0], paper);
  box(document, [1.08, .045, .095], [0, .8, 0], gold);
  box(document, [1.08, .045, .095], [0, -.64, 0], gold);
  box(document, [.045, 1.48, .095], [-.52, .08, 0], steel);
  box(document, [.045, 1.48, .095], [.52, .08, 0], steel);
  for (let i = 0; i < 6; i++) box(document, [i === 0 ? .46 : .68 - (i % 3) * .1, .018, .012], [0, .48 - i * .12, .045], i === 0 ? gold : steel);
  const medal = add(credentials, new THREE.CylinderGeometry(.29,.29,.075,64), gold, [.42,-.48,.3]); medal.rotation.x = Math.PI/2;
  ring(credentials,.25,[.42,-.48,.345],steel);
  ring(credentials,.21,[.42,-.48,.35],gold,.007);
  const seal=new THREE.Shape();
  for(let i=0;i<20;i++){const a=i*Math.PI/10,r=i%2?.085:.15;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)seal.moveTo(x,y);else seal.lineTo(x,y);}seal.closePath();
  add(credentials,new THREE.ExtrudeGeometry(seal,{depth:.012,bevelEnabled:true,bevelSize:.005,bevelThickness:.004,bevelSegments:2}),steel,[.42,-.48,.35]);
  for(let i=0;i<12;i++) { const a=i*Math.PI/6; sphere(credentials,.017,[.42+Math.cos(a)*.22,-.48+Math.sin(a)*.22,.35]); }
  const ribbonShape=new THREE.Shape();ribbonShape.moveTo(-.06,.18);ribbonShape.lineTo(.06,.18);ribbonShape.lineTo(.06,-.18);ribbonShape.lineTo(0,-.13);ribbonShape.lineTo(-.06,-.18);ribbonShape.closePath();
  for(const side of [-1,1]){
    const ribbon=add(credentials,new THREE.ExtrudeGeometry(ribbonShape,{depth:.012,bevelEnabled:false}),leather,[.42+side*.09,-.77,.29]);ribbon.rotation.z=side*.2;
  }
  const halo = ring(credentials,.94,[0,.04,-.13],steel,.006); halo.rotation.y=.6;
  models.set('credentials', credentials);

  const contact = new THREE.Group();
  sphere(contact,.65,[0,0,0],dark);
  for(let i=-2;i<=2;i++) {
    const latitude=i*Math.PI/8, radius=Math.cos(latitude)*.656;
    const parallel=ring(contact,radius,[0,Math.sin(latitude)*.656,0],gold,.004); parallel.rotation.x=Math.PI/2;
  }
  for(let i=0;i<6;i++) { const longitude=ring(contact,.656,[0,0,0],steel,.006); longitude.rotation.y=i*Math.PI/6; }
  const orbit = ring(contact,1.03,[0,0,0],gold,.008); orbit.rotation.set(1.07,.18,-.35);
  const orbit2 = ring(contact,.9,[0,0,0],steel,.006); orbit2.rotation.set(.32,.72,.3);
  const satellite=new THREE.Group();contact.add(satellite);
  box(satellite,[.12,.1,.13],[0,0,0],gold);
  for(const side of [-1,1]) {
    const panel=box(satellite,[.18,.006,.12],[side*.16,0,0],dark);
    for(let grid=0;grid<4;grid++)box(panel,[.002,.002,.115],[-.065+grid*.043,.005,0],steel);
  }
  sphere(satellite,.018,[0,.075,0],signal);
  contact.userData.animate = t => {
    const a=t*.35;
    satellite.position.set(Math.cos(a)*1.03,Math.sin(a)*1.03,0).applyEuler(orbit.rotation);
    satellite.rotation.set(a*.2,a,.2);
  };
  models.set('contact',contact);
  return models;
}
