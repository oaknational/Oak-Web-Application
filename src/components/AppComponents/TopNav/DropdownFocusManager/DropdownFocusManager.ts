import React from "react";

import { FocusNode } from "./types";

import {
  isTeachersBrowseItem,
  NavButton,
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
  private readonly areaType: NavAreaType;
  private readonly lastSubnavButton: NavButton | undefined;

  constructor(
    navData: T,
    areaType: NavAreaType,
    setSelectedMenu: (a: undefined) => void,
  ) {
    this.areaType = areaType;
    this.closeMenu = () => setSelectedMenu(undefined);
    this.areaType = areaType;
    this.lastSubnavButton = Object.values(navData).at(-1);
    this.focusMap = this.getFocusTree(navData);
  }

  public getFocusMap() {
    return this.focusMap;
  }

  // ID creation method
  public createId(slug: string, parentId?: string) {
    if (parentId === undefined) {
      return `${this.areaType}-${slug}`;
    }

    return `${parentId}-${slug}`;
  }

  public getIdFromPath(path: string[]): string | null {
    if (!path[0]) return null;
    let currentId = this.createId(path[0]);

    if (!this.focusMap.has(currentId)) return null;

    for (const nextSlug of path.slice(1)) {
      const currentNode = this.focusMap.get(currentId);
      if (!currentNode) return null;

      const nextId = currentNode.children.find(
        (childId) => this.getSlugFromId(childId, currentId) === nextSlug,
      );

      if (!nextId) return null;
      currentId = nextId;
    }
    return currentId;
  }

  private getSlugFromId(id: string, parentId?: string) {
    if (!parentId) {
      return id.replace(`${this.areaType}-`, "");
    }
    const prefix = `${parentId}-`;
    return id.startsWith(prefix) ? id.slice(prefix.length) : id;
  }

  private getFocusTree(navData: T): Map<string, FocusNode> {
    const arrayOfSubNavButtons = Object.values(navData) as Record<
      string,
      unknown
    >[];

    const focusMap = new Map<string, FocusNode>();
    this.buildFocusMap({
      items: arrayOfSubNavButtons,
      focusMap,
      parent: null,
    });

    return focusMap;
  }

  private getItemSlug(item: Record<string, unknown>): string {
    if (isTeachersBrowseItem(item)) {
      return item.phases.slug;
    }
    return item.slug as string;
  }

  private buildFocusMap({
    items,
    focusMap,
    parent,
  }: {
    items: Record<string, unknown>[];
    focusMap: Map<string, FocusNode>;
    parent: FocusNode["parent"];
  }) {
    items.forEach((item, index, array) => {
      const isLastChild = index === array.length - 1;
      const isFirstChild = index === 0;
      const id = this.createId(this.getItemSlug(item), parent?.parentId);
      const childrenIds = this.getChildrenIds(item, id);

      focusMap.set(id, {
        id,
        isLastChild,
        isFirstChild,
        parent,
        children: childrenIds,
      });

      if (childrenIds.length > 0) {
        this.buildFocusMap({
          items: this.getChildrenItems(item),
          focusMap,
          parent: {
            parentId: id,
            parentSiblings: items.map((sibling) =>
              this.createId(this.getItemSlug(sibling), parent?.parentId),
            ),
          },
        });
      }
    });
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  private getChildrenItems(
    item: Record<string, unknown>,
  ): Record<string, unknown>[] {
    if (isTeachersBrowseItem(item)) {
      return [item.phases, item.keystages];
    }

    const children = item.children;
    if (!Array.isArray(children)) return [];
    return children.filter(this.isRecord);
  }

  private getChildrenIds(
    item: Record<string, unknown>,
    parentId: string,
  ): string[] {
    return this.getChildrenItems(item).map((child) =>
      this.createId(this.getItemSlug(child), parentId),
    );
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
    if (!currentNode) {
      throw new Error("Element ID not found in focus map: " + elementId);
    }
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
      ancestorNode.id === this.createId(this.lastSubnavButton.slug);
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
      currentNode.id === this.createId(this.lastSubnavButton.slug)
    );
  }

  private handleLastChildTab(
    currentNode: FocusNode,
    event: React.KeyboardEvent,
    onFinalSubmenuItemCallback?: () => void,
  ): void {
    if (this.getIsFinalElement(currentNode)) {
      this.handleFinalElementTab({ currentNode, event });
    } else {
      this.focusParentSibling(currentNode, event);
      onFinalSubmenuItemCallback?.();
    }
  }

  private handleTab(
    currentNode: FocusNode,
    event: React.KeyboardEvent,
    onFinalSubmenuItemCallback?: () => void,
  ) {
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
      this.handleLastChildTab(currentNode, event, onFinalSubmenuItemCallback);
    }
  }

  private handleShiftTab(
    event: React.KeyboardEvent,
    currentNode: FocusNode,
    onFinalSubmenuItemCallback?: () => void,
  ) {
    const isFirstChild = currentNode.isFirstChild;
    if (isFirstChild) {
      const parentId = currentNode.parent?.parentId;
      if (!parentId) return;
      this.focusElementById(parentId, event);
      onFinalSubmenuItemCallback?.();
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

  handleArrowKeyDown(event: React.KeyboardEvent, elementId: string) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const currentNode = this.getNode(elementId);
    const parentNode = currentNode.parent
      ? this.getNode(currentNode.parent?.parentId)
      : undefined;
    const siblings = parentNode?.children;
    const currentElementIndex = siblings?.indexOf(elementId);

    if (siblings && currentElementIndex !== undefined) {
      const nextElement =
        event.key === "ArrowDown"
          ? siblings.at(currentElementIndex + 1)
          : siblings.at(currentElementIndex - 1);
      const wrapAroundElement =
        event.key === "ArrowDown" ? siblings.at(0) : siblings.at(-1);

      if (nextElement) {
        this.focusElementById(nextElement);
      } else {
        // wrap around to first or last element depending on arrow direction
        wrapAroundElement && this.focusElementById(wrapAroundElement);
      }
    }
  }

  handleTabKeyDown(
    event: React.KeyboardEvent,
    elementId: string,
    // optional callback fn to be called when returning to a parent menu from within a submenu
    onFinalSubmenuItemCallback?: () => void,
  ) {
    if (event.key !== "Tab") return;
    const currentNode = this.getNode(elementId);

    if (event.shiftKey) {
      this.handleShiftTab(event, currentNode, onFinalSubmenuItemCallback);
    } else if (!event.shiftKey) {
      this.handleTab(currentNode, event, onFinalSubmenuItemCallback);
    }
  }
}
