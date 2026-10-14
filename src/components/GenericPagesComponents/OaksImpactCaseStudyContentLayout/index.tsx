import { OakGrid, OakGridArea, OakBox } from "@oaknational/oak-components";

type OaksImpactCaseStudyContentLayoutProps = {
  menu?: React.ReactNode;
  children: React.ReactNode;
};
export function OaksImpactCaseStudyContentLayout({
  menu,
  children,
}: Readonly<OaksImpactCaseStudyContentLayoutProps>) {
  return (
    <OakGrid $cg="spacing-16" $pt={["spacing-56", "spacing-80", "spacing-100"]}>
      {menu && (
        <OakGridArea $rowStart={1} $colSpan={[12, 3, 2]}>
          <OakBox $height="100%">{menu}</OakBox>
        </OakGridArea>
      )}
      <OakGridArea
        $rowStart={menu ? [2, 1, 1] : 1}
        $colStart={menu ? [1, 4, 3] : [1, 1, 3]}
        $colSpan={menu ? [12, 9, 8] : [12, 12, 8]}
      >
        <OakBox>{children}</OakBox>
      </OakGridArea>
    </OakGrid>
  );
}
