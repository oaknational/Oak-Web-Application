import {
  OakFlex,
  OakHeading,
  OakP,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { CampaignHeader } from "@/common-lib/cms-types/campaignPage";
import CMSImage from "@/components/SharedComponents/CMSImage";
import SearchForm from "@/components/SharedComponents/SearchForm";
import useSearch from "@/context/Search/useSearch";

export const CampaignPageHeader = ({
  campaignHeader,
}: {
  campaignHeader: CampaignHeader;
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
          $objectFit="contain"
        />
        <OakHeading tag="h1" $font={["heading-4", "heading-2"]}>
          {campaignHeader.heading}
        </OakHeading>
        {campaignHeader.subheading && (
          <OakP $font={"body-1"}>{campaignHeader.subheading}</OakP>
        )}
        {!campaignHeader.hideKsSelector && <LinkToProduct />}
      </OakFlex>
      <CMSImage
        $display={["none", "none", "block"]}
        image={campaignHeader.image}
        format={null}
        $objectFit="contain"
      />
    </OakMaxWidth>
  );
};

const LinkToProduct = () => {
  const { setSearchTerm } = useSearch({});
  return (
    <OakFlex
      $width={["100%", "100%", "max-content"]}
      $flexDirection="column"
      $gap="spacing-32"
    >
      <OakFlex $flexDirection="column" $gap="spacing-16">
        <OakHeading tag="h3" $font="heading-7">
          Search by keyword
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
