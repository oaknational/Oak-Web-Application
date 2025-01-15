"use client";
import { OakCodeRenderer } from "@oaknational/oak-components";
import React, { PropsWithChildren, ReactElement } from "react";

const CodeRenderWrapper = ({ children }: PropsWithChildren) => {
  function hasChildren(
    node: React.ReactNode,
  ): node is ReactElement<{ children?: React.ReactNode }> {
    return React.isValidElement(node) && "children" in node.props;
  }
  const drillIntoChildren = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      // Process text nodes
      return <OakCodeRenderer string={node} />;
    }
    if (hasChildren(node)) {
      return React.cloneElement(node, {
        children: React.Children.map(node.props.children, drillIntoChildren),
      });
    }
    // For fragments or non-element nodes, recursively process
    if (Array.isArray(node)) {
      return node.map(drillIntoChildren);
    }
    return node;
  };
  return drillIntoChildren(children);
};
export { CodeRenderWrapper };
