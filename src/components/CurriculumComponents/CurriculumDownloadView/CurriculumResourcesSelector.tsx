import { OakFlex, OakHeading } from "@oaknational/oak-components";
import { uniq } from "lodash";

import {
  DOWNLOAD_TYPES,
  DownloadType,
  School,
  assertValidDownloadType,
} from "./helper";

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
  downloadTypes: DownloadType[];
  onChangeDownloadTypes: (newDownloadType: DownloadType[]) => void;
};
export function CurriculumResourcesSelector({
  downloadTypes,
  onChangeDownloadTypes,
}: CurriculumResourcesSectionProps) {
  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakHeading tag="h3" $font={["heading-5"]} data-testid="download-heading">
        Curriculum resources
      </OakHeading>
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
              subjectIcon={download.icon}
              checked={downloadTypes.includes(download.id)}
              onChange={(e) => {
                const downloadType = assertValidDownloadType(e.target.value);
                let newDownloadTypes: DownloadType[];
                if (e.target.checked) {
                  newDownloadTypes = uniq([...downloadTypes, downloadType]);
                } else {
                  newDownloadTypes = downloadTypes.filter(
                    (id) => id !== downloadType,
                  );
                }
                onChangeDownloadTypes(newDownloadTypes);
              }}
            />
          );
        })}
      </OakFlex>
    </OakFlex>
  );
}
