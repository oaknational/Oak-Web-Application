import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, EditorState, Transaction } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export interface HighlightSegment {
  startIndex: number;
  endIndex: number;
}

export interface DynamicHighlightOptions {
  segments: HighlightSegment[];
  className: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dynamicHighlight: {
      applyDynamicHighlights: (segments: HighlightSegment[]) => ReturnType;
      clearDynamicHighlights: () => ReturnType;
    };
  }
}

export const dynamicHighlightPluginKey = new PluginKey("dynamicHighlight");

const DynamicHighlightExtension = Extension.create<DynamicHighlightOptions>({
  name: "dynamicHighlight",

  addOptions() {
    return {
      segments: [],
      className: "default-dynamic-highlight",
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: dynamicHighlightPluginKey,
        state: {
          init: (_, { doc }) => {
            // Apply initial styling to the document based on default options
            return createDynamicDecorations(
              doc,
              this.options.segments,
              this.options.className,
            );
          },
          apply: (tr, oldSet, oldState, newState) => {
            if (
              tr.docChanged ||
              tr.getMeta(dynamicHighlightPluginKey)?.segmentsChanged
            ) {
              // If doc or segments changed, apply styling
              return createDynamicDecorations(
                newState.doc,
                this.options.segments,
                this.options.className,
              );
            }
            return oldSet;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      /**
       * Applies dynamic highlights to the specified segments.
       * Uses the className configured in the extension's options.
       */
      applyDynamicHighlights:
        (segments: HighlightSegment[]) =>
        ({
          dispatch,
          state,
        }: {
          state: EditorState;
          dispatch?: (tr: Transaction) => void;
        }) => {
          this.options.segments = segments;
          if (dispatch) {
            dispatch(
              state.tr.setMeta(dynamicHighlightPluginKey, {
                segmentsChanged: true,
              }),
            );
          }
          return true;
        },
      /**
       * Clears all dynamic highlights managed by this extension instance.
       */
      clearDynamicHighlights:
        () =>
        ({
          dispatch,
          state,
        }: {
          state: EditorState;
          dispatch?: (tr: Transaction) => void;
        }) => {
          this.options.segments = []; // Clear the segments
          if (dispatch) {
            dispatch(
              state.tr.setMeta(dynamicHighlightPluginKey, {
                segmentsChanged: true,
              }),
            );
          }
          return true;
        },
    };
  },
});

function createDynamicDecorations(
  doc: EditorState["doc"],
  segments: HighlightSegment[],
  className: string,
): DecorationSet {
  const decorations: Decoration[] = [];
  segments.forEach((segment) => {
    // Check startIndex is greater than 0 and within the doc length
    const from = Math.max(0, Math.min(segment.startIndex, doc.content.size));
    // Check endIndex is greater than 0 and within the doc length
    const to = Math.max(0, Math.min(segment.endIndex, doc.content.size));
    if (from < to) {
      // If the range is valid, apply class to the segment
      decorations.push(Decoration.inline(from, to, { class: className }));
    } else if (from > to) {
      console.warn(
        `DynamicHighlightExtension: Segment has inverted range (startIndex ${segment.startIndex} > endIndex ${segment.endIndex})`,
      );
    }
  });
  return DecorationSet.create(doc, decorations);
}

export default DynamicHighlightExtension;
