export type FocusNode = {
  id: string;
  parent: { parentId: string; parentSiblings: string[] } | null;
  children: string[];
  isFirstChild?: boolean;
  isLastChild?: boolean;
};

export type FocusTreeNode = {
  id: string;
  children?: FocusTreeNode[];
};
