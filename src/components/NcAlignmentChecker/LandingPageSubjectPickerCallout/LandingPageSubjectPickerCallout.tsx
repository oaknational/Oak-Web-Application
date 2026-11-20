import { OakBox, OakGrid, OakGridArea } from "@oaknational/oak-components";

import SubjectPickerForm from "../SubjectPickerForm";

import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { NcAlignmentCheckerLandingPageBlock } from "@/common-lib/cms-types";

type SubjectPickerCalloutProps = Omit<
  NcAlignmentCheckerLandingPageBlock<"NcAlignmentCheckerLandingPageSubjectPickerCallout">,
  "__typename" | "_key"
>;

export default function SubjectPickerCallout({
  subjectPicker: { title, tag, bannerLabel, buttonText },
}: SubjectPickerCalloutProps) {
  return (
    <OakBox
      $background="bg-decorative1-main"
      $pv={["spacing-56", "spacing-80"]}
    >
      <NewGutterMaxWidth>
        <OakGrid>
          <OakGridArea $colSpan={[12, 8]} $colStart={[1, 3]}>
            <SubjectPickerForm
              title={title}
              tag={tag}
              bannerLabel={bannerLabel}
              buttonText={buttonText}
            />
          </OakGridArea>
        </OakGrid>
      </NewGutterMaxWidth>
    </OakBox>
  );
}
