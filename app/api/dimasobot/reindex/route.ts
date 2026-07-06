import { NextResponse } from "next/server";
import { getDimasoKnowledgeIndexStatus, rebuildDimasoKnowledgeIndex } from "@/lib/dimasobot/embeddings";

export const runtime = "nodejs";

function authorized(req: Request) {
  const secret = process.env.DIMASOBOT_REINDEX_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return req.headers.get("x-dimasobot-reindex-secret") === secret;
}

export async function GET() {
  return NextResponse.json(await getDimasoKnowledgeIndexStatus());
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await rebuildDimasoKnowledgeIndex();
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "Unable to rebuild DimasoBot knowledge index" }, { status: 500 });
  }
}
