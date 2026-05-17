import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derive a 32-byte key from the ENCRYPTION_KEY env var using scrypt.
 * This ensures the key is always the right length regardless of input.
 */
function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error("ENCRYPTION_KEY environment variable is not set.");
  }
  // Use a fixed salt derived from the secret itself (deterministic)
  const salt = "chatkit-encryption-salt-v1";
  return scryptSync(secret, salt, KEY_LENGTH);
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns a base64 string: [iv (16 bytes)][authTag (16 bytes)][encrypted data]
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Prepend IV and authTag so we can decrypt later
  const result = Buffer.concat([iv, authTag, encrypted]);
  return result.toString("base64");
}

/**
 * Decrypt a base64-encoded AES-256-GCM ciphertext back to plaintext.
 */
export function decrypt(ciphertext: string): string {
  // If it doesn't look like encrypted data, return as-is (for migration compat)
  if (!ciphertext || !ciphertext.startsWith("ey") && ciphertext.length < 50) {
    return ciphertext;
  }

  try {
    const key = getKey();
    const buffer = Buffer.from(ciphertext, "base64");

    if (buffer.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      // Too short to be encrypted — return as-is (plaintext migration compat)
      return ciphertext;
    }

    const iv = buffer.subarray(0, IV_LENGTH);
    const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch {
    // If decryption fails, return as-is (plaintext migration compat)
    console.warn("[crypto] Failed to decrypt message — returning raw content (migration mode)");
    return ciphertext;
  }
}

/**
 * Batch decrypt an array of message objects.
 * Mutates the `content` field in place and returns the array.
 */
export function decryptMessages<T extends { content: string }>(
  messages: T[]
): T[] {
  return messages.map((msg) => ({
    ...msg,
    content: decrypt(msg.content),
  }));
}

/**
 * Check if a string looks like encrypted data (base64 with iv+tag prefix).
 * Used to detect whether migration is needed.
 */
export function isEncrypted(value: string): boolean {
  try {
    const buffer = Buffer.from(value, "base64");
    return buffer.length > IV_LENGTH + AUTH_TAG_LENGTH;
  } catch {
    return false;
  }
}
