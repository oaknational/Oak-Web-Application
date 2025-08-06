import {
  OakDownloadCard,
  OakFlex,
  OakHeading,
  OakTagFunctional,
} from "@oaknational/oak-components";
import { uniq } from "lodash";

import {
  DOWNLOAD_TYPES,
  DownloadType,
  assertValidDownloadType,
} from "./helper";

interface CurriculumDownloadSelectionProps {
  downloadTypes: DownloadType[];
  onChange: (downloadTypes: DownloadType[]) => void;
}

export function CurriculumDownloadSelection({
  downloadTypes,
  onChange,
}: CurriculumDownloadSelectionProps) {
  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakHeading tag="h3" $font={["heading-5"]} data-testid="download-heading">
        Curriculum resources
      </OakHeading>
      <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
        {DOWNLOAD_TYPES.map((download) => {
          const isChecked = downloadTypes.includes(download.id);
          const isEditable = download.subTitle?.includes("accessible");

          return (
            <OakDownloadCard
              key={download.id}
              id={download.id}
              data-testid="resourceCard"
              value={download.id}
              name="curriculum-download"
              titleSlot={download.label}
              checked={isChecked}
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
                onChange(newDownloadTypes);
              }}
              formatSlot={
                <>
                  {download.subTitle}
                  {isEditable && (
                    <OakTagFunctional
                      key="tag"
                      $ml={"space-between-ssx"}
                      $display="inline"
                      $color={"text-primary"}
                      $font={"heading-light-7"}
                      $ph={"inner-padding-ssx"}
                      $pv={"inner-padding-ssx"}
                      label="Editable"
                      $background={"bg-decorative2-main"}
                    />
                  )}
                </>
              }
              iconName={download.icon}
            />
          );
        })}
      </OakFlex>
    </OakFlex>
  );
}
