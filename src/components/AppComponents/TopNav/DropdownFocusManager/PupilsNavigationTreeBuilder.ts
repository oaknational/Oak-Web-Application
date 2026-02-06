import { FocusNode, SubNavButton } from "./types";

import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

interface IdGenerator {
  createSubnavButtonId(slug: string): string;
  createYearButtonId(yearSlug: string): string;
}

export class PupilsNavigationTreeBuilder {
  constructor(private readonly idGenerator: IdGenerator) {}

  build(
    navData: PupilsSubNavData,
    subNavButtons: SubNavButton[],
  ): Map<string, FocusNode> {
    const focusMap = new Map<string, FocusNode>();

    // Build top-level subnav buttons
    subNavButtons.forEach((section) => {
      const id = this.idGenerator.createSubnavButtonId(section.slug);
      const sectionData = navData[section.slug as keyof PupilsSubNavData];
      const hasChildren = this.getChildrenIds(sectionData).length > 0;

      focusMap.set(id, {
        id,
        parent: null,
        children: hasChildren ? this.getChildrenIds(sectionData) : [],
      });
    });

    // Build children nodes
    this.buildChildrenNodes(focusMap, navData, subNavButtons);

    return focusMap;
  }

  private buildChildrenNodes(
    focusMap: Map<string, FocusNode>,
    navData: PupilsSubNavData,
    subNavButtons: SubNavButton[],
  ) {
    const parentSiblings = subNavButtons.map((section) =>
      this.idGenerator.createSubnavButtonId(section.slug),
    );

    subNavButtons.forEach((section) => {
      const sectionData = navData[section.slug as keyof PupilsSubNavData];

      if (
        sectionData &&
        typeof sectionData === "object" &&
        "years" in sectionData
      ) {
        // Handle primary/secondary year sections for pupils
        sectionData.years.forEach((year, index) => {
          const id = this.idGenerator.createYearButtonId(year.slug);
          focusMap.set(id, {
            id,
            parent: {
              parentId: this.idGenerator.createSubnavButtonId(section.slug),
              parentSiblings,
            },
            isFirstChild: index === 0,
            isLastChild: index === sectionData.years.length - 1,
            children: [],
          });
        });
      }
    });
  }

  private getChildrenIds(sectionData: unknown): string[] {
    if (!sectionData) return [];

    if (
      typeof sectionData === "object" &&
      "years" in sectionData &&
      sectionData.years &&
      Array.isArray(sectionData.years)
    ) {
      return sectionData.years.map((year: { slug: string }) =>
        this.idGenerator.createYearButtonId(year.slug),
      );
    }

    return [];
  }
}
