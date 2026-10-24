import type { OrangeSkin } from "../../features/orange-protocol/reward";

export const spritePalette: Record<string, string> = {
  o: "#f58b20", h: "#ffd16b", s: "#ce5317", k: "#24372e", w: "#fff6df",
  g: "#43724e", l: "#89b653", b: "#304c78", n: "#172c46", m: "#a8c3ce",
};
export const orangeSprites: Record<OrangeSkin, string[]> = {
  classic: [
    "........gll.....", ".......ggl......", ".....kkkkkk.....", "...kkhhooookk...",
    "..khhhoooooook..", "..khhooooooook..", ".khoooooowkook..", ".koooooowwkook..",
    ".koooooooooook..", ".koohoooooosok..", "..kooohoooossk..", "..koooooosssk...",
    "...ksssssssk....", "....kkkkkkk.....", "................", "................",
  ],
  armor: [
    "....h.....h.....", "....hh...hh.....", ".....hkkkh......", "...kkhooohkk....",
    "..khooooooohk...", ".khohohohohohk..", ".koohohohohook..", ".kmmmmmmmmmmmk..",
    ".knbwwnbwwbnk..", "..knbbnnbbnk...", "..knbmmmmnbnk..", "...knbmmnbnk...",
    "....knbbbnk....", ".....kkkkk.....", "................", "................",
  ],
};

export function OrangeSprite({ skin }: { skin: OrangeSkin }) {
  return <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
    {orangeSprites[skin].flatMap((row, y) => [...row].map((pixel, x) => pixel === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={spritePalette[pixel]} />))}
  </svg>;
}
