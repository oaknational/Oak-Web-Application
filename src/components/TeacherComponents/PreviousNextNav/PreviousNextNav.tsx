import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import PreviousNextItem from "./PreviousNextItem";

export type PreviousNextNavProps = {
  /**
   * The type of resource to be navigated
   */
  navItemType: "unit" | "lesson";
  /**
   * The level of the decorative background colour to be used. Defaults to transparent.
   */
  backgroundColorLevel: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Optional - index of the current item that nav is relative to
   */
  currentIndex?: number;
  /**
   * Properties for the Previous nav item
   */
  previous?: {
    href: string;
    title: string;
  };
  /**
   * Properties for the Next nav item
   */
  next?: {
    href: string;
    title: string;
  };
};

export default function PreviousNextNav(props: Readonly<PreviousNextNavProps>) {
  const { backgroundColorLevel, previous, next, currentIndex, navItemType } =
    props;
  return (
    <OakGrid $rg={"spacing-24"}>
      {previous && (
        <OakGridArea $colSpan={[12, 4, 3]}>
          <PreviousNextItem
            navDirection="prev"
            navItemType={navItemType}
            href={previous.href}
            backgroundColorLevel={backgroundColorLevel}
            title={previous.title}
            index={currentIndex ? currentIndex - 1 : undefined}
          />
        </OakGridArea>
      )}
      {next && (
        <OakGridArea $colSpan={[12, 4, 3]} $colStart={[1, 9, 10]}>
          <PreviousNextItem
            navDirection="next"
            navItemType={navItemType}
            href={next.href}
            backgroundColorLevel={backgroundColorLevel}
            title={next.title}
            index={currentIndex ? currentIndex + 1 : undefined}
          />
        </OakGridArea>
      )}
    </OakGrid>
  );
}
