import { OakFlex, OakHeading, OakBox, OakP } from "@oaknational/oak-components";

import { CampaignHeader } from "@/common-lib/cms-types/campaignPage";
import CMSImage from "@/components/SharedComponents/CMSImage";
import KeyStageKeypad from "@/components/SharedComponents/KeyStageKeypad";
import SearchForm from "@/components/SharedComponents/SearchForm";
import useSearch from "@/context/Search/useSearch";
import { KeyStagesData } from "@/node-lib/curriculum-api-2023";

export const CampaignPageHeader = ({
  campaignHeader,
  keyStages,
}: {
  campaignHeader: CampaignHeader;
  keyStages: KeyStagesData;
}) => {
  const { setSearchTerm } = useSearch({});
  return (
    <OakFlex
      $background="bg-decorative5-very-subdued"
      data-testid="campaign-header"
      $width={"100%"}
      $pa={["inner-padding-xl2", "inner-padding-xl2", "inner-padding-xl6"]}
      $borderRadius="border-radius-xl"
      $justifyContent={["center", "center", "space-between"]}
      $gap="space-between-l"
    >
      <OakFlex $flexDirection="column" $gap="space-between-m2">
        <CMSImage
          $display={["block", "block", "none"]}
          image={campaignHeader.image}
          format={null}
          $width="none"
          $objectFit="contain"
        />
        <OakHeading tag="h1" $font={["heading-4", "heading-2"]}>
          {campaignHeader.heading}
        </OakHeading>
        {campaignHeader.subheading && (
          <OakP $font={"body-1"}>{campaignHeader.subheading}</OakP>
        )}
        <OakFlex
          $width={["100%", "100%", "max-content"]}
          $flexDirection="column"
          $gap="space-between-m2"
        >
          <KeyStageKeypad
            title="View subjects by key stage"
            titleTag="h3"
            keyStages={keyStages.keyStages}
            trackingOnClick={() => {}}
          />
          <OakBox
            $height={"all-spacing-0"}
            $bt={"border-solid-m"}
            $borderColor={"white"}
          />
          <OakFlex $flexDirection="column" $gap="space-between-s">
            <OakHeading tag="h3" $font="heading-7">
              Or search by keyword
            </OakHeading>
            <SearchForm
              searchContext="campaign"
              placeholderText="Search by keyword or topic"
              searchTerm=""
              handleSubmit={(value) => {
                setSearchTerm(value);
              }}
              analyticsSearchSource={"campaign page"}
            />
          </OakFlex>
        </OakFlex>
      </OakFlex>
      <CMSImage
        $display={["none", "none", "block"]}
        image={campaignHeader.image}
        format={null}
        $width="none"
        $objectFit="contain"
      />
    </OakFlex>
  );
};
