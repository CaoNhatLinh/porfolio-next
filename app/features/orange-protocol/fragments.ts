import "server-only";

// Public puzzle material. Each route renders only its own fragment.
const fragments = {
  home: "011:11100100", work: "110:11101001", about: "100:11100011",
  journal: "000:11110111", resume: "010:11100001", hire: "101:11100100",
  contact: "001:11100000", playroom: "111:11100000",
} as const;

export type Folio = keyof typeof fragments;
export function getFragment(folio: Folio) { return fragments[folio]; }
