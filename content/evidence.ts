import type { EvidenceId } from "./types";

/** Display label and destination for every place a tool or claim can point to. */
export const evidence: Record<EvidenceId, { label: string; href: string }> = {
  alliant: { label: "Alliant Insurance", href: "/projects/insurance-document-ai" },
  "insurance-document-ai": { label: "Insurance document AI", href: "/projects/insurance-document-ai" },
  pyxeon: { label: "Pyxeon", href: "/projects/pyxeon" },
  conedison: { label: "Con Edison", href: "/projects/energy-utility" },
  "energy-utility": { label: "Con Edison", href: "/projects/energy-utility" },
  cornerstone: { label: "Cornerstone", href: "/experience" },
  microsoft: { label: "Microsoft", href: "/experience" },
  "trader-hub": { label: "Trader Hub", href: "/projects/trader-hub" },
  "blueprint-takeoff": { label: "Blueprint Takeoff", href: "/projects#more-builds" },
  desksergeant: { label: "DeskSergeant", href: "/projects#more-builds" },
  "hedge-fund-agents": { label: "Hedge-fund agents", href: "/projects#more-builds" },
  "alzheimers-generative": { label: "Alzheimer’s drug discovery", href: "/projects#more-builds" },
};
