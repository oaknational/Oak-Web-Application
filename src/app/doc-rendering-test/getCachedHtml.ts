"use server";

import { getParsedDocx } from "./getParsedDocx";
import { fileIds } from "./documentIds";

import { cacheData } from "@/node-lib/cache";

export type DocumentResult =
  | {
      fileId: string;
      html: string;
      messages: string[];
    }
  | {
      fileId: string;
      error: true;
    };

// Bump this version when conversion rules or the cached result shape change.
const readCachedDoc = cacheData(getParsedDocx, ["mammoth-preview", "v5"]);

export async function getCachedDoc(fileId: string): Promise<DocumentResult> {
  try {
    if (!Object.values(fileIds).includes(fileId)) {
      throw new Error("Unsupported preview document ID");
    }
    return await readCachedDoc(fileId);
  } catch (error) {
    console.error("Failed to parse DOCX", error);
    return { fileId, error: true };
  }
}
