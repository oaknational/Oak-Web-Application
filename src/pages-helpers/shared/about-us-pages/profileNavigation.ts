export type ProfileNavigation = {
  prevHref: string | null;
  prevName: string | null;
  nextHref: string | null;
  nextName: string | null;
};

export type MemberCategory = "Our leadership" | "Our board";
export type MemberSection = "leadership" | "board";

export type TeamMemberRef = {
  id: string;
  name: string;
  slug?: { current?: string } | null;
};

export function getMemberSlug(member: TeamMemberRef): string {
  return member.slug?.current ?? member.id;
}

export function buildMemberHref(slug: string, section: MemberSection): string {
  return `/about-us/meet-the-team/${slug}?section=${section}`;
}

function getNeighbor(
  currentList: TeamMemberRef[],
  otherList: TeamMemberRef[],
  currentIndex: number,
  currentSection: MemberSection,
  direction: "prev" | "next",
): { href: string | null; name: string | null } {
  const otherSection: MemberSection =
    currentSection === "leadership" ? "board" : "leadership";
  const atBoundary =
    direction === "prev"
      ? currentIndex === 0
      : currentIndex === currentList.length - 1;

  // Not at boundary - return neighbor in same section
  if (!atBoundary) {
    const neighbor =
      currentList[currentIndex + (direction === "prev" ? -1 : 1)];
    if (neighbor) {
      return {
        href: buildMemberHref(getMemberSlug(neighbor), currentSection),
        name: neighbor.name,
      };
    }
  }

  // At boundary - wrap to other section if it has members
  if (otherList.length > 0) {
    const wrap = direction === "prev" ? otherList.at(-1) : otherList[0];
    if (wrap) {
      return {
        href: buildMemberHref(getMemberSlug(wrap), otherSection),
        name: wrap.name,
      };
    }
  }

  // Other section empty - wrap within same section if more than one member
  if (currentList.length > 1) {
    const wrap = direction === "prev" ? currentList.at(-1) : currentList[0];
    if (wrap) {
      return {
        href: buildMemberHref(getMemberSlug(wrap), currentSection),
        name: wrap.name,
      };
    }
  }

  return { href: null, name: null };
}

export function buildProfileNavigation(
  leadershipTeam: TeamMemberRef[],
  boardMembers: TeamMemberRef[],
  currentSlug: string,
  currentSection: MemberSection,
): ProfileNavigation {
  const currentList =
    currentSection === "leadership" ? leadershipTeam : boardMembers;
  const otherList =
    currentSection === "leadership" ? boardMembers : leadershipTeam;

  const currentIndex = currentList.findIndex(
    (member) => getMemberSlug(member) === currentSlug,
  );

  if (currentIndex === -1) {
    return { prevHref: null, prevName: null, nextHref: null, nextName: null };
  }

  const prev = getNeighbor(
    currentList,
    otherList,
    currentIndex,
    currentSection,
    "prev",
  );
  const next = getNeighbor(
    currentList,
    otherList,
    currentIndex,
    currentSection,
    "next",
  );

  return {
    prevHref: prev.href,
    prevName: prev.name,
    nextHref: next.href,
    nextName: next.name,
  };
}

export function determineMemberSection(
  leadershipTeam: TeamMemberRef[],
  boardMembers: TeamMemberRef[],
  currentSlug: string,
  requestedSection: MemberSection | null,
): MemberSection {
  const inLeadership = leadershipTeam.some(
    (member) => getMemberSlug(member) === currentSlug,
  );
  const inBoard = boardMembers.some(
    (member) => getMemberSlug(member) === currentSlug,
  );

  // If a section was requested and the member exists in that section, use it
  if (requestedSection === "leadership" && inLeadership) return "leadership";
  if (requestedSection === "board" && inBoard) return "board";

  // Default: prefer leadership if member is in both
  if (inLeadership) return "leadership";
  return "board";
}

export function getMemberCategory(section: MemberSection): MemberCategory {
  return section === "leadership" ? "Our leadership" : "Our board";
}
