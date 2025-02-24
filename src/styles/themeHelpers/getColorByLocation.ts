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

    return theme.colors?.[colorName];
  };

export default getColorByLocation;
