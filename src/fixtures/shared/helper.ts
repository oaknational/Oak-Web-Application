export function getIdFromSlug(map: Map<string, number>, slug?: string) {
  if (!slug) {
    return undefined;
  } else if (map.has(slug)) {
    return map.get(slug)!;
  } else {
    const newId = map.size + 1;
    map.set(slug, newId);
    return newId;
  }
}

export function getTitleFromSlug(slug?: string) {
  if (slug) {
    return slug.slice(0, 1).toUpperCase() + slug.slice(1).replace(/-/, " ");
  }
  return undefined;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function getLessonUidFromSlug(map: Map<string, number>, slug?: string) {
  return `LESS-TEST-${getIdFromSlug(map, slug)}`;
}
