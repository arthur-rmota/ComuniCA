import { db } from "../database/db";
import type { EmergencyPhrase } from "../types/emergencyPhrase";

export async function getEmergencyPhrases(): Promise<EmergencyPhrase[]> {
  return db.emergencyPhrases.orderBy("position").toArray();
}

export async function createEmergencyPhrase(
  data: Omit<EmergencyPhrase, "id">,
): Promise<EmergencyPhrase> {
  const phrase: EmergencyPhrase = {
    ...data,
    id: crypto.randomUUID(),
  };

  await db.emergencyPhrases.add(phrase);

  return phrase;
}

export async function updateEmergencyPhrase(
  id: string,
  changes: Partial<Omit<EmergencyPhrase, "id">>,
): Promise<EmergencyPhrase> {
  const updated = await db.emergencyPhrases.update(id, changes);

  if (updated === 0) {
    throw new Error("Frase de emergência não encontrada.");
  }

  const phrase = await db.emergencyPhrases.get(id);

  if (!phrase) {
    throw new Error("Frase de emergência não encontrada.");
  }

  return phrase;
}

export async function deleteEmergencyPhrase(id: string): Promise<void> {
  await db.transaction("rw", db.emergencyPhrases, async () => {
    const phrase = await db.emergencyPhrases.get(id);

    if (!phrase) {
      throw new Error("Frase de emergência não encontrada.");
    }

    const total = await db.emergencyPhrases.count();

    if (total <= 1) {
      throw new Error(
        "É necessário manter pelo menos uma frase de emergência cadastrada.",
      );
    }

    await db.emergencyPhrases.delete(id);
  });
}
