import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import {
  BoxGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const TWO_PI = Math.PI * 2;
const OUTPUT_PATH = resolve("public/models/gaim-capsem.glb");

globalThis.FileReader = class NodeFileReader {
  onloadend = null;
  result = null;

  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    queueMicrotask(() => this.onloadend?.());
  }
};

const materials = createMaterials();
const scene = new Scene();
const capsem = new Group();
capsem.name = "GaimCapsem";
capsem.scale.set(1.12, 0.94, 1.03);
scene.add(capsem);

addClearShell(capsem);
addBlueCaps(capsem);
addStructuralRibs(capsem);
addSealRings(capsem);
addCharacterCard(capsem);
addTopButton(capsem);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, {
  binary: true,
  onlyVisible: true,
  trs: false,
});

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, Buffer.from(glb));
console.log(`Generated ${OUTPUT_PATH} (${glb.byteLength.toLocaleString()} bytes)`);

function createMaterials() {
  return {
    blue: new MeshStandardMaterial({
      name: "Capsem blue lacquer",
      color: "#164bb6",
      metalness: 0.62,
      roughness: 0.2,
    }),
    blueDark: new MeshStandardMaterial({
      name: "Capsem deep blue",
      color: "#082767",
      metalness: 0.55,
      roughness: 0.26,
    }),
    clear: new MeshPhysicalMaterial({
      name: "Clear polycarbonate shell",
      color: "#d9efff",
      transparent: true,
      opacity: 0.34,
      transmission: 0.52,
      thickness: 0.18,
      roughness: 0.08,
      metalness: 0.02,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    clearRib: new MeshPhysicalMaterial({
      name: "Moulded clear ribs",
      color: "#b9dcff",
      transparent: true,
      opacity: 0.34,
      transmission: 0.46,
      roughness: 0.12,
      metalness: 0.08,
      clearcoat: 1,
    }),
    silver: new MeshStandardMaterial({
      name: "Locking ring metal",
      color: "#cde3f5",
      metalness: 0.82,
      roughness: 0.16,
    }),
    orange: new MeshStandardMaterial({
      name: "Gaim orange accent",
      color: "#ff7400",
      emissive: "#b62e00",
      emissiveIntensity: 0.42,
      metalness: 0.28,
      roughness: 0.24,
    }),
    badgeDark: new MeshStandardMaterial({
      name: "Badge backing",
      color: "#071329",
      metalness: 0.42,
      roughness: 0.22,
    }),
    white: new MeshStandardMaterial({
      name: "Badge white",
      color: "#eef8ff",
      metalness: 0.16,
      roughness: 0.3,
    }),
  };
}

function addClearShell(parent) {
  const shell = new Mesh(new SphereGeometry(1, 72, 48), materials.clear);
  shell.name = "Transparent outer shell";
  parent.add(shell);
}

function addBlueCaps(parent) {
  const top = new Mesh(
    new SphereGeometry(1.018, 72, 28, 0, TWO_PI, 0, 0.96),
    materials.blue,
  );
  top.name = "Upper blue cap";
  parent.add(top);

  const bottom = new Mesh(
    new SphereGeometry(1.018, 72, 28, 0, TWO_PI, Math.PI - 0.96, 0.96),
    materials.blueDark,
  );
  bottom.name = "Lower blue cap";
  parent.add(bottom);
}

function addStructuralRibs(parent) {
  for (let index = 0; index < 6; index += 1) {
    const longitude = (index / 6) * TWO_PI;
    const curvePoints = [];

    for (let step = 0; step <= 10; step += 1) {
      const y = -0.55 + step * 0.11;
      const radialPosition = Math.sqrt(1.018 ** 2 - y ** 2);
      curvePoints.push(
        new Vector3(
          Math.cos(longitude) * radialPosition,
          y,
          Math.sin(longitude) * radialPosition,
        ),
      );
    }

    const rib = new Mesh(
      new TubeGeometry(new CatmullRomCurve3(curvePoints), 40, 0.018, 8, false),
      materials.clearRib,
    );
    rib.name = `Vertical shell rib ${index + 1}`;
    parent.add(rib);
  }
}

function addSealRings(parent) {
  addHorizontalRing(parent, 0.56, 0.86, 0.052, materials.silver, "Upper shell seal");
  addHorizontalRing(parent, -0.56, 0.86, 0.052, materials.silver, "Lower shell seal");
}

function addHorizontalRing(parent, y, radius, tubeRadius, material, name) {
  const ring = new Mesh(new TorusGeometry(radius, tubeRadius, 16, 96), material);
  ring.name = name;
  ring.position.y = y;
  ring.rotation.x = Math.PI / 2;
  parent.add(ring);
}

function addCharacterCard(parent) {
  const card = new Group();
  card.name = "Character card inside shell";
  card.position.set(0, 0, 0.18);
  parent.add(card);

  const backing = new Mesh(new BoxGeometry(1.08, 0.62, 0.055), materials.badgeDark);
  backing.name = "Character card backing";
  card.add(backing);

  const orangeMark = new Mesh(new TorusGeometry(0.18, 0.032, 12, 48), materials.orange);
  orangeMark.name = "Orange lockseed mark";
  orangeMark.position.set(-0.28, 0, 0.04);
  card.add(orangeMark);

  addCardTile(card, 0.12, 0.02, 0.24, 0.42, materials.blue, -0.14);
  addCardTile(card, 0.31, 0.03, 0.15, 0.34, materials.white, 0.18);
  addCardTile(card, 0.2, -0.12, 0.34, 0.12, materials.orange, -0.05);
}

function addCardTile(parent, x, y, width, height, material, rotation) {
  const tile = new Mesh(new BoxGeometry(width, height, 0.035), material);
  tile.position.set(x, y, 0.05);
  tile.rotation.z = rotation;
  parent.add(tile);
}

function addTopButton(parent) {
  const collar = new Mesh(new CylinderGeometry(0.18, 0.22, 0.11, 40), materials.blueDark);
  collar.name = "Top button collar";
  collar.position.y = 1.035;
  parent.add(collar);

  const button = new Mesh(new CylinderGeometry(0.135, 0.16, 0.13, 40), materials.silver);
  button.name = "Top activation button";
  button.position.y = 1.15;
  parent.add(button);
}
