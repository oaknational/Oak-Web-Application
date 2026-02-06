import React from "react";

import {
  SubNavLinks,
  TeachersSubNavData,
  PupilsSubNavData,
  TeachersBrowse,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

type FocusNode = {
  id: string;
  parent: { parentId: string; parentSiblings: string[] } | null;
  children: string[];
  isFirstChild?: boolean;
  isLastChild?: boolean;
};

type SubNavButton = {
  slug: string;
  label: string;
};

type NavAreaType = "teachers" | "pupils";

/**
 * Generic DropdownFocusManager that handles focus navigation for both
 * teachers and pupils navigation structures
 */
export class DropdownFocusManager<
  T extends TeachersSubNavData | PupilsSubNavData,
> {
  private readonly focusMap: Map<string, FocusNode>;
  private readonly closeMenu: () => void;
  private readonly lastSubnavButton: SubNavButton;
  private readonly areaType: NavAreaType;

  constructor(
    navData: T,
    areaType: NavAreaType,
    subNavButtons: SubNavButton[],
    setSelectedMenu: (a: undefined) => void,
  ) {
    this.areaType = areaType;
    this.focusMap = this.buildFocusTree(navData, subNavButtons);
    this.closeMenu = () => setSelectedMenu(undefined);
    this.lastSubnavButton = subNavButtons.at(-1)!;
  }

  public getFocusMap() {
    return this.focusMap;
  }

  private isTeachersBrowse(data: unknown): data is TeachersBrowse {
    return !!data && typeof data === "object" && "keystages" in data;
  }

  private isPupilsBrowse(data: unknown): data is PupilsSubNavData["primary"] {
    return !!data && typeof data === "object" && "years" in data;
  }

  private isSubNavLinks(data: unknown): data is SubNavLinks {
    return Array.isArray(data);
  }

  private buildFocusTree(
    navData: T,
    subNavButtons: SubNavButton[],
  ): Map<string, FocusNode> {
    const focusMap = new Map<string, FocusNode>();

    // Build top-level subnav buttons
    subNavButtons.forEach((section) => {
      const sectionData = navData[section.slug as keyof T];
      const hasChildren = this.getChildrenIds(sectionData).length > 0;
      const id = this.createSubnavButtonId(section.slug);

      focusMap.set(id, {
        id,
        parent: null,
        children: hasChildren ? this.getChildrenIds(sectionData) : [],
      });
    });

    // Build children nodes based on area type
    if (this.areaType === "teachers") {
      this.buildTeachersChildrenNodes(
        focusMap,
        navData as TeachersSubNavData,
        subNavButtons,
      );
    } else {
      this.buildPupilsChildrenNodes(
        focusMap,
        navData as PupilsSubNavData,
        subNavButtons,
      );
    }

    return focusMap;
  }

  private buildTeachersChildrenNodes(
    focusMap: Map<string, FocusNode>,
    navData: TeachersSubNavData,
    subNavButtons: SubNavButton[],
  ) {
    const parentSiblings = subNavButtons.map((section) =>
      this.createSubnavButtonId(section.slug),
    );

    subNavButtons.forEach((section) => {
      if (section.slug === "curriculum-landing-page") return;
      const sectionData = navData[section.slug as keyof TeachersSubNavData];

      if (this.isSubNavLinks(sectionData)) {
        // Handle guidance/aboutUs sections
        sectionData.forEach((link, index) => {
          const id = this.createDropdownButtonId(link.slug);
          focusMap.set(id, {
            id,
            parent: {
              parentId: this.createSubnavButtonId(section.slug),
              parentSiblings,
            },
            isFirstChild: index === 0,
            isLastChild: index === sectionData.length - 1,
            children: [],
          });
        });
      } else if (this.isTeachersBrowse(sectionData)) {
        // Handle primary/secondary browse sections
        sectionData.keystages.forEach((keystage, index) => {
          const keystageId = this.createDropdownButtonId(keystage.slug);

          focusMap.set(keystageId, {
            id: keystageId,
            parent: {
              parentId: this.createSubnavButtonId(section.slug),
              parentSiblings,
            },
            isFirstChild: index === 0,
            isLastChild: index === sectionData.keystages.length - 1,
            children: [
              ...keystage.subjects.map((subject) =>
                this.createSubjectButtonId(keystage.slug, subject.subjectSlug),
              ),
              this.createAllKeystagesButtonId(keystage.slug),
            ],
          });

          this.buildSubjectNodes({
            focusMap,
            keystage,
            parentId: keystageId,
            parentSiblings: sectionData.keystages.map((ks) =>
              this.createDropdownButtonId(ks.slug),
            ),
          });
        });
      }
    });
  }

  private buildPupilsChildrenNodes(
    focusMap: Map<string, FocusNode>,
    navData: PupilsSubNavData,
    subNavButtons: SubNavButton[],
  ) {
    const parentSiblings = subNavButtons.map((section) =>
      this.createSubnavButtonId(section.slug),
    );

    subNavButtons.forEach((section) => {
      const sectionData = navData[section.slug as keyof PupilsSubNavData];

      if (this.isPupilsBrowse(sectionData)) {
        // Handle primary/secondary year sections for pupils
        sectionData.years.forEach((year, index) => {
          const id = this.createYearButtonId(year.slug);
          focusMap.set(id, {
            id,
            parent: {
              parentId: this.createSubnavButtonId(section.slug),
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

  private buildSubjectNodes({
    focusMap,
    keystage,
    parentId,
    parentSiblings,
  }: {
    focusMap: Map<string, FocusNode>;
    keystage: TeachersBrowse["keystages"][0];
    parentId: string;
    parentSiblings: string[];
  }) {
    keystage.subjects.forEach((subject, index) => {
      const subjectId = this.createSubjectButtonId(
        keystage.slug,
        subject.subjectSlug,
      );
      focusMap.set(subjectId, {
        id: subjectId,
        parent: { parentId, parentSiblings },
        isFirstChild: index === 0,
        children: [],
      });
    });

    // The all keystages button is the last child of the subject list
    const allKeystagesId = this.createAllKeystagesButtonId(keystage.slug);
    focusMap.set(allKeystagesId, {
      id: allKeystagesId,
      parent: { parentId, parentSiblings },
      isLastChild: true,
      children: [],
    });
  }

  private getChildrenIds(sectionData: unknown): string[] {
    if (!sectionData) return [];

    if (this.isSubNavLinks(sectionData)) {
      return sectionData.map((link) => this.createDropdownButtonId(link.slug));
    }

    if (this.isTeachersBrowse(sectionData)) {
      return sectionData.keystages.map((keystage) =>
        this.createDropdownButtonId(keystage.slug),
      );
    }

    if (this.isPupilsBrowse(sectionData)) {
      return sectionData.years.map((year) =>
        this.createYearButtonId(year.slug),
      );
    }

    return [];
  }

  private focusElementById(
    elementId: string,
    event?: React.KeyboardEvent,
  ): boolean {
    const element = document.getElementById(elementId);

    if (element) {
      event?.preventDefault();
      element.focus();
      return true;
    }
    return false;
  }

  // ID creation methods
  public createSubnavButtonId(slug: string): string {
    return `${slug}-subnav-button`;
  }

  public createDropdownButtonId(slug: string): string {
    return `${slug}-dropdown-button`;
  }

  public createSubjectButtonId(
    keystageSlug: string,
    subjectSlug: string,
  ): string {
    return `${keystageSlug}-${subjectSlug}-subject-button`;
  }

  public createAllKeystagesButtonId(keystageSlug: string): string {
    return `${keystageSlug}-all-keystages-button`;
  }

  public createYearButtonId(yearSlug: string): string {
    return `${yearSlug}-year-button`;
  }

  private getNode(elementId: string): FocusNode {
    const currentNode = this.focusMap.get(elementId);
    if (!currentNode) throw new Error("Element ID not found in focus map");
    return currentNode;
  }

  private focusParentSibling(
    currentNode: FocusNode,
    event: React.KeyboardEvent,
  ): void {
    let node = currentNode;

    // Traverse up the tree until we find a parent with a next sibling
    while (node.parent) {
      const parentIndex = node.parent.parentSiblings.indexOf(
        node.parent.parentId,
      );
      const nextSiblingIndex = parentIndex + 1;

      if (nextSiblingIndex < node.parent.parentSiblings.length) {
        const siblingId = node.parent.parentSiblings[nextSiblingIndex];
        if (siblingId) {
          this.focusElementById(siblingId, event);
        }
        return;
      }

      node = this.getNode(node.parent.parentId);
    }
  }

  private getFocusableSubnavElements(): HTMLElement[] {
    const subnavId =
      this.areaType === "teachers" ? "teachers-subnav" : "pupils-subnav";
    const subnav = document.getElementById(subnavId);
    return Array.from(subnav?.querySelectorAll("a, button, input") ?? []);
  }

  private handleFinalElementTab({
    currentNode,
    event,
  }: {
    currentNode: FocusNode;
    event: React.KeyboardEvent;
  }) {
    const ancestorNode = this.getAncestorNode(currentNode);
    const focusableElements = this.getFocusableSubnavElements();

    const ancestorElementIndex = focusableElements.findIndex(
      (el) => el.id === ancestorNode.id,
    );
    const nextIndex =
      ancestorElementIndex >= focusableElements.length - 1
        ? 0
        : ancestorElementIndex + 1;
    const nextElement = focusableElements[nextIndex] as HTMLElement;
    if (nextElement) {
      event.preventDefault();
      nextElement.focus();
    }
    return this.closeMenu();
  }

  private getAncestorNode(currentNode: FocusNode): FocusNode {
    let ancestorNode: FocusNode = currentNode;
    while (ancestorNode.parent) {
      ancestorNode =
        this.focusMap.get(ancestorNode.parent.parentId) || ancestorNode;
    }
    return ancestorNode;
  }

  private getIsFinalElement(currentNode: FocusNode): boolean {
    const ancestorNode = this.getAncestorNode(currentNode);
    const isFinalElement =
      this.lastSubnavButton &&
      ancestorNode.id === this.createSubnavButtonId(this.lastSubnavButton.slug);
    return isFinalElement;
  }

  private tryFocusFirstChild(
    currentNode: FocusNode,
    event: React.KeyboardEvent,
  ): boolean {
    const firstChildId = currentNode.children[0];
    if (!firstChildId) return false;

    return this.focusElementById(firstChildId, event);
  }

  private isLastSubnavButton(currentNode: FocusNode): boolean {
    return (
      !!this.lastSubnavButton &&
      currentNode.id === this.createSubnavButtonId(this.lastSubnavButton.slug)
    );
  }

  private handleLastChildTab(
    currentNode: FocusNode,
    event: React.KeyboardEvent,
  ): void {
    if (this.getIsFinalElement(currentNode)) {
      this.handleFinalElementTab({ currentNode, event });
    } else {
      this.focusParentSibling(currentNode, event);
    }
  }

  private handleTab(currentNode: FocusNode, event: React.KeyboardEvent) {
    // Try navigating to first child if it exists
    if (this.tryFocusFirstChild(currentNode, event)) {
      return;
    }

    // Special case: close menu if we're on the last subnav button with no children
    if (this.isLastSubnavButton(currentNode)) {
      this.closeMenu();
      return;
    }

    // Handle navigation when we're on the last child
    if (currentNode.isLastChild) {
      this.handleLastChildTab(currentNode, event);
    }
  }

  private handleShiftTab(event: React.KeyboardEvent, currentNode: FocusNode) {
    const isFirstChild = currentNode.isFirstChild;
    if (isFirstChild) {
      const parentId = currentNode.parent?.parentId;
      if (!parentId) return;
      this.focusElementById(parentId, event);
    }
  }

  handleEscapeKey({
    event,
    elementId,
  }: {
    event: React.KeyboardEvent;
    elementId: string;
  }) {
    if (event.key !== "Escape") return;
    this.closeMenu();
    const currentNode = this.focusMap.get(elementId);
    if (!currentNode) return;
    const ancestorNode = this.getAncestorNode(currentNode);
    this.focusElementById(ancestorNode.id);
  }

  handleKeyDown(event: React.KeyboardEvent, elementId: string) {
    if (event.key !== "Tab") return;
    const currentNode = this.getNode(elementId);
    if (event.shiftKey) {
      this.handleShiftTab(event, currentNode);
    } else if (!event.shiftKey) {
      this.handleTab(currentNode, event);
    }
  }
}
