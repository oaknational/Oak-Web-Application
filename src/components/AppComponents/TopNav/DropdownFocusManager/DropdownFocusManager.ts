import React from "react";

import { FocusNode, FocusTreeNode } from "./types";

import {
  PupilsSubNavData,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

type NavAreaType = "teachers" | "pupils";

/**
 * Generic DropdownFocusManager that handles focus navigation for both
 * teachers and pupils navigation structures
 */
export class DropdownFocusManager<
  T extends TeachersSubNavData | PupilsSubNavData,
> {
  private readonly _typeMarker?: T;
  private readonly focusMap: Map<string, FocusNode>;
  private readonly closeMenu: () => void;
  private readonly lastSubnavButtonId: string | undefined;
  private readonly areaType: NavAreaType;

  constructor(
    focusTree: FocusTreeNode[],
    areaType: NavAreaType,
    setSelectedMenu: (a: undefined) => void,
  ) {
    this.areaType = areaType;
    this.lastSubnavButtonId = focusTree.at(-1)?.id;
    this.focusMap = this.getFocusTree(focusTree);
    this.closeMenu = () => setSelectedMenu(undefined);
  }

  public getFocusMap() {
    return this.focusMap;
  }

  private getFocusTree(focusTree: FocusTreeNode[]): Map<string, FocusNode> {
    const focusMap = new Map<string, FocusNode>();
    this.buildFocusMap({
      items: focusTree,
      focusMap,
      parent: null,
    });

    return focusMap;
  }

  private buildFocusMap({
    items,
    focusMap,
    parent,
  }: {
    items: FocusTreeNode[];
    focusMap: Map<string, FocusNode>;
    parent: FocusNode["parent"];
  }) {
    const siblingIds = items.map((item) => item.id);

    items.forEach((item, index, array) => {
      const isLastChild = index === array.length - 1;
      const isFirstChild = index === 0;
      const id = item.id;
      focusMap.set(id, {
        id,
        isLastChild,
        isFirstChild,
        parent,
        children: item.children?.map((child) => child.id) ?? [],
      });

      if (item.children && item.children.length > 0) {
        this.buildFocusMap({
          items: item.children,
          focusMap,
          parent: {
            parentId: id,
            parentSiblings: siblingIds,
          },
        });
      }
    });
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

  public handleEscapeKey({
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

  public handleKeyDown(event: React.KeyboardEvent, elementId: string) {
    if (event.key !== "Tab") return;
    const currentNode = this.focusMap.get(elementId);
    if (!currentNode) return;
    if (event.shiftKey) {
      this.handleShiftTab(event, currentNode);
    } else if (!event.shiftKey) {
      this.handleTab(currentNode, event);
    }
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
      this.lastSubnavButtonId && ancestorNode.id === this.lastSubnavButtonId;
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
      !!this.lastSubnavButtonId && currentNode.id === this.lastSubnavButtonId
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
}
