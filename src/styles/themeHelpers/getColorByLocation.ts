import { OakColorName, PropsWithTheme } from "../theme";

/**
 * To be used primarily in styled components
 * Example:
 * const Something = styled.div`
 *   color: ${getColorByLocation({ theme } => theme.something.textColor)};
 * `
 * where theme extends the following:
 * type OakTheme = {
 *   ...,
 *   something: {
 *     ...,
 *     textColor: OakColorName
 *   }
 * }
 *
 */
const getColorByLocation =
  (getter: (props: PropsWithTheme) => OakColorName) =>
  ({ theme }: PropsWithTheme): string => {
    const colorName = getter({ theme });
    const color = theme.colors[colorName];

    if (!color) {
      console.warn(`Color ${colorName} not found in theme`);
      return "inherit";
    }

    return color;
  };

export default getColorByLocation;
