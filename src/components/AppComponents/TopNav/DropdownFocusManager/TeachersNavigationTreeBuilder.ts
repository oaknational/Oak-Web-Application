import { FocusNode, SubNavButton } from "./types";

import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

interface IdGenerator {
  createId(
    type:
      | "subnav-button"
      | "dropdown-button"
      | "subject-button"
      | "all-keystages-button"
      | "year-button",
    slug: string,
    keystageSlug?: string,
  ): string;
}

export class TeachersNavigationTreeBuilder {
  constructor(private readonly idGenerator: IdGenerator) {}

  build(
    navData: TeachersSubNavData,
    subNavButtons: SubNavButton[],
  ): Map<string, FocusNode> {
    const focusMap = new Map<string, FocusNode>();

    // Build top-level subnav buttons
    subNavButtons.forEach((section) => {
      const sectionData = navData[section.slug as keyof TeachersSubNavData];
      const hasChildren = this.getChildrenIds(navData, sectionData).length > 0;
      const id = this.idGenerator.createId("subnav-button", section.slug);

      focusMap.set(id, {
        id,
        parent: null,
        children: hasChildren ? this.getChildrenIds(navData, sectionData) : [],
      });
    });

    // Build children nodes
    this.buildChildrenNodes(focusMap, navData, subNavButtons);

    return focusMap;
  }

  private buildChildrenNodes(
    focusMap: Map<string, FocusNode>,
    navData: TeachersSubNavData,
    subNavButtons: SubNavButton[],
  ) {
    const parentSiblings = subNavButtons.map((section) =>
      this.idGenerator.createId("subnav-button", section.slug),
    );

    subNavButtons.forEach((section) => {
      if (section.slug === "curriculum-landing-page") return;
      const sectionData = navData[section.slug as keyof TeachersSubNavData];

      if (Array.isArray(sectionData)) {
        // Handle guidance/aboutUs sections
        sectionData.forEach((link, index) => {
          const id = this.idGenerator.createId("dropdown-button", link.slug);
          focusMap.set(id, {
            id,
            parent: {
              parentId: this.idGenerator.createId(
                "subnav-button",
                section.slug,
              ),
              parentSiblings,
            },
            isFirstChild: index === 0,
            isLastChild: index === sectionData.length - 1,
            children: [],
          });
        });
      } else if (
        sectionData &&
        typeof sectionData === "object" &&
        "keystages" in sectionData
      ) {
        // Handle primary/secondary browse sections
        sectionData.keystages.forEach((keystage, index) => {
          const keystageId = this.idGenerator.createId(
            "dropdown-button",
            keystage.slug,
          );

          focusMap.set(keystageId, {
            id: keystageId,
            parent: {
              parentId: this.idGenerator.createId(
                "subnav-button",
                section.slug,
              ),
              parentSiblings,
            },
            isFirstChild: index === 0,
            isLastChild: index === sectionData.keystages.length - 1,
            children: [
              ...keystage.subjects.map((subject) =>
                this.idGenerator.createId(
                  "subject-button",
                  subject.subjectSlug,
                  keystage.slug,
                ),
              ),
              this.idGenerator.createId("all-keystages-button", keystage.slug),
            ],
          });

          this.buildSubjectNodes({
            focusMap,
            keystage,
            parentId: keystageId,
            parentSiblings: sectionData.keystages.map((ks) =>
              this.idGenerator.createId("dropdown-button", ks.slug),
            ),
          });
        });
      }
    });
  }

  private buildSubjectNodes({
    focusMap,
    keystage,
    parentId,
    parentSiblings,
  }: {
    focusMap: Map<string, FocusNode>;
    keystage: TeachersSubNavData["primary"]["keystages"][0];
    parentId: string;
    parentSiblings: string[];
  }) {
    keystage.subjects.forEach((subject, index) => {
      const subjectId = this.idGenerator.createId(
        "subject-button",
        subject.subjectSlug,
        keystage.slug,
      );
      focusMap.set(subjectId, {
        id: subjectId,
        parent: { parentId, parentSiblings },
        isFirstChild: index === 0,
        children: [],
      });
    });

    // The all keystages button is the last child of the subject list
    const allKeystagesId = this.idGenerator.createId(
      "all-keystages-button",
      keystage.slug,
    );
    focusMap.set(allKeystagesId, {
      id: allKeystagesId,
      parent: { parentId, parentSiblings },
      isLastChild: true,
      children: [],
    });
  }

  private getChildrenIds(
    navData: TeachersSubNavData,
    sectionData: unknown,
  ): string[] {
    if (!sectionData) return [];

    if (Array.isArray(sectionData)) {
      return sectionData.map((link) =>
        this.idGenerator.createId("dropdown-button", link.slug),
      );
    }

    if (
      typeof sectionData === "object" &&
      "keystages" in sectionData &&
      sectionData.keystages &&
      Array.isArray(sectionData.keystages)
    ) {
      return sectionData.keystages.map((keystage: { slug: string }) =>
        this.idGenerator.createId("dropdown-button", keystage.slug),
      );
    }

    return [];
  }
}
