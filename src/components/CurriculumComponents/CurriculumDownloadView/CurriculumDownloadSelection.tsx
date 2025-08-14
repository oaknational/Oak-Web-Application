import {
  OakDownloadCard,
  OakFlex,
  OakHeading,
} from "@oaknational/oak-components";
import { uniq } from "lodash";

import {
  DOWNLOAD_TYPE_LABELS,
  DownloadType,
  assertValidDownloadType,
} from "./helper";

interface CurriculumDownloadSelectionProps {
  downloadTypes: DownloadType[];
  onChange: (downloadTypes: DownloadType[]) => void;
  availableDownloadTypes: DownloadType[];
}

export function CurriculumDownloadSelection({
  downloadTypes,
  onChange,
  availableDownloadTypes,
}: CurriculumDownloadSelectionProps) {
  const shownDownloadTypes = DOWNLOAD_TYPE_LABELS.filter(({ id }) =>
    availableDownloadTypes.includes(id),
  );
  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakHeading tag="h3" $font={["heading-4"]} data-testid="download-heading">
        Curriculum resources
      </OakHeading>
      <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
        {shownDownloadTypes.map((download) => {
          const isChecked = downloadTypes.includes(download.id);

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
              formatSlot={download.subTitle}
              iconName={download.icon}
            />
          );
        })}
      </OakFlex>
    </OakFlex>
  );
}
