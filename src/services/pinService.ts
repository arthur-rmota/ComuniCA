const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

export const pinService = {
  async hash(pin: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(pin),
      "PBKDF2",
      false,
      ["deriveBits"],
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 600_000,
        hash: "SHA-256",
      },
      keyMaterial,
      256,
    );

    return `pbkdf2:600000:${toHex(salt.buffer)}:${toHex(derivedBits)}`;
  },

  async verify(pin: string, storedHash: string): Promise<boolean> {
    const parts = storedHash.split(":");

    if (parts.length !== 4 || parts[0] !== "pbkdf2") {
      return false;
    }

    const [, iterationsText, saltHex, expectedHex] = parts;

    if (
      iterationsText !== "600000" ||
      !saltHex ||
      !expectedHex ||
      !/^[0-9a-f]{32}$/i.test(saltHex) ||
      !/^[0-9a-f]{64}$/i.test(expectedHex)
    ) {
      return false;
    }

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(pin),
      "PBKDF2",
      false,
      ["deriveBits"],
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: fromHex(saltHex),
        iterations: 600_000,
        hash: "SHA-256",
      },
      keyMaterial,
      256,
    );

    const actual = new Uint8Array(derivedBits);
    const expected = fromHex(expectedHex);

    let difference = 0;

    for (let i = 0; i < actual.length; i++) {
      difference |= actual[i]! ^ expected[i]!;
    }

    return difference === 0;
  },
};
