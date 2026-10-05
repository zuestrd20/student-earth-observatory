// Read-only geometry QA. Run from the project directory:
// node --test /workspace/shared/globe-uv-qa.mjs
// To add to the project suite, use the imports below relative to tests/ instead.
// This exercises real Three.js geometry/raycast math, not GPU rendering.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const project = process.cwd();
const localImport = relative => import(pathToFileURL(path.join(project, relative)).href);
const THREE = await localImport('node_modules/three/build/three.module.js');
const { geoContains, geoEquirectangular } = await localImport('node_modules/d3-geo/src/index.js');
const { toVector, fromVector, featureCode } = await localImport('src/model.js');
const geo = JSON.parse(fs.readFileSync(path.join(project, 'public/data/countries.geojson')));

const landmarks = [
  ['KAZ', 68, 48],
  ['LBY', 17, 27],
  ['RUS', 100, 62],
  ['USA', -100, 40],
  ['BRA', -50, -10],
  ['AUS', 134, -25],
  ['JPN', 139.7, 35.7],
  ['FJI', 179.95, -16.2],
];

test('actual SphereGeometry raycast agrees with painted map and country picking', () => {
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.MeshBasicMaterial(),
  );
  earth.updateMatrixWorld(true);
  const raycaster = new THREE.Raycaster();
  const projection = geoEquirectangular()
    .scale(4096 / (2 * Math.PI))
    .translate([2048, 1024]);

  try {
    for (const [expectedCountry, longitude, latitude] of landmarks) {
      const origin = new THREE.Vector3(...toVector(longitude, latitude, 3.5));
      raycaster.set(origin, origin.clone().negate().normalize());
      const hit = raycaster.intersectObject(earth)[0];
      assert.ok(hit, `${expectedCountry}: ray intersects the real Three.js mesh`);

      const pickedCoordinates = fromVector(hit.point);
      assert.ok(Math.abs(pickedCoordinates[0] - longitude) < 1e-9);
      assert.ok(Math.abs(pickedCoordinates[1] - latitude) < 1e-9);
      const pickedFeature = geo.features.find(feature => geoContains(feature, pickedCoordinates));
      assert.ok(pickedFeature, `${expectedCountry}: a polygon contains the hit`);
      assert.equal(featureCode(pickedFeature), expectedCountry);

      // CanvasTexture uses flipY=true: v=1 is the top canvas row.
      const actualTexturePixel = [hit.uv.x * 4096, (1 - hit.uv.y) * 2048];
      const expectedTexturePixel = projection([longitude, latitude]);
      for (let axis = 0; axis < 2; axis++) {
        const error = Math.abs(actualTexturePixel[axis] - expectedTexturePixel[axis]);
        // SphereGeometry UVs interpolate over triangles; allow subpixel residual.
        assert.ok(error < 0.5, `${expectedCountry}: texture axis ${axis}, error ${error}px`);
      }
    }
  } finally {
    earth.geometry.dispose();
    earth.material.dispose();
  }
});
