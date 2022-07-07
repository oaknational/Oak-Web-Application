# Icon

The `<Icon />` component should be the go to component wherever you seen an icon. The exception to this is if
the icon is clickable, in which case you should use an `<IconButton />` component (which uses `<Icon />` internally).

## Adding a new icon

If you find yourself having to add a new icon:

1. Create a new file in `components/Icon/` called `{Name}.icon.tsx`.
2. Download the svg file from the figma designs:

   i. Right-click the icon

   ii. Select "Copy as SVG"

3. [Optimise the svg](https://jakearchibald.github.io/svgomg/).
4. Using the [pattern below](#SVG), paste the svg in to the file you've created.
5. In `components/Icon/Icon.tsx` import the new icon, and add it to the list of ICON_NAMES and icons.

## SVG

All our icons are standalone SVG in TSX files which get imported into Icon.tsx, for example the Search icon code is as follows:

```tsx
import { FC } from "react";

const Search: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 17 17"
      fill="none"
    >
      <path
        d="M15.875 14.6562L12.0938 10.875C12 10.8125 11.9062 10.75 11.8125 10.75H11.4062C12.375 9.625 13 8.125 13 6.5C13 2.9375 10.0625 0 6.5 0C2.90625 0 0 2.9375 0 6.5C0 10.0938 2.90625 13 6.5 13C8.125 13 9.59375 12.4062 10.75 11.4375V11.8438C10.75 11.9375 10.7812 12.0312 10.8438 12.125L14.625 15.9062C14.7812 16.0625 15.0312 16.0625 15.1562 15.9062L15.875 15.1875C16.0312 15.0625 16.0312 14.8125 15.875 14.6562ZM6.5 11.5C3.71875 11.5 1.5 9.28125 1.5 6.5C1.5 3.75 3.71875 1.5 6.5 1.5C9.25 1.5 11.5 3.75 11.5 6.5C11.5 9.28125 9.25 11.5 6.5 11.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Search;
```

The pattern we are using relies on setting the correct `viewBox` value, and setting `width` and `height` to `100%`. Note also, that whenever there is a fill colour, we set the value to `currentColor` which takes the colour from the css context of the nearest ancestor.

## Todo

- **Multiple colours.** We haven't yet had to deal with icons with multiple colours.
- **Animations.** We may need to implement a system for icons which animate.
