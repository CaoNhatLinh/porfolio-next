import { FLIGHT } from "./flappy-orange-model";

type Pen = CanvasRenderingContext2D;
const INK = "#34332f";
const wrap = (x: number, span: number) => ((x % span) + span) % span;

// Fixed irregularities belong to the drawing, not the frame: no random flicker.
export function marker(context: Pen, points: number[][], color = INK, width = 3) {
  context.strokeStyle = color; context.lineWidth = width;
  context.lineCap = "round"; context.lineJoin = "round";
  context.setLineDash([22, 1.5, 13, 2.5]);
  context.beginPath();
  points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.stroke();
  context.setLineDash([]);
}

function cloud(context: Pen, x: number, y: number, size: number, night: boolean) {
  context.save(); context.translate(x, y); context.scale(size, size);
  const shape = new Path2D("M0 20 Q-4 5 12 7 Q14 -10 32 2 Q49 -6 53 12 Q71 12 66 26 Q42 31 5 27");
  context.fillStyle = night ? "#3b5063" : "#fffcf2"; context.fill(shape);
  context.strokeStyle = night ? "#7d909e" : "#7c9590"; context.lineWidth = 2.8;
  context.setLineDash([28, 4, 12, 3]); context.stroke(shape); context.setLineDash([]);
  marker(context, [[8, 30], [27, 31], [44, 29]], night ? "#6d8191" : "#b7c9c4", 1.5);
  context.restore();
}

function hills(context: Pen, distance: number, night: boolean) {
  for (let layer = 0; layer < 2; layer++) {
    const speed = layer ? .24 : .1;
    const baseline = layer ? 374 : 318;
    const color = night ? (layer ? "#364f55" : "#2e4357") : (layer ? "#b1bf87" : "#c2d4c2");
    for (let index = 0; index < 4; index++) {
      const x = wrap(index * 170 - distance * speed, 680) - 170;
      context.beginPath(); context.moveTo(x, 440); context.lineTo(x, baseline + 60);
      context.bezierCurveTo(x + 32, baseline - 35, x + 95, baseline - 60, x + 190, baseline + 60);
      context.lineTo(x + 190, 440); context.closePath(); context.fillStyle = color; context.fill();
      if (layer) {
        marker(context, [[x + 35, baseline + 9], [x + 49, baseline - 1], [x + 65, baseline - 5], [x + 82, baseline - 2]], night ? "#51685f" : "#899a69", 3);
        marker(context, [[x + 95, baseline + 27], [x + 100, baseline + 15], [x + 104, baseline + 26]], night ? "#51685f" : "#899a69", 2);
      }
    }
  }
}

function orchard(context: Pen, distance: number, night: boolean) {
  const green = night ? "#486257" : "#7a945d";
  for (let index = 0; index < 6; index++) {
    const x = wrap(index * 90 - distance * .48, 540) - 90;
    const y = 365 + index % 2 * 18;
    marker(context, [[x + 20, y + 20], [x + 23, 429]], night ? "#697568" : "#786447", 5);
    context.fillStyle = green;
    context.beginPath(); context.moveTo(x - 3, y + 14); context.lineTo(x + 1, y - 5); context.lineTo(x + 17, y - 17);
    context.lineTo(x + 34, y - 12); context.quadraticCurveTo(x + 58, y + 14, x + 36, y + 35);
    context.quadraticCurveTo(x + 2, y + 47, x - 3, y + 14); context.fill();
    marker(context, [[x + 1, y + 12], [x + 4, y - 4], [x + 18, y - 14], [x + 33, y - 11]], night ? "#647a63" : "#526e48", 3);
    for (const [dx, dy] of [[9, 10], [30, 4], [26, 25]]) {
      context.fillStyle = night ? "#cc944c" : "#f8a04c";
      context.beginPath(); context.arc(x + dx, y + dy, 4, 0, 6.3); context.fill();
    }
  }
}

export function drawLandscape(context: Pen, distance: number, night: boolean, reducedMotion: boolean) {
  const travel = reducedMotion ? 0 : distance;
  context.fillStyle = night ? "#203246" : "#e5eee5";
  context.fillRect(0, 0, FLIGHT.width, FLIGHT.height);
  context.fillStyle = night ? "#f3dd9d" : "#f6c76c";
  context.beginPath(); context.arc(275, 63, 24, 0, 6.3); context.fill();
  if (night) {
    context.fillStyle = "#203246"; context.beginPath(); context.arc(286, 55, 22, 0, 6.3); context.fill();
    for (let i = 0; i < 10; i++) {
      const x = (i * 71 + 19) % 350, y = (i * 43 + 17) % 220;
      marker(context, [[x - 2, y], [x + 2, y]], "#bac5bb", 1.5);
      marker(context, [[x, y - 2], [x, y + 2]], "#bac5bb", 1.5);
    }
  } else {
    marker(context, [[251, 42], [257, 38], [269, 37]], "#b09157", 2);
  }
  for (let i = 0; i < 5; i++) cloud(context, wrap(i * 108 - travel * .13, 540) - 80, 56 + i % 3 * 59, .7, night);
  hills(context, travel, night);
  orchard(context, travel, night);
  // Near clouds move faster, remaining behind every collidable obstacle.
  for (let i = 0; i < 2; i++) cloud(context, wrap(i * 270 - travel * .3, 540) - 100, 210 + i * 58, 1.15, night);
}

export function drawGround(context: Pen, distance: number, night: boolean, reducedMotion: boolean) {
  context.fillStyle = night ? "#586153" : "#d9c7a1";
  context.fillRect(0, FLIGHT.floor, FLIGHT.width, 40);
  marker(context, [[0, 441], [86, 440], [182, 442], [270, 440], [360, 441]], INK, 3);
  const offset = reducedMotion ? 0 : distance % 44;
  for (let x = -44; x < 404; x += 44) {
    marker(context, [[x - offset, 457], [x + 13 - offset, 455]], night ? "#8c9278" : "#ad9871", 3);
    marker(context, [[x + 18 - offset, 443], [x + 21 - offset, 435], [x + 24 - offset, 442], [x + 30 - offset, 437]], night ? "#657d63" : "#7e8d56", 2);
  }
}
