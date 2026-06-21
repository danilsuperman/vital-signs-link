export type ShareScope = "full" | "case" | "labs" | "documents" | "temp";
export type ShareChannel = "link" | "email" | "whatsapp";

export type ShareLink = {
  id: string;
  code: string;
  url: string;
  scope: ShareScope;
  channel: ShareChannel;
  caseTitle?: string;
  recipient?: string;
  expiresAt: number | null;
  createdAt: number;
};

const KEY = "lify.share-links";

function read(): ShareLink[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: ShareLink[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

function rand(n: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function createShareLink(params: {
  scope: ShareScope;
  channel: ShareChannel;
  caseTitle?: string;
  recipient?: string;
  ttlHours: number | null;
}): ShareLink {
  const code = `${rand(4)}-${rand(4)}`;
  const link: ShareLink = {
    id: crypto.randomUUID(),
    code,
    url: `https://secure.lify.health/case/${code}`,
    scope: params.scope,
    channel: params.channel,
    caseTitle: params.caseTitle,
    recipient: params.recipient,
    expiresAt: params.ttlHours ? Date.now() + params.ttlHours * 3600_000 : null,
    createdAt: Date.now(),
  };
  write([link, ...read()]);
  return link;
}
