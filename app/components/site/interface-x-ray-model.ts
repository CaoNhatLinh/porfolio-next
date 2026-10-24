export type XRayLayer = "system" | "states" | "accessibility";

export type InspectionNode = {
  id: string;
  label: string;
  node: string;
  role: string;
  level: string;
  contrast: string;
};

export type RelativePoint = {
  x: number;
  y: number;
};

export const inspectionNodes: InspectionNode[] = [
  {
    id: "navigation",
    label: "Product navigation",
    node: "nav.product-nav",
    role: "navigation",
    level: "landmark",
    contrast: "AA 7.9:1",
  },
  {
    id: "heading",
    label: "Release heading",
    node: "h2.release-title",
    role: "heading",
    level: "2",
    contrast: "AAA 12.4:1",
  },
  {
    id: "description",
    label: "Release summary",
    node: "p.release-summary",
    role: "paragraph",
    level: "content",
    contrast: "AA 5.8:1",
  },
  {
    id: "chart",
    label: "Deployment trend",
    node: "figure.deployments",
    role: "img",
    level: "labelled",
    contrast: "AA 4.7:1",
  },
  {
    id: "status",
    label: "Production status",
    node: "output.health-status",
    role: "status",
    level: "polite",
    contrast: "AAA 8.2:1",
  },
];

export function getInspectionNode(point: RelativePoint): InspectionNode {
  if (point.y < 0.15) return inspectionNodes[0];
  if (point.y > 0.8) return inspectionNodes[4];
  if (point.x > 0.52) return inspectionNodes[3];
  if (point.y > 0.53) return inspectionNodes[2];
  return inspectionNodes[1];
}
