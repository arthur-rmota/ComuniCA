import { db } from "../database/db";
import type { HistoryRecord } from "../types/history";

export async function recordHistory(text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const record: HistoryRecord = {
    id,
    text: trimmed,
    createdAt: Date.now(),
  };

  await db.history.add(record);
}

export async function getHistory(): Promise<HistoryRecord[]> {
  return await db.history.orderBy("createdAt").reverse().toArray();
}

export async function clearHistory(): Promise<void> {
  await db.history.clear();
}