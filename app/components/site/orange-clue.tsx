import { getFragment, type Folio } from "../../features/orange-protocol/fragments";
import { protocolEnabled, PROTOCOL_VERSION } from "../../features/orange-protocol/config";
import { OrangeClueControl } from "./orange-clue-control";

export function OrangeClue({ folio, locale = "en" }: { folio: Folio; locale?: "vi" | "en" }) {
  if (!protocolEnabled) return null;
  return <span className="op-fragment" data-op-version={PROTOCOL_VERSION}
    data-op-folio={folio} data-op-fragment={getFragment(folio)}>
    <OrangeClueControl folio={folio} fragment={getFragment(folio)} locale={locale} />
  </span>;
}
