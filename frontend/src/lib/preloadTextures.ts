import * as THREE from 'three';

const floorList = [
  'birch-floor-parquet',
  'birch-floor-herringbone',
  'walnut-floor-parquet',
  'walnut-floor-herringbone',
];

const floorMaterials: Record<string, THREE.MeshStandardMaterial> = {};
let texturesLoaded = false;

export function preloadTextures() {
  if (texturesLoaded) return Promise.resolve();

  const loader = new THREE.TextureLoader();
  const promises: Promise<void>[] = [];

  floorList.forEach((flooring) => {
    const promise = Promise.all([
      loader.loadAsync(`/3D-textures/${flooring}/albedo.jpg`),
      loader.loadAsync(`/3D-textures/${flooring}/normal.jpg`),
      loader.loadAsync(`/3D-textures/${flooring}/roughness.jpg`),
    ]).then(([map, normalMap, roughnessMap]) => {
      // Setup texture properties
      [map, normalMap, roughnessMap].forEach((tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
      });

      map.colorSpace = THREE.SRGBColorSpace;
      normalMap.colorSpace = THREE.NoColorSpace;
      roughnessMap.colorSpace = THREE.NoColorSpace;

      floorMaterials[flooring] = new THREE.MeshStandardMaterial({
        map,
        normalMap,
        roughnessMap,
      });
    });

    promises.push(promise);
  });

  return Promise.all(promises).then(() => {
    texturesLoaded = true;
  });
}

export function getFloorMaterial(flooring: string) {
  const mat = floorMaterials[flooring];
  if (!mat) {
    console.warn(`Flooring material "${flooring}" not preloaded.`);
    return new THREE.MeshStandardMaterial();
  }
  return mat.clone();
}