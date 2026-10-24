export function OrangeProtocolDial({ solved = false, locale = "en" }: { solved?: boolean; locale?: "vi" | "en" }) {
  const segments = [1, 0, 1, 0, 0, 1, 0, 1];
  return <svg viewBox="0 0 240 240" role="img" aria-label={locale === "vi" ? "Orange Protocol: tám múi, đọc theo chiều kim đồng hồ từ dấu khuyết" : "Orange Protocol: eight segments, clockwise from the notch"} className="protocol-dial">
    <circle cx="120" cy="120" r="94" fill="var(--op-raised, #252729)" stroke="currentColor" strokeWidth="5" />
    <circle cx="120" cy="120" r="86" fill="var(--op-ground, #171819)" stroke="currentColor" strokeOpacity=".4" />
    {Array.from({ length: 32 }, (_, index) => <path key={index} d="M120 18v5" transform={`rotate(${index * 11.25} 120 120)`} stroke="currentColor" strokeWidth={index % 4 === 0 ? 2 : 1} />)}
    <path d="M116 14h8l-4 9z" fill="currentColor" />
    {segments.map((bit, index) => <g key={index} transform={`rotate(${index * 45} 120 120)`}>
      <path d="M124 42 A78 78 0 0 1 172 61 L129 105 A18 18 0 0 0 124 102 Z" fill={bit || solved ? "var(--op-accent, #ff8b22)" : "#64686a"} stroke="currentColor" strokeWidth=".75" />
      <path d="M127 50l4 19m8-15 3 14" stroke={bit ? "#ffe7b7" : "#eeeae0"} strokeWidth="2" />
    </g>)}
    <circle cx="120" cy="120" r="15" fill="var(--op-raised, #252729)" stroke="currentColor" strokeWidth="3" />
    <path d="M113 120h14m-7-7v14" stroke="currentColor" />
    <path d="M174 33c20-20 40-15 40-15s-2 29-27 29c-10 0-14-7-13-14z" fill="#64686a" data-leaf="11001000" />
    {/* Eight veins are the last byte; the same data is readable on touch devices. */}
    {[1, 1, 0, 0, 1, 0, 0, 0].map((bit, index) => <rect key={index} x={181 + index * 3} y={31 - index} width="2" height={bit ? 8 : 3} fill="#e3e9c8" />)}
    <text x="120" y="235" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="currentColor">◧ = 1 · ◨ = 0 / ⊕ / 8 → A</text>
  </svg>;
}
