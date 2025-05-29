import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import DynamicHighlightExtension, {
  dynamicHighlightPluginKey,
  HighlightSegment,
  DynamicHighlightOptions,
} from "./dynamicHighlightExtension"; // Adjust path as needed

type DecorationWithType = Decoration & {
  type: {
    name: string;
    attrs: {
      class: string;
    };
  };
};
// Helper to get the DecorationSet from the editor state
const getDecorationSet = (editor: Editor): DecorationSet | undefined => {
  const pluginState = dynamicHighlightPluginKey.getState(editor.state);
  return pluginState instanceof DecorationSet ? pluginState : undefined;
};

describe("DynamicHighlightExtension", () => {
  let editor: Editor;

  afterEach(() => {
    if (editor && !editor.isDestroyed) {
      editor.destroy();
    }
  });

  it("should have the correct name", () => {
    expect(DynamicHighlightExtension.name).toBe("dynamicHighlight");
  });

  describe("Options", () => {
    it("should have correct default options", () => {
      editor = new Editor({
        extensions: [StarterKit, DynamicHighlightExtension],
      });
      const ext = editor.extensionManager.extensions.find(
        (e) => e.name === "dynamicHighlight",
      );
      expect(ext?.options.segments).toEqual([]);
      expect(ext?.options.className).toBe("default-dynamic-highlight");
    });

    it("should accept custom options", () => {
      const customOptions: DynamicHighlightOptions = {
        segments: [{ startIndex: 1, endIndex: 5 }],
        className: "custom-highlight-class",
      };
      editor = new Editor({
        extensions: [
          StarterKit,
          DynamicHighlightExtension.configure(customOptions),
        ],
      });
      const ext = editor.extensionManager.extensions.find(
        (e) => e.name === "dynamicHighlight",
      );
      expect(ext?.options.segments).toEqual(customOptions.segments);
      expect(ext?.options.className).toBe(customOptions.className);
    });
  });

  describe("Commands", () => {
    beforeEach(() => {
      editor = new Editor({
        content: "<p>Hello World Test</p>", // doc.content.size = 16
        extensions: [StarterKit, DynamicHighlightExtension],
      });
    });

    it("applyDynamicHighlights should update segments and trigger decoration update", () => {
      const newSegments: HighlightSegment[] = [{ startIndex: 1, endIndex: 6 }];
      const commandResult = editor
        .chain()
        .focus()
        .applyDynamicHighlights(newSegments)
        .run();

      expect(commandResult).toBe(true);
      const ext = editor.extensionManager.extensions.find(
        (e) => e.name === "dynamicHighlight",
      );
      expect(ext?.options.segments).toEqual(newSegments);

      const decorations = getDecorationSet(editor);
      expect(decorations?.find().length).toBe(1);
      const deco = decorations?.find()[0];
      expect(deco?.from).toBe(1);
      expect(deco?.to).toBe(6);
    });

    it("clearDynamicHighlights should clear segments and trigger decoration update", () => {
      editor
        .chain()
        .focus()
        .applyDynamicHighlights([{ startIndex: 1, endIndex: 6 }])
        .run();
      expect(getDecorationSet(editor)?.find().length).toBe(1);

      const commandResult = editor
        .chain()
        .focus()
        .clearDynamicHighlights()
        .run();
      expect(commandResult).toBe(true);

      const ext = editor.extensionManager.extensions.find(
        (e) => e.name === "dynamicHighlight",
      );
      expect(ext?.options.segments).toEqual([]);
      expect(getDecorationSet(editor)?.find().length).toBe(0);
    });
  });

  describe("Plugin and Decorations (Behavior of createDynamicDecorations)", () => {
    it("should initialize with decorations based on initial options", () => {
      editor = new Editor({
        content: "<p>Initial Text</p>",
        extensions: [
          StarterKit,
          DynamicHighlightExtension.configure({
            segments: [{ startIndex: 1, endIndex: 8 }],
            className: "test-init-class",
          }),
        ],
      });

      const decorations = getDecorationSet(editor);
      expect(decorations?.find().length).toBe(1);
      const deco: DecorationWithType | undefined = decorations?.find()[0] as
        | DecorationWithType
        | undefined;
      expect(deco?.from).toBe(1);
      expect(deco?.to).toBe(8);
      expect(deco?.type.attrs.class).toBe("test-init-class");
    });

    it("should warn and create no decoration for inverted segments (startIndex > endIndex)", () => {
      const consoleWarnSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      editor = new Editor({
        content: "<p>Test</p>",
        extensions: [StarterKit, DynamicHighlightExtension],
      });

      editor
        .chain()
        .focus()
        .applyDynamicHighlights([{ startIndex: 5, endIndex: 1 }])
        .run();
      const decorations = getDecorationSet(editor);

      expect(decorations?.find().length).toBe(0);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "DynamicHighlightExtension: Segment has inverted range (startIndex 5 > endIndex 1)",
        ),
      );
      consoleWarnSpy.mockRestore();
    });
  });
});
