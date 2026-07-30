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
    <OakGrid $cg="spacing-16">
      {menu && (
        <OakGridArea $rowStart={1} $colSpan={[12, 3, 2]}>
          <OakBox>{menu}</OakBox>
        </OakGridArea>
      )}
      <OakGridArea
        $colStart={menu ? [1, 4, 3] : [1]}
        $colSpan={menu ? [12, 9, 8] : [12]}
      >
        <OakBox>{children}</OakBox>
      </OakGridArea>
    </OakGrid>
  );
}
