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

  constructor(teachersNavData: TeachersSubNavData) {
    this.focusMap = this.buildFocusTree(teachersNavData);
  }

  private getFocusMap() {
    return this.focusMap;
  }
  private buildFocusTree(teachersNavData: TeachersSubNavData) {
    const focusMap = new Map<string, FocusNode>();

    subNavButtons.forEach((section) => {
      const hasChildren = section.slug !== "curriculum";
      const id = `${section.slug}-subnav-button`;
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
    const parentSiblings = subNavButtons.map(
      (section) => `${section.slug}-subnav-button`,
    );
    subNavButtons.forEach((section) => {
      if (section.slug === "curriculum-landing-page") return;
      const sectionData =
        teachersNavData[section.slug as keyof TeachersSubNavData];

      if (Array.isArray(sectionData)) {
        sectionData.forEach((link, index) => {
          const id = `${link.slug}-dropdown-button`;

          focusMap.set(id, {
            id,
            parent: {
              parentId: `${section.slug}-subnav-button`,
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
          const keystageId = `${keystage.slug}-dropdown-button`;

          focusMap.set(keystageId, {
            id: keystageId,
            parent: {
              parentId: `${section.slug}-subnav-button`,
              parentSiblings,
            },
            isFirstChild: index === 0,
            isLastChild: index === sectionData.keystages.length - 1,
            children: [
              ...keystage.subjects.map(
                (subject) =>
                  `${keystage.slug}-${subject.subjectSlug}-subject-button`,
              ),
              `${keystage.slug}-all-keystages-button`,
            ],
          });

          this.buildSubjectNodes({
            focusMap,
            keystage,
            parentId: keystageId,
            parentSiblings: sectionData.keystages.map(
              (ks) => `${ks.slug}-dropdown-button`,
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
      const subjectId = `${keystage.slug}-${subject.subjectSlug}-subject-button`;
      focusMap.set(subjectId, {
        id: subjectId,
        parent: { parentId, parentSiblings },
        isFirstChild: index === 0,
        children: [],
      });
    });
    // The all keystages button is the last child of the subject list
    const allKeystagesId = `${keystage.slug}-all-keystages-button`;
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
      return sectionData.map((link) => `${link.slug}-dropdown-button`);
    }

    // if teachers browse
    if ("keystages" in sectionData) {
      return sectionData.keystages.map(
        (keystage) => `${keystage.slug}-dropdown-button`,
      );
    }
    return [];
  }

  private getNode(elementId: string): FocusNode {
    const currentNode = this.focusMap.get(elementId);
    if (!currentNode) throw new Error("Element ID not found in focus map");
    return currentNode;
  }
  private focusParent(currentNode: FocusNode, event: React.KeyboardEvent) {
    if (!currentNode.parent) return;
    const parentElement = document.getElementById(currentNode.parent.parentId);
    if (parentElement) {
      event.preventDefault();
      parentElement.focus();
    }
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
    const siblingElement = document.getElementById(siblingId!);
    if (siblingElement) {
      event.preventDefault();
      siblingElement.focus();
    }
  }

  private handleTab(currentNode: FocusNode, event: React.KeyboardEvent) {
    const hasChildren = currentNode.children.length > 0;
    const firstChildId = hasChildren && currentNode.children[0]!;
    if (firstChildId) {
      const firstChildElement = document.getElementById(firstChildId);
      if (firstChildElement) {
        event.preventDefault();
        return firstChildElement.focus();
      }
    }

    const isLastChild = currentNode.isLastChild;

    if (isLastChild) this.focusParentSibling(currentNode, event);
  }
  private handleShiftTab(event: React.KeyboardEvent, currentNode: FocusNode) {
    const isFirstChild = currentNode.isFirstChild;
    if (isFirstChild) {
      this.focusParent(currentNode, event);
    }
  }

  private focusNode(node: FocusNode) {
    const element = document.getElementById(node.id);
    if (element) {
      element.focus();
    }
  }

  handleEscapeKey({
    event,
    elementId,
    setSelectedMenu,
  }: {
    event: React.KeyboardEvent;
    elementId: string;
    setSelectedMenu: (a: undefined) => void;
  }) {
    if (event.key !== "Escape") return;
    setSelectedMenu(undefined);
    const currentNode = this.focusMap.get(elementId);
    if (!currentNode) return;
    // get the oldest ancestor node (the one without a parent) and focus it
    let ancestorNode = currentNode;
    while (ancestorNode.parent) {
      ancestorNode = this.focusMap.get(ancestorNode.parent.parentId)!;
    }
    this.focusNode(ancestorNode);
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
