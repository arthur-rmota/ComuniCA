import Dexie, { type Table } from "dexie";

export type CachedSpeech = {
  key: string;
  audio: ArrayBuffer;
  size: number;
  lastUsed: number;
};

class SpeechCacheDatabase extends Dexie {
  audios!: Table<CachedSpeech, string>;

  constructor() {
    super("ComuniCASpeechCache");

    this.version(1).stores({
      audios: "key, lastUsed",
    });
  }
}

export const speechCacheDb = new SpeechCacheDatabase();
