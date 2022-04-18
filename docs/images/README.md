# Images

Images are SVGs, usually created with [Excalidraw](https://excalidraw.com/), which has a [VSCode extension](https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor) for editing in the IDE.

Do not commit binary images to the code base, Git was not designed to deal with binary file formats and it will blow up the size of the repository.

## Light and Dark Themes

GitHub flavour markdown supports [showing images only for light or dark themes](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to).

If you want to provide an image for each theme, Excalidraw can switch themes in the export menu. By convention we use `<image_name>.excalidraw.svg` for the light themed image, and `<image_name>_dark.excalidraw.svg` for the dark themed image.

### Recommended Workflow

Directly importing the original Excalidraw SVG will result in it using the light theme (at least in the VSCode Excalidraw editor), so treat the original as the light theme image, and from that export another image (with background) in the dark theme, and name that `<original_name>_dark.excalidraw.svg`. Then in the GitHub markdown file use it like

```markdown
![An informative alt text](./images/my_drawing.excalidraw.svg#gh-light-mode-only)
![An informative alt text](./images/my_drawing_dark.excalidraw.svg#gh-dark-mode-only)
```
