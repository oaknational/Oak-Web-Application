import { OakBreakpointName, PropsWithTheme } from "../theme";

export const getBreakpoints = ({ theme }: PropsWithTheme) => theme.breakpoints;
export const getBreakpointsArray = (props: PropsWithTheme) =>
  Object.values(getBreakpoints(props))
    .sort((a, b) => (a < b ? -1 : 1))
    // We only need to filter this to support legacy apps (see getBreakpointsForLegacyApps)
    .filter((breakpoint) => typeof breakpoint === "number")
    .map((breakpoint) => `${breakpoint}px`);
export const getBreakpoint =
  (name: OakBreakpointName) =>
  ({ theme }: PropsWithTheme) => {
    const breakpoints = getBreakpoints({ theme });
    if (!(name in breakpoints)) {
      throw new Error(`Could not get breakpoint: ${name}`);
    }
    return `${breakpoints[name]}px`;
  };
