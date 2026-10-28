import * as THREE from '../../vendor/three/three.module.min.js';

// Original geometry for the five section illustrations. No downloaded models.
export function createSectionModels() {
  const steel = new THREE.MeshStandardMaterial({ color: 0x59675f, metalness: .9, roughness: .29 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x202e26, metalness: .8, roughness: .37 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc2a361, metalness: .93, roughness: .27, side: THREE.DoubleSide });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x749c96, metalness: .04, roughness: .06, transmission: .72, thickness: .18, ior: 1.45, transparent: true, opacity: .58, depthWrite: false });
  const edge = new THREE.LineBasicMaterial({ color: 0xb9d0bd, transparent: true, opacity: .65 });

  function add(parent, geometry, material, position = [0, 0, 0]) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  const box = (parent, dimensions, position, material = steel) => add(parent, new THREE.BoxGeometry(...dimensions), material, position);
  function tube(parent, points, radius = .009, material = gold) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    return add(parent, new THREE.TubeGeometry(curve, 32, radius, 7, false), material);
  }
  function ring(parent, radius, position = [0, 0, 0], material = gold, thickness = .009) {
    return add(parent, new THREE.TorusGeometry(radius, thickness, 7, 72), material, position);
  }
  function cube(parent, size, position) {
    const mesh = box(parent, [size, size, size], position, glass);
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edge);
    mesh.add(lines);
    const core = box(mesh, [size * .52, size * .52, size * .52], [0, 0, 0], dark);
    core.rotation.y = .22;
    return mesh;
  }
  function sphere(parent, radius, position, material = gold) {
    return add(parent, new THREE.SphereGeometry(radius, 20, 14), material, position);
  }
  const models = new Map();

  const law = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const book = box(law, [1.05, .09, .65], [0, -.78 + i * .1, 0], i % 2 ? steel : dark);
    book.rotation.y = i % 2 ? -.1 : .12;
    box(book, [.96, .025, .66], [0, .035, 0], gold);
  }
  add(law, new THREE.CylinderGeometry(.035, .06, 1.23, 24), gold, [0, -.04, 0]);
  add(law, new THREE.CylinderGeometry(.17, .23, .07, 32), steel, [0, -.52, 0]);
  const balance = new THREE.Group(); balance.position.y = .58; law.add(balance);
  box(balance, [1.65, .035, .045], [0, 0, 0], gold);
  sphere(balance, .06, [0, .04, 0]);
  for (const side of [-1, 1]) {
    const x = side * .78;
    const profile = [[0, 0], [.07, .005], [.17, .04], [.23, .095]].map(p => new THREE.Vector2(...p));
    add(balance, new THREE.LatheGeometry(profile, 40), gold, [x, -.61, 0]);
    const lip = ring(balance, .23, [x, -.515, 0]); lip.rotation.x = Math.PI / 2;
    for (let chain = 0; chain < 3; chain++) {
      const a = chain * Math.PI * 2 / 3;
      tube(balance, [[x, 0, 0], [x + Math.cos(a) * .1, -.3, Math.sin(a) * .1], [x + Math.cos(a) * .22, -.52, Math.sin(a) * .22]], .004);
    }
  }
  law.userData.animate = t => { balance.rotation.z = Math.sin(t * .65) * .045; };
  models.set('about', law);

  const bank = new THREE.Group();
  for (let i = 0; i < 3; i++) box(bank, [1.8 - i * .13, .09, .8 - i * .07], [0, -.76 + i * .09, 0], i % 2 ? gold : steel);
  for (const x of [-.57, 0, .57]) {
    add(bank, new THREE.CylinderGeometry(.075, .095, 1.06, 24), steel, [x, .03, 0]);
    add(bank, new THREE.CylinderGeometry(.14, .14, .07, 24), gold, [x, -.48, 0]);
    add(bank, new THREE.CylinderGeometry(.14, .14, .08, 24), gold, [x, .55, 0]);
    for (let flute = 0; flute < 8; flute++) {
      const a = flute * Math.PI / 4;
      tube(bank, [[x + Math.cos(a) * .082, -.42, Math.sin(a) * .082], [x + Math.cos(a) * .072, .48, Math.sin(a) * .072]], .003, gold);
    }
  }
  const roof = new THREE.Shape(); roof.moveTo(-.93, .65); roof.lineTo(0, 1.03); roof.lineTo(.93, .65); roof.closePath();
  box(bank,[1.85,.075,.5],[0,.615,0],steel);
  add(bank, new THREE.ExtrudeGeometry(roof, { depth: .22, bevelEnabled: true, bevelSize: .025, bevelThickness: .015, bevelSegments: 1, steps: 1 }), gold, [0, 0, -.11]);
  const coin = add(bank, new THREE.CylinderGeometry(.23, .23, .05, 48), gold, [.8, -.32, .55]); coin.rotation.x = Math.PI / 2;
  const coinRim = ring(bank, .2, [.8, -.32, .581], steel); coinRim.rotation.z = .1;
  bank.userData.animate = t => { coin.rotation.z = t * .18; };
  models.set('experience', bank);

  const data = new THREE.Group();
  const nodes = [[-.55, -.27, .25], [.42, .12, .05], [.05, .76, -.25], [-.68, .55, -.38], [.7, -.64, -.15]];
  nodes.forEach((position, i) => { const mesh = cube(data, i < 2 ? .6 : .37, position); mesh.rotation.set(i * .12, .18 * i, -.06 * i); });
  const curves = [];
  for (const [a, b] of [[0,1],[1,2],[0,3],[1,4],[2,3]]) {
    const start = nodes[a], end = nodes[b];
    const points = [start, [(start[0]+end[0])/2, (start[1]+end[1])/2, .3], end];
    tube(data, points, .007, steel);
    curves.push(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))));
  }
  const signals = curves.slice(0, 3).map(() => sphere(data, .035, [0,0,0]));
  data.userData.animate = t => signals.forEach((signal, i) => signal.position.copy(curves[i].getPoint((t * .09 + i * .32) % 1)));
  models.set('projects', data);

  const credentials = new THREE.Group();
  const document = new THREE.Group(); document.rotation.y = -.18; credentials.add(document);
  box(document, [.98, 1.38, .075], [0, .08, 0], dark);
  box(document, [1.08, .045, .095], [0, .8, 0], gold);
  box(document, [1.08, .045, .095], [0, -.64, 0], gold);
  box(document, [.045, 1.48, .095], [-.52, .08, 0], steel);
  box(document, [.045, 1.48, .095], [.52, .08, 0], steel);
  for (let i = 0; i < 6; i++) box(document, [i === 0 ? .46 : .68 - (i % 3) * .1, .018, .012], [0, .48 - i * .12, .045], i === 0 ? gold : steel);
  const medal = add(credentials, new THREE.CylinderGeometry(.29,.29,.075,64), gold, [.42,-.48,.3]); medal.rotation.x = Math.PI/2;
  ring(credentials,.25,[.42,-.48,.345],steel);
  for(let i=0;i<12;i++) { const a=i*Math.PI/6; sphere(credentials,.017,[.42+Math.cos(a)*.22,-.48+Math.sin(a)*.22,.35]); }
  const ribbonLeft = box(credentials,[.105,.38,.025],[.33,-.79,.29],dark); ribbonLeft.rotation.z=-.2;
  const ribbonRight = box(credentials,[.105,.38,.025],[.51,-.79,.29],steel); ribbonRight.rotation.z=.2;
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
  const satellite = sphere(contact,.075,[0,0,0]);
  contact.userData.animate = t => {
    const a=t*.35;
    satellite.position.set(Math.cos(a)*1.03,Math.sin(a)*.48,Math.sin(a)*.9);
  };
  models.set('contact',contact);
  return models;
}
