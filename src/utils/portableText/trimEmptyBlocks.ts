import { PortableTextJSON } from "@/common-lib/cms-types/portableText";

/**
 * Checks if a portable text block is empty (contains no text content)
 */
function isEmptyBlock(block: Record<string, unknown>): boolean {
  if (block._type !== "block") return false;
  const children = block.children as Array<{ text?: string }> | undefined;
  if (!children || children.length === 0) return true;
  return children.every((child) => !child.text || child.text.trim() === "");
}

/**
 * Removes trailing empty blocks from portable text.
 * Useful for cleaning up CMS content that may have trailing empty paragraphs.
 */
export function trimTrailingEmptyBlocks(
  blocks: PortableTextJSON | null | undefined,
): PortableTextJSON | null {
  if (!blocks || blocks.length === 0) return null;

  // Find the last non-empty block index
  let lastNonEmptyIndex = blocks.length - 1;
  while (lastNonEmptyIndex >= 0 && isEmptyBlock(blocks[lastNonEmptyIndex])) {
    lastNonEmptyIndex--;
  }

  if (lastNonEmptyIndex < 0) return null;
  if (lastNonEmptyIndex === blocks.length - 1) return blocks;

  return blocks.slice(0, lastNonEmptyIndex + 1);
}
