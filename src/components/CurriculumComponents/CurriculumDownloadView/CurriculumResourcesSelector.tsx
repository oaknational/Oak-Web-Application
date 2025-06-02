import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import {
  DOWNLOAD_TYPES,
  DownloadType,
  School,
  assertValidDownloadType,
} from "./helper";

import RadioGroup from "@/components/SharedComponents/RadioButtons/RadioGroup";
import ResourceCard from "@/components/TeacherComponents/ResourceCard";

export type CurriculumDownloadViewData = {
  schools: School[];
  schoolId?: string;
  schoolName?: string;
  email?: string;
  downloadType: DownloadType;
  termsAndConditions?: boolean;
  schoolNotListed?: boolean;
};

export type CurriculumDownloadViewErrors = Partial<{
  schoolId: string;
  email: string;
  termsAndConditions: string;
  schoolNotListed: string;
}>;

type CurriculumResourcesSectionProps = {
  downloadType: DownloadType;
  onChangeDownloadType: (newDownloadType: DownloadType) => void;
};
export function CurriculumResourcesSelector({
  downloadType,
  onChangeDownloadType,
}: CurriculumResourcesSectionProps) {
  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakHeading tag="h3" $font={["heading-5"]} data-testid="download-heading">
        Curriculum resources
      </OakHeading>
      <RadioGroup
        aria-label="Subject Download Options"
        value={downloadType}
        onChange={(val) => {
          const newDownloadType = assertValidDownloadType(val);
          onChangeDownloadType(newDownloadType);
        }}
      >
        <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
          {DOWNLOAD_TYPES.map((download) => {
            return (
              <ResourceCard
                id={download.id}
                key={download.label}
                name={download.label}
                label={download.label}
                subtitle={download.subTitle ?? ""}
                resourceType="curriculum-pdf"
                onChange={() => {}}
                checked={false}
                onBlur={() => {}}
                useRadio={true}
                subjectIcon={download.icon}
              />
            );
          })}
          <OakPrimaryButton
            onClick={() => {
              throw new Error("HERE");
            }}
          >
            Test error
          </OakPrimaryButton>
        </OakFlex>
      </RadioGroup>
    </OakFlex>
  );
}
