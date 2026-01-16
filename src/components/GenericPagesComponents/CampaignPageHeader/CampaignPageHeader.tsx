import {
  OakFlex,
  OakHeading,
  OakBox,
  OakP,
  OakMaxWidth,
} from "@oaknational/oak-components";

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
  return (
    <OakMaxWidth
      $background="bg-decorative5-very-subdued"
      data-testid="campaign-header"
      $pv={["spacing-32", "spacing-32", "spacing-64"]}
      $ph={["spacing-32", "spacing-32", "spacing-64"]}
      $borderRadius="border-radius-xl"
      $justifyContent={["center", "center", "space-between"]}
      $gap="spacing-48"
      $maxWidth={["unset", "spacing-1280"]}
      $flexDirection={"row"}
    >
      <OakFlex
        $flexDirection="column"
        $gap="spacing-32"
        $alignItems={["center", "center", "flex-start"]}
      >
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
        {!campaignHeader.hideKsSelector && (
          <LinkToProduct keyStages={keyStages} />
        )}
      </OakFlex>
      <CMSImage
        $display={["none", "none", "block"]}
        image={campaignHeader.image}
        format={null}
        $width="none"
        $objectFit="contain"
      />
    </OakMaxWidth>
  );
};

const LinkToProduct = ({ keyStages }: { keyStages: KeyStagesData }) => {
  const { setSearchTerm } = useSearch({});
  return (
    <OakFlex
      $width={["100%", "100%", "max-content"]}
      $flexDirection="column"
      $gap="spacing-32"
    >
      <KeyStageKeypad
        title="View subjects by key stage"
        titleTag="h3"
        keyStages={keyStages.keyStages}
        trackingOnClick={() => {}}
      />
      <OakBox
        $height={"spacing-0"}
        $bt={"border-solid-m"}
        $borderColor={"border-inverted"}
      />
      <OakFlex $flexDirection="column" $gap="spacing-16">
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
  );
};
