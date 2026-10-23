import {
  OakFlex,
  OakGridArea,
  OakHeading,
  OakTertiaryOLNav,
} from "@oaknational/oak-components";

const contentsItems = [
  { title: "Explanation", href: "#explanation" },
  {
    title: "Check for understanding",
    href: "#check-for-understanding",
  },
  { title: "Practice", href: "#practice" },
  { title: "Feedback", href: "#feedback" },
];

function ContentsList({ headingId }: Readonly<{ headingId: string }>) {
  return (
    <>
      <OakHeading
        id={headingId}
        tag="h2"
        $font="heading-light-7"
        $mb={"spacing-24"}
      >
        Contents
      </OakHeading>
      <OakTertiaryOLNav
        items={contentsItems}
        aria-labelledby={headingId}
        anchorTarget={"the-thinking-behind-oak-lessons-contents"}
      />
    </>
  );
}

export function ShortReadsNav() {
  return (
    <>
      {/* Mobile/tablet contents nav */}
      <OakGridArea $colSpan={12} $display={["flex", "flex", "none"]}>
        <OakFlex
          $flexDirection={"column"}
          $pt="spacing-24"
          $pb="spacing-24"
          $width={"100%"}
          $maxWidth={["100%", "spacing-640", "spacing-640"]}
          $mh="auto"
        >
          <ContentsList headingId="short-read-contents-mobile" />
        </OakFlex>
      </OakGridArea>
      {/* Desktop contents nav */}
      <OakGridArea
        $colSpan={[12, 3]}
        $alignSelf={"start"}
        $position={["static", "static", "sticky"]}
        $top={"spacing-56"}
        $display={["none", "none", "block"]}
        $maxWidth={[null, "spacing-640", "spacing-640"]}
      >
        <ContentsList headingId="short-read-contents" />
      </OakGridArea>
    </>
  );
}
