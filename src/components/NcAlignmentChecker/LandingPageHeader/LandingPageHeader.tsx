import {
  OakBox,
  OakBreadcrumbs,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";

import { NcAlignmentCheckerLandingPageBlock } from "@/common-lib/cms-types";
import { resolveOakHref } from "@/common-lib/urls";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import SubjectPickerForm from "@/components/NcAlignmentChecker/SubjectPickerForm";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText/PortableText";

type NcAlignmentCheckerLandingPageHeaderProps = Omit<
  NcAlignmentCheckerLandingPageBlock<"NcAlignmentCheckerLandingPageHeader">,
  "__typename" | "_key"
>;

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP
        $mt={["spacing-12", "spacing-24"]}
        $font={["heading-light-7", "heading-light-6"]}
      >
        {children}
      </OakP>
    ),
  },
};

export default function NcAlignmentCheckerLandingPageHeader({
  title,
  icon,
  bodyRaw,
  subjectPicker,
}: Readonly<NcAlignmentCheckerLandingPageHeaderProps>) {
  return (
    <OakBox
      $background="bg-decorative1-main"
      $pt={["spacing-56", "spacing-32", "spacing-32"]}
      $pb={["spacing-56", "spacing-72", "spacing-72"]}
    >
      <NewGutterMaxWidth>
        <OakBox $display={["none", "block", "block"]}>
          <OakBreadcrumbs
            breadcrumbs={[
              { text: "Home", href: resolveOakHref({ page: "home" }) },
              { text: "National curriculum alignment checker" },
            ]}
          />
        </OakBox>
        <OakGrid $pt={["spacing-0", "spacing-32", "spacing-32"]}>
          <OakGridArea
            $colSpan={[12, 12, 5]}
            $pv={["spacing-0", "spacing-0", "spacing-80"]}
          >
            <OakFlex
              $flexDirection="column"
              $gap={["spacing-16", "spacing-32"]}
            >
              <OakImage
                src={getProxiedSanityAssetUrl(icon.asset?.url) ?? ""}
                alt={icon.altText ?? ""}
                $width="spacing-180"
                $aspectRatio="29/19"
              />
              <OakFlex $flexDirection="column" $maxWidth="spacing-800">
                <OakHeading tag="h1" $font={["heading-4", "heading-2"]}>
                  {title}
                </OakHeading>
                <PortableTextWithDefaults
                  components={portableTextComponents}
                  value={bodyRaw}
                />
              </OakFlex>
            </OakFlex>
          </OakGridArea>
          <OakGridArea
            $colSpan={[12, 12, 6]}
            $colStart={[1, 1, 7]}
            $pt={["spacing-32", "spacing-40", "spacing-0"]}
          >
            <SubjectPickerForm {...subjectPicker} />
          </OakGridArea>
        </OakGrid>
      </NewGutterMaxWidth>
    </OakBox>
  );
}
