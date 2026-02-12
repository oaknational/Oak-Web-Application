import React from "react";

import { FocusNode } from "./types";

import {
  TeachersSubNavData,
  PupilsSubNavData,
  NavSection,
  TeachersBrowse,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

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
  private readonly lastSubnavButton: NavSection | TeachersBrowse;
  private readonly areaType: NavAreaType;

  constructor(
    navData: T,
    areaType: NavAreaType,
    setSelectedMenu: (a: undefined) => void,
  ) {
    this.areaType = areaType;
    this.lastSubnavButton = Object.values(navData).at(-1) ?? null;
    this.focusMap = this.getFocusTree(navData);
    this.closeMenu = () => setSelectedMenu(undefined);
  }

  public getFocusMap() {
    return this.focusMap;
  }
  private getFocusTree(navData: T): Map<string, FocusNode> {
    const arrayOfSubNavButtons = Object.values(navData);
    const focusMap = new Map<string, FocusNode>();
    // build the tree recursively
    this.buildFocusMap({ items: arrayOfSubNavButtons, focusMap, parent: null });
    console.log("Focus map built:", focusMap);
    return focusMap;
  }

  private buildFocusMap({
    items,
    focusMap,
    parent,
  }: {
    items: Array<NavSection | TeachersBrowse>;
    focusMap: Map<string, FocusNode>;
    parent: FocusNode["parent"];
  }) {
    items.forEach((item, index, array) => {
      const isLastChild = index === array.length - 1;
      const isFirstChild = index === 0;
      const id = this.createId(parent?.parentId || "", item.slug);
      focusMap.set(id, {
        id,
        isLastChild,
        isFirstChild,
        parent,
        children: this.getChildrenIds(item, id),
      });

      if (item.children && item.children.length > 0) {
        this.buildFocusMap({
          items: item.children,
          focusMap,
          parent: {
            parentId: id,
            parentSiblings: items.map((sibling) =>
              this.createId(parent?.parentId || "", sibling.slug),
            ),
          },
        });
      }
    });
  }

  private getChildrenIds(
    item: NavSection | TeachersBrowse,
    parentId: string,
  ): string[] {
    const items = item.children ?? [];
    return items.map((item) => this.createId(parentId, item.slug));
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

  // ID creation method
  public createId(parentId: string, slug: string): string {
    if (parentId === "") {
      return `${this.areaType}-${slug}`;
    }
    return `${parentId}-${slug}`;
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
    const subnavId = `${this.areaType}-subnav`;
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
      ancestorNode.id === this.createId("", this.lastSubnavButton.slug);
    return Boolean(isFinalElement);
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
      currentNode.id === this.createId("", this.lastSubnavButton.slug)
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
    console.log("No children, trying to focus sibling or close menu");
    // Special case: close menu if we're on the last subnav button with no children
    if (this.isLastSubnavButton(currentNode)) {
      this.closeMenu();
      return;
    }

    // Handle navigation when we're on the last child
    if (currentNode.isLastChild) {
      console.log("Handling last child tab");
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
