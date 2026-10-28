import * as THREE from '../../vendor/three/three.module.min.js';

// Small deterministic surface maps: real highlights reveal the finish as it turns.
export function createSceneMaterials() {
  let seed = 781;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  function texture(kind) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = kind === 'stone' ? '#b9b6a7' : '#929292'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1700; i++) {
      const value = Math.round(95 + random() * 95);
      ctx.strokeStyle = `rgba(${value},${value},${value},${kind === 'stone' ? .09 : .25})`;
      const x = random() * 256, y = random() * 256;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x + random() * 50 + 3, y + (kind === 'stone' ? random() * 30 : 0)); ctx.stroke();
    }
    if (kind === 'stone') for (let i = 0; i < 9; i++) {
      ctx.strokeStyle = '#545b4926'; ctx.lineWidth = .5 + random();
      ctx.beginPath(); const y = random() * 256; ctx.moveTo(0,y);
      ctx.bezierCurveTo(80,y+60,140,y-65,256,y+25); ctx.stroke();
    }
    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    return map;
  }
  const brushed = texture('metal'), stone = texture('stone');
  const metal = (color, roughness) => new THREE.MeshPhysicalMaterial({ color, metalness: .88, roughness, roughnessMap: brushed, bumpMap: brushed, bumpScale: .003, envMapIntensity: 1.15, clearcoat: .24, clearcoatRoughness: .25 });
  return {
    steel: metal(0x88928b,.48), dark: metal(0x253229,.65), gold: metal(0xc6a665,.46),
    stone: new THREE.MeshStandardMaterial({ color: 0xb5b2a0, map: stone, roughness: .72, bumpMap: stone, bumpScale: .009, metalness: .04 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xd8cdaa, roughness: .86, bumpMap: brushed, bumpScale: .002 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x30251c, roughness: .8, bumpMap: stone, bumpScale: .016 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xa2c7bd, metalness: 0, roughness: .045, transmission: .88, thickness: .32, ior: 1.46, transparent: true, opacity: .72, depthWrite: false, clearcoat: 1 }),
    signal: new THREE.MeshStandardMaterial({ color: 0xffe0a0, emissive: 0xffb84e, emissiveIntensity: 1.8, roughness: .2, metalness: .4 }),
    edge: new THREE.LineBasicMaterial({ color: 0xc3d8cb, transparent: true, opacity: .35 })
  };
}

export function beveledBox(width, height, depth) {
  const radius = Math.min(width,height,depth) * .13;
  const shape = new THREE.Shape();
  const x = width / 2 - radius, y = height / 2 - radius;
  shape.moveTo(-x,-y); shape.lineTo(x,-y); shape.lineTo(x,y); shape.lineTo(-x,y); shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: Math.max(.001,depth-radius*2), bevelEnabled: true, bevelSize: radius, bevelThickness: radius, bevelSegments: 3, steps: 1 });
  geometry.center();
  return geometry;
}
