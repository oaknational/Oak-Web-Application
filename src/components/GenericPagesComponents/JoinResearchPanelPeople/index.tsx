import {
  OakFlex,
  OakHeading,
  OakBox,
  OakImage,
} from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types/aboutPages";

export type JoinResearchPanelPeopleProps = Omit<
  JoinResearchPanelPageBlock<"JoinResearchPanelPagePeople">,
  "__typename"
>;
export default function JoinResearchPanelPeople({
  title,
  members,
}: Readonly<JoinResearchPanelPeopleProps>) {
  return (
    <NewGutterMaxWidth>
      <OakFlex $flexDirection={"column"} $pb={"spacing-80"} $gap={"spacing-32"}>
        <OakHeading
          tag={`h2`}
          $color={"text-primary"}
          $font={["heading-4", "heading-3", "heading-3"]}
        >
          {title}
        </OakHeading>
        <OakFlex
          $gap={["spacing-32", "spacing-16", "spacing-16"]}
          $flexDirection={["column", "column", "row"]}
        >
          {members.slice(0, 2).map((member) => {
            const imageUrl = getProxiedSanityAssetUrl(member.image?.asset?.url);

            return (
              <OakFlex
                key={member.name}
                $flexDirection={["column", "row", "row"]}
                $gap={["spacing-32", "spacing-16", "spacing-16"]}
              >
                <OakFlex
                  $minWidth={"spacing-240"}
                  $width={"spacing-240"}
                  $borderRadius={"border-radius-m2"}
                  $overflow={"hidden"}
                >
                  {imageUrl && (
                    <OakImage
                      src={imageUrl}
                      alt={member.image?.altText ?? ""}
                      $width={"100%"}
                      $aspectRatio={"2/3"}
                      $objectFit={"cover"}
                      style={{ objectPosition: "center" }}
                    />
                  )}
                </OakFlex>
                <OakFlex
                  $flexDirection={"column"}
                  $gap={"spacing-16"}
                  $flexShrink={1}
                  $flexGrow={1}
                  $justifyContent={["flex-start", "center", "flex-start"]}
                >
                  <OakHeading
                    tag={`h3`}
                    $color={"text-primary"}
                    $font={["heading-5", "heading-4", "heading-4"]}
                  >
                    {member.name}
                  </OakHeading>
                  <OakBox>
                    <PortableTextWithDefaults value={member.bodyRaw} />
                  </OakBox>
                </OakFlex>
              </OakFlex>
            );
          })}
        </OakFlex>
      </OakFlex>
    </NewGutterMaxWidth>
  );
}
