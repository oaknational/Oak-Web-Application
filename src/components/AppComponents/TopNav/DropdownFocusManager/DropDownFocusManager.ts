import {
  SubNavLinks,
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

type FocusNode = {
  id: string;
  parent: string | null;
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

    (Object.keys(teachersNavData) as Array<keyof TeachersSubNavData>).forEach(
      (section) => {
        const id = `${section}-subnav-button`;
        focusMap.set(id, {
          id,
          parent: null,
          children: this.addChildrenIds(teachersNavData[section]),
        });
      },
    );
    this.buildChildrenNodes(focusMap, teachersNavData);

    return focusMap;
  }
  private buildChildrenNodes(
    focusMap: Map<string, FocusNode>,
    teachersNavData: TeachersSubNavData,
  ) {
    (Object.keys(teachersNavData) as Array<keyof TeachersSubNavData>).forEach(
      (section) => {
        const sectionData = teachersNavData[section];

        if (Array.isArray(sectionData)) {
          sectionData.forEach((link, index) => {
            const id = `${link.slug}-dropdown-button`;

            focusMap.set(id, {
              id,
              parent: `${section}-subnav-button`,
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
              parent: `${section}-subnav-button`,
              isFirstChild: index === 0,
              isLastChild: index === sectionData.keystages.length - 1,
              children: keystage.subjects.map(
                (subject) =>
                  `${keystage.slug}-${subject.subjectSlug}-subject-button`,
              ),
            });

            keystage.subjects.forEach((subject, index) => {
              const subjectId = `${keystage.slug}-${subject.subjectSlug}-subject-button`;

              focusMap.set(subjectId, {
                id: subjectId,
                parent: keystageId,
                isFirstChild: index === 0,
                children: [],
              });
            });
            // The all keystages button is the last child of the subject list
            const allKeystagesId = `${keystage.slug}-all-keystages-button`;
            focusMap.set(allKeystagesId, {
              id: allKeystagesId,
              parent: keystageId,
              isLastChild: true,
              children: [],
            });
          });
        }
      },
    );
  }
  private addChildrenIds(sectionData: SubNavLinks | TeachersBrowse) {
    // if subnav links
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
    const shouldFocusParent =
      currentNode.parent &&
      (currentNode.isFirstChild || currentNode.isLastChild);
    console.log("Should focus parent:", shouldFocusParent);
    if (!shouldFocusParent) return;
    const parentNode = this.getNode(currentNode.parent!);
    const parentElement = document.getElementById(parentNode.id);
    console.log("Parent Element:", parentElement);
    if (parentElement) {
      event.preventDefault();
      parentElement.focus();
    }
  }

  private focusFirstChild(currentNode: FocusNode, event: React.KeyboardEvent) {
    const hasChildren = currentNode.children.length > 0;
    if (hasChildren) {
      const firstChildId = currentNode.children[0]!;
      const firstChildElement = document.getElementById(firstChildId);
      if (firstChildElement) {
        event.preventDefault();
        firstChildElement.focus();
      }
    }
  }

  handleKeyDown(event: React.KeyboardEvent, elementId: string) {
    if (event.key !== "Tab") return;
    const currentNode = this.getNode(elementId);
    if (event.shiftKey) {
      //   this.focusParent(currentNode, event);
    } else if (!event.shiftKey) {
      this.focusFirstChild(currentNode, event);
    }
  }
}
