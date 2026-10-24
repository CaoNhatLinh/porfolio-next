import { FLIGHT, type Flight } from "./flappy-orange-model";
import { orangeSprites, spritePalette } from "./orange-sprite";
import type { OrangeSkin } from "../../features/orange-protocol/reward";
import { drawGround, drawLandscape, marker } from "./flappy-orange-landscape";

type Appearance = { night: boolean; skin: OrangeSkin; pilot?: HTMLImageElement | null; reducedMotion?: boolean };
const INK = "#34332f";

function drawPipe(context: CanvasRenderingContext2D, pipe: Flight["pipes"][number], night: boolean) {
  const top = pipe.gapY - FLIGHT.gap / 2;
  const bottom = pipe.gapY + FLIGHT.gap / 2;
  context.save();
  context.translate(pipe.x, 0);
  for (const [y, height, rim] of [[0, top, top - 15], [bottom, FLIGHT.floor - bottom, bottom]]) {
    // Keep all drawn material inside the same rectangle used for collision.
    context.save(); context.beginPath(); context.rect(0, y, FLIGHT.pipeWidth, height); context.clip();
    context.fillStyle = night ? "#83906e" : "#a9ba74";
    context.fillRect(0, y, FLIGHT.pipeWidth, height);
    marker(context, [[7, y + 3], [9, y + height * .4], [6, y + height - 3]], night ? "#a6ad86" : "#c8d692", 7);
    marker(context, [[2, y], [3, y + height * .35], [1, y + height * .7], [2, y + height]], INK, 4);
    marker(context, [[52, y], [50, y + height * .45], [53, y + height]], INK, 4);
    context.fillStyle = night ? "#a1ac83" : "#c4cf93"; context.fillRect(0, rim, 54, 15);
    marker(context, [[1, rim + 1], [22, rim + 2], [54, rim + 1]], INK, 3);
    marker(context, [[0, rim + 14], [32, rim + 13], [54, rim + 14]], INK, 3);
    for (let row = y + 35; row < y + height - 20; row += 48) {
      marker(context, [[32, row], [39, row + 3], [44, row + 1]], "#758355", 2);
    }
    context.restore();
  }
  context.restore();
}

function drawFallbackPilot(context: CanvasRenderingContext2D) {
  context.fillStyle = "#ff922c"; context.beginPath(); context.arc(-2, -5, 8, 0, 6.3); context.fill();
  marker(context, [[-9, -11], [-3, -14], [5, -10]], INK, 2);
  marker(context, [[-17, 4], [-9, 9], [13, 7], [18, 2], [-12, 1]], "#528db6", 7);
  marker(context, [[0, 4], [-9, 12]], "#f6eee0", 4);
  marker(context, [[20, -3], [20, 9]], INK, 2);
}

function drawOrange(context: CanvasRenderingContext2D, flight: Flight, appearance: Appearance) {
  context.save(); context.translate(FLIGHT.birdX, flight.y);
  if (flight.phase === "ready") context.scale(2.3, 2.3);
  // Modest tilt keeps the silhouette close to its stable collision bounds.
  context.rotate(Math.max(-.12, Math.min(.15, flight.velocity / 2200)));
  if (appearance.skin === "classic") {
    if (appearance.pilot) {
      const image = appearance.pilot;
      context.drawImage(image, image.width * .18, image.height * .15, image.width * .64, image.height * .73, -22, -16, 44, 32);
    } else drawFallbackPilot(context);
  } else {
    for (const [y, row] of orangeSprites.armor.entries()) {
      for (const [x, pixel] of [...row].entries()) {
        if (pixel === ".") continue;
        context.fillStyle = spritePalette[pixel];
        context.fillRect(x * 2 - 16, y * 2 - 16, 2, 2);
      }
    }
  }
  if (flight.phase === "over") {
    marker(context, [[-26, -20], [-20, -25], [-15, -20]], "#d77b29", 2);
    marker(context, [[14, -23], [20, -27]], "#d77b29", 2);
  }
  context.restore();
}

export function drawFlight(canvas: HTMLCanvasElement, flight: Flight, appearance: Appearance) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== FLIGHT.width * scale || canvas.height !== FLIGHT.height * scale) {
    canvas.width = FLIGHT.width * scale; canvas.height = FLIGHT.height * scale;
  }
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.imageSmoothingEnabled = true;
  drawLandscape(context, flight.distance, appearance.night, !!appearance.reducedMotion);
  if (flight.phase === "ready") drawPipe(context, { x: 285, gapY: 234, passed: false }, appearance.night);
  for (const pipe of flight.pipes) drawPipe(context, pipe, appearance.night);
  drawGround(context, flight.distance, appearance.night, !!appearance.reducedMotion);
  drawOrange(context, flight, appearance);
}
