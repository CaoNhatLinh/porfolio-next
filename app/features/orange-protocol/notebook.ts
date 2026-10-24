export const NOTEBOOK_KEY = "kamling.orange-protocol.op-1.fragments";
const folios = new Set(["home", "work", "about", "journal", "resume", "hire", "contact", "playroom"]);
export type FragmentNote = { folio: string; fragment: string };

export function readNotebook(): FragmentNote[] {
  try {
    const entries: unknown = JSON.parse(sessionStorage.getItem(NOTEBOOK_KEY) ?? "[]");
    if (!Array.isArray(entries)) return [];
    return entries.filter((item): item is FragmentNote => item && typeof item.folio === "string" && folios.has(item.folio) && typeof item.fragment === "string" && /^[01]{3}:[01]{8}$/.test(item.fragment)).slice(0, 8);
  } catch { return []; }
}

export function collectFragment(folio: string, fragment: string): boolean {
  if (!folios.has(folio) || !/^[01]{3}:[01]{8}$/.test(fragment)) return false;
  try {
    const entries = readNotebook().filter(item => item.folio !== folio);
    sessionStorage.setItem(NOTEBOOK_KEY, JSON.stringify([...entries, { folio, fragment }]));
    return true;
  } catch { return false; }
}
