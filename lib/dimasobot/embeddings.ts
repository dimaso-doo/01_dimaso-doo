import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { buildDimasoKnowledgeChunks, type DimasoKnowledgeChunk } from "@/lib/dimasobot/knowledge";

export type DimasoKnowledgeSource = Pick<DimasoKnowledgeChunk, "title" | "url" | "text"> & {
  score?: number;
  type?: DimasoKnowledgeChunk["type"];
};

type DimasoKnowledgeIndex = {
  version: string;
  generatedAt: string;
  embeddingModel: string;
  chunkCount: number;
  chunks: Array<DimasoKnowledgeChunk & { embedding: number[] }>;
};

const indexPath = path.join(process.cwd(), "data", "dimasobot-knowledge-index.json");
const stopWords = new Set(["the", "and", "for", "with", "that", "this", "you", "your", "are", "can", "how", "what", "need", "help", "about", "from", "into", "have", "want", "does", "dimaso"]);

function embeddingModel() {
  return process.env.DIMASOBOT_EMBEDDING_MODEL || "text-embedding-3-small";
}

function knowledgeVersion(chunks: DimasoKnowledgeChunk[]) {
  return createHash("sha256").update(JSON.stringify(chunks.map(({ id, title, url, text }) => ({ id, title, url, text })))).digest("hex");
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}0-9\s+.-]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function lexicalScore(queryTokens: string[], item: DimasoKnowledgeChunk) {
  const itemText = `${item.title} ${item.text}`.toLowerCase();
  const titleText = item.title.toLowerCase();
  return queryTokens.reduce((score, token) => {
    if (!itemText.includes(token)) return score;
    return score + (titleText.includes(token) ? 4 : 1);
  }, 0)
    + (queryTokens.includes("wordpress") && itemText.includes("wordpress") ? 5 : 0)
    + (queryTokens.some((token) => ["usa", "us", "llc", "wyoming", "america", "american"].includes(token)) && itemText.includes("wyoming") ? 12 : 0);
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
    dot += a[index] * b[index];
    aMagnitude += a[index] * a[index];
    bMagnitude += b[index] * b[index];
  }
  if (!aMagnitude || !bMagnitude) return 0;
  return dot / (Math.sqrt(aMagnitude) * Math.sqrt(bMagnitude));
}

async function embedTexts(input: string[]) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: embeddingModel(),
      input,
    }),
  });

  if (!response.ok) throw new Error(`Embedding request failed with ${response.status}`);
  const payload = await response.json() as { data?: Array<{ embedding?: number[] }> };
  const embeddings = payload.data?.map((item) => item.embedding || []) || [];
  if (embeddings.length !== input.length) throw new Error("Embedding response count did not match input count");
  return embeddings;
}

async function readIndex() {
  try {
    return JSON.parse(await readFile(indexPath, "utf8")) as DimasoKnowledgeIndex;
  } catch {
    return null;
  }
}

function lexicalRetrieve(message: string, limit: number): DimasoKnowledgeSource[] {
  const queryTokens = tokenize(message);
  const chunks = buildDimasoKnowledgeChunks();
  const ranked = chunks
    .map((item) => ({ item, score: lexicalScore(queryTokens, item) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item, score }) => ({ title: item.title, url: item.url, text: item.text, type: item.type, score }));

  return ranked.length ? ranked : chunks.slice(0, limit).map((item) => ({ title: item.title, url: item.url, text: item.text, type: item.type, score: 0 }));
}

export async function rebuildDimasoKnowledgeIndex() {
  const chunks = buildDimasoKnowledgeChunks();
  const batches: Array<DimasoKnowledgeIndex["chunks"]> = [];

  for (let index = 0; index < chunks.length; index += 64) {
    const batch = chunks.slice(index, index + 64);
    const embeddings = await embedTexts(batch.map((item) => `${item.title}\n${item.url}\n${item.text}`));
    batches.push(batch.map((item, itemIndex) => ({ ...item, embedding: embeddings[itemIndex] })));
  }

  const index: DimasoKnowledgeIndex = {
    version: knowledgeVersion(chunks),
    generatedAt: new Date().toISOString(),
    embeddingModel: embeddingModel(),
    chunkCount: chunks.length,
    chunks: batches.flat(),
  };

  await mkdir(path.dirname(indexPath), { recursive: true });
  await writeFile(indexPath, JSON.stringify(index), "utf8");
  return { generatedAt: index.generatedAt, embeddingModel: index.embeddingModel, chunkCount: index.chunkCount, version: index.version };
}

export async function retrieveDimasoKnowledge(message: string, limit = 5): Promise<DimasoKnowledgeSource[]> {
  const index = await readIndex();
  if (!index || !process.env.OPENAI_API_KEY) return lexicalRetrieve(message, limit);

  try {
    const [queryEmbedding] = await embedTexts([message]);
    return index.chunks
      .map((item) => ({ item, score: cosineSimilarity(queryEmbedding, item.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item, score }) => ({ title: item.title, url: item.url, text: item.text, type: item.type, score }));
  } catch {
    return lexicalRetrieve(message, limit);
  }
}

export async function getDimasoKnowledgeIndexStatus() {
  const index = await readIndex();
  const chunks = buildDimasoKnowledgeChunks();
  return {
    exists: Boolean(index),
    generatedAt: index?.generatedAt || "",
    embeddingModel: index?.embeddingModel || embeddingModel(),
    chunkCount: index?.chunkCount || 0,
    sourceChunkCount: chunks.length,
    currentVersion: knowledgeVersion(chunks),
    indexVersion: index?.version || "",
    isCurrent: Boolean(index && index.version === knowledgeVersion(chunks) && index.embeddingModel === embeddingModel()),
  };
}
