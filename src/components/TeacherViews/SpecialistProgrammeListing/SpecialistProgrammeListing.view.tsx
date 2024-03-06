import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { SpecialistProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";
import SpecialistProgrammeHeaderListing from "@/components/TeacherComponents/SpecialistProgrammeHeaderListing";
import SpecialistProgrammeListing from "@/components/TeacherComponents/SpecialistProgrammeListing";
import MaxWidth from "@/components/SharedComponents/MaxWidth";

const SpecialistProgrammeListingView: FC<SpecialistProgrammeListingPageData> = (
  props,
) => {
  const { programmes, subjectSlug, subjectTitle } = props;
  return (
    <>
      <SpecialistProgrammeHeaderListing
        subjectSlug={subjectSlug}
        subjectTitle={subjectTitle}
        title="Specialist and therapies"
        description="Help your pupils with their communication and language development, including sentence composition, writing and word reading skills by exploring topics including holidays and the seasons."
        breadcrumbs={[
          {
            oakLinkProps: { page: "home" },
            label: "Home",
          },
          {
            oakLinkProps: {
              page: "specialist-subject-index",
            },
            label: "Specialist subjects",
          },
        ]}
      />
      <MaxWidth>
        <OakFlex
          $mv="space-between-xxxl"
          $justifyContent="center"
          $alignItems="center"
        >
          <SpecialistProgrammeListing
            programmes={programmes}
            onClick={() => "TODO: what is this for"}
          />
        </OakFlex>
      </MaxWidth>
    </>
  );
};

export default SpecialistProgrammeListingView;
