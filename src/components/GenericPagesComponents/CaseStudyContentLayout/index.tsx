import { OakGrid, OakGridArea, OakBox } from "@oaknational/oak-components";

type CaseStudyContentLayoutProps = {
  menu?: React.ReactNode;
  children: React.ReactNode;
};
export function CaseStudyContentLayout({
  menu,
  children,
}: Readonly<CaseStudyContentLayoutProps>) {
  return (
    <OakGrid $cg="spacing-16">
      {menu && (
        <OakGridArea $rowStart={1} $colSpan={[12, 3, 2]}>
          <OakBox>{menu}</OakBox>
        </OakGridArea>
      )}
      <OakGridArea
        $colStart={menu ? [1, 4, 3] : [1, 1, 3]}
        $colSpan={menu ? [12, 9, 8] : [12, 12, 8]}
      >
        <OakBox>{children}</OakBox>
      </OakGridArea>
    </OakGrid>
  );
}
