import sha256 from "tiny-hashes/sha256";

export const createHash = (input: string) => sha256(input);
