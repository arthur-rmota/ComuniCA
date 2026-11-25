import { speechCacheDb } from "../database/speechCacheDb";

const MAX_CACHE_BYTES = 20 * 1024 * 1024;
const MAX_CACHE_ITEMS = 100;
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

const CACHE_VERSION = "piper-faber-v1";

export async function getSpeechCacheKey(
  text: string,
  speed: number,
): Promise<string | null> {
  try {
    const content = JSON.stringify([CACHE_VERSION, text, speed]);

    const bytes = new TextEncoder().encode(content);

    const hash = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

export async function getCachedSpeech(
  key: string | null,
): Promise<ArrayBuffer | null> {
  if (!key) return null;

  try {
    return await speechCacheDb.transaction(
      "rw",
      speechCacheDb.audios,
      async () => {
        const cached = await speechCacheDb.audios.get(key);

        if (!cached) return null;

        const expired = Date.now() - cached.lastUsed > CACHE_EXPIRATION;

        if (expired) {
          await speechCacheDb.audios.delete(key);

          return null;
        }

        await speechCacheDb.audios.update(key, {
          lastUsed: Date.now(),
        });

        return cached.audio;
      },
    );
  } catch (error) {
    console.warn("Erro ao consultar cache de voz:", error);

    return null;
  }
}

export async function saveCachedSpeech(
  key: string | null,
  audio: ArrayBuffer,
): Promise<void> {
  if (!key) return;

  if (audio.byteLength > MAX_CACHE_BYTES) return;

  try {
    await speechCacheDb.transaction("rw", speechCacheDb.audios, async () => {
      const now = Date.now();

      await speechCacheDb.audios
        .where("lastUsed")
        .below(now - CACHE_EXPIRATION)
        .delete();

      await speechCacheDb.audios.put({
        key,
        audio,
        size: audio.byteLength,
        lastUsed: now,
      });

      const entries = await speechCacheDb.audios.orderBy("lastUsed").toArray();

      let totalSize = entries.reduce((total, entry) => total + entry.size, 0);

      let totalItems = entries.length;

      for (const entry of entries) {
        if (totalSize <= MAX_CACHE_BYTES && totalItems <= MAX_CACHE_ITEMS) {
          break;
        }

        await speechCacheDb.audios.delete(entry.key);

        totalSize -= entry.size;
        totalItems--;
      }
    });
  } catch (error) {
    console.warn("Erro ao salvar cache de voz:", error);
  }
}

export async function clearSpeechCache(): Promise<void> {
  await speechCacheDb.audios.clear();
}
