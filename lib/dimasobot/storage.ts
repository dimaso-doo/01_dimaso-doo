import { appendFile, mkdir, readFile } from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

type StoredRecord = Record<string, unknown>;

function kvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function kvCommand<T>(parts: string[]) {
  const config = kvConfig();
  if (!config) return null;
  const target = `${config.url}/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
  const response = await fetch(target, {
    headers: { Authorization: `Bearer ${config.token}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`KV command failed: ${response.status}`);
  return await response.json() as { result: T };
}

export async function appendDimasoBotRecord(list: "leads" | "conversations" | "messages" | "memory", record: StoredRecord) {
  const line = `${JSON.stringify(record)}\n`;

  try {
    await kvCommand<number>(["lpush", `dimasobot:${list}`, JSON.stringify(record)]);
  } catch (error) {
    console.error(`DimasoBot KV write failed for ${list}`, error);
  }

  try {
    await mkdir(dataDir, { recursive: true });
    await appendFile(path.join(dataDir, `dimasobot-${list}.jsonl`), line, "utf8");
  } catch (error) {
    console.error(`DimasoBot local write failed for ${list}`, error);
  }
}

export async function readDimasoBotRecords<T>(list: "leads" | "conversations" | "messages" | "memory", limit = 100) {
  try {
    const response = await kvCommand<string[]>(["lrange", `dimasobot:${list}`, "0", String(limit - 1)]);
    if (response?.result?.length) return response.result.map((item) => JSON.parse(item) as T);
  } catch (error) {
    console.error(`DimasoBot KV read failed for ${list}`, error);
  }

  try {
    const raw = await readFile(path.join(dataDir, `dimasobot-${list}.jsonl`), "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as T)
      .reverse()
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function hasPersistentDimasoBotStorage() {
  return Boolean(kvConfig());
}
