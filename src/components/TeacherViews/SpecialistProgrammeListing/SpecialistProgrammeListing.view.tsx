import { FC } from "react";
import { OakFlex, OakMaxWidth } from "@oaknational/oak-components";

import { SpecialistProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";
import SpecialistProgrammeHeaderListing from "@/components/TeacherComponents/SpecialistProgrammeHeaderListing";
import SpecialistProgrammeListing from "@/components/TeacherComponents/SpecialistProgrammeListing";

const specialistProgrammeDescriptions: Record<string, string> = {
  "creative-arts":
    "Explore art, drama, dance and music through everyday activities while supporting the development of pupils’ communication, interaction, and fine and gross motor skills.",
  numeracy:
    "Teach your pupils important mathematical knowledge about numbers, shapes, measurement, time, positioning and money.",
  "physical-development":
    "Use different physical activities with your pupils to explore movements and help them develop and refine skills needed to play different sports.",
  "independant-living":
    "Support your pupils to develop their independence with daily living activities, including personal care, the world of work and staying safe.",
  "communication-and-language":
    "Help your pupils with their communication and language development, including sentence composition, writing and word reading skills by exploring topics including holidays and the seasons.",
};

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
        description={specialistProgrammeDescriptions[subjectSlug] ?? ""}
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
      <OakMaxWidth>
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
      </OakMaxWidth>
    </>
  );
};

export default SpecialistProgrammeListingView;
