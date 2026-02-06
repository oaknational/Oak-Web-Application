import React from "react";

import { subNavButtons } from "../SubNav/TeachersSubNav";

import {
  SubNavLinks,
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

type FocusNode = {
  id: string;
  parent: { parentId: string; parentSiblings: string[] } | null;
  children: string[];
  isFirstChild?: boolean;
  isLastChild?: boolean;
};

export class DropdownFocusManager {
  private focusMap: Map<string, FocusNode>;
  private closeMenu: () => void;
  private lastSubnavButton: (typeof subNavButtons)[number];

  constructor(
    teachersNavData: TeachersSubNavData,
    setSelectedMenu: (a: undefined) => void,
  ) {
    this.focusMap = this.buildFocusTree(teachersNavData);
    this.closeMenu = () => setSelectedMenu(undefined);
    this.lastSubnavButton = subNavButtons[subNavButtons.length - 1]!;
  }

  public getFocusMap() {
    return this.focusMap;
  }
  private buildFocusTree(teachersNavData: TeachersSubNavData) {
    const focusMap = new Map<string, FocusNode>();

    subNavButtons.forEach((section) => {
      const hasChildren = section.slug !== "curriculum";
      const id = this.createSubnavButtonId(section.slug);
      focusMap.set(id, {
        id,
        parent: null,

        children: hasChildren
          ? this.addChildrenIds(
              teachersNavData[section.slug as keyof TeachersSubNavData],
            )
          : [],
      });
    });
    this.buildChildrenNodes(focusMap, teachersNavData);
    return focusMap;
  }
  private buildChildrenNodes(
    focusMap: Map<string, FocusNode>,
    teachersNavData: TeachersSubNavData,
  ) {
    const parentSiblings = subNavButtons.map((section) =>
      this.createSubnavButtonId(section.slug),
    );
    subNavButtons.forEach((section) => {
      if (section.slug === "curriculum-landing-page") return;
      const sectionData =
        teachersNavData[section.slug as keyof TeachersSubNavData];

      if (Array.isArray(sectionData)) {
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

        // if teachers browse
      } else if ("keystages" in sectionData) {
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
  private addChildrenIds(sectionData: SubNavLinks | TeachersBrowse) {
    if (!sectionData) return [];
    if (Array.isArray(sectionData)) {
      return sectionData.map((link) => this.createDropdownButtonId(link.slug));
    }

    // if teachers browse
    if ("keystages" in sectionData) {
      return sectionData.keystages.map((keystage) =>
        this.createDropdownButtonId(keystage.slug),
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

  private getNode(elementId: string): FocusNode {
    const currentNode = this.focusMap.get(elementId);
    if (!currentNode) throw new Error("Element ID not found in focus map");
    return currentNode;
  }
  private focusParent(currentNode: FocusNode, event: React.KeyboardEvent) {
    if (!currentNode.parent) return;
    this.focusElementById(currentNode.parent.parentId, event);
  }
  private focusParentSibling(
    currentNode: FocusNode,
    event: React.KeyboardEvent,
  ): undefined {
    if (!currentNode.parent) return;

    const parentIndex = currentNode.parent.parentSiblings.indexOf(
      currentNode.parent.parentId,
    );
    const siblingIndex = parentIndex + 1;

    if (siblingIndex >= currentNode.parent.parentSiblings.length)
      return this.focusParentSibling(
        this.getNode(currentNode.parent.parentId),
        event,
      );
    const siblingId = currentNode.parent.parentSiblings[siblingIndex];
    if (siblingId) {
      this.focusElementById(siblingId, event);
    }
  }

  private getFocusableSubnavElements(): HTMLElement[] {
    const subnav = document.getElementById("teachers-subnav");
    return Array.from(
      subnav?.querySelectorAll("a, button") ?? [],
    ) as HTMLElement[];
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
    event.preventDefault();
    nextElement.focus();
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

  private handleTab(currentNode: FocusNode, event: React.KeyboardEvent) {
    const hasChildren = currentNode.children.length > 0;
    const firstChildId = hasChildren && currentNode.children[0]!;
    if (firstChildId) {
      const focused = this.focusElementById(firstChildId, event);
      if (focused) {
        return;
      } else if (
        this.lastSubnavButton &&
        currentNode.id === this.createSubnavButtonId(this.lastSubnavButton.slug)
      ) {
        this.closeMenu();
      }
    }
    const isLastChild = currentNode.isLastChild;
    if (isLastChild) {
      const isFinalElement = this.getIsFinalElement(currentNode);

      if (isFinalElement)
        return this.handleFinalElementTab({ currentNode, event });

      this.focusParentSibling(currentNode, event);
    }
  }

  private handleShiftTab(event: React.KeyboardEvent, currentNode: FocusNode) {
    const isFirstChild = currentNode.isFirstChild;
    if (isFirstChild) {
      this.focusParent(currentNode, event);
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
