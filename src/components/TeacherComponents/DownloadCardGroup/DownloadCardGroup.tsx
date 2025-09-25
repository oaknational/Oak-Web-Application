import React, { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";
import {
  OakBox,
  OakFieldset,
  OakGrid,
  OakHandDrawnHR,
  OakHeading,
} from "@oaknational/oak-components";

import type {
  DownloadResourceType,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import ResourceCard from "@/components/TeacherComponents/ResourceCard";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { convertBytesToMegabytes } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { groupDownloadResources } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/groupResources";

type Download = LessonDownloadsPageData["downloads"][number];
type AdditionalFile = LessonDownloadsPageData["additionalFiles"][number];

type DownloadCardProps = {
  control: Control<ResourceFormProps>;
  download: Download | AdditionalFile;
  downloadType: string;
  triggerForm: () => void;
  hasError: boolean;
  useDownloadsExperiment?: boolean;
};
const DownloadCard: FC<DownloadCardProps> = ({
  control,
  download,
  downloadType,
  triggerForm,
  hasError,
  useDownloadsExperiment,
}) => {
  return (
    <Controller
      control={control}
      name="resources"
      defaultValue={[]}
      render={({ field: { value: fieldValue, onChange, name, onBlur } }) => {
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.checked) {
            onChange([...fieldValue, downloadType]);
          } else {
            onChange(
              fieldValue.filter(
                (val: DownloadResourceType | string) => val !== downloadType,
              ),
            );
          }
          // Trigger the form to reevaluate errors
          triggerForm();
        };

        const formattedSize = download.size
          ? `${convertBytesToMegabytes(download.size)} `
          : "";
        const subtitle = `${formattedSize}(${download.ext.toUpperCase()})`;
        const isEditable = ["docx", "pptx", "ppt", "doc"].includes(
          download.ext.toLowerCase(),
        );
        return (
          <ResourceCard
            id={downloadType}
            name={name}
            label={download.label}
            subtitle={subtitle}
            resourceType={download.type}
            onChange={onChangeHandler}
            checked={fieldValue.includes(downloadType)}
            onBlur={onBlur}
            hasError={hasError}
            data-testid={`download-card-${downloadType}`}
            useDownloadsExperiment={useDownloadsExperiment}
            isEditable={isEditable}
          />
        );
      }}
    />
  );
};

export type DownloadCardGroupProps = {
  downloads?: LessonDownloadsPageData["downloads"];
  additionalFiles?: LessonDownloadsPageData["additionalFiles"];
  control: Control<ResourceFormProps>;
  hasError?: boolean;
  triggerForm: () => void;
  useDownloadsExperiment?: boolean;
};
const DownloadCardGroup: FC<DownloadCardGroupProps> = ({
  downloads,
  additionalFiles,
  control,
  hasError = false,
  triggerForm,
  useDownloadsExperiment = false,
}) => {
  const groupedDownloads = groupDownloadResources(downloads, additionalFiles);

  return Object.entries(groupedDownloads).map(([groupTitle, groupItems]) => {
    const filteredItems = groupItems.filter(
      (item) => item.exists && !item.forbidden,
    );
    return (
      <OakBox key={groupTitle}>
        <OakFieldset>
          <OakHeading
            as={"legend"}
            tag={"h3"}
            $font={"body-3"}
            $mb={"space-between-s"}
            $mt={"space-between-xs"}
          >
            {groupTitle}
          </OakHeading>
          <OakBox>
            <OakGrid
              $position="relative"
              $width="max-content"
              $gridTemplateColumns={["1fr", "max-content max-content"]}
              $cg={"space-between-s"}
              $rg={"space-between-s"}
            >
              {filteredItems.map((download) => {
                const downloadType =
                  download.type === "additional-files"
                    ? `${download.type}-${download.assetId}`
                    : download.type;
                return (
                  <DownloadCard
                    key={downloadType}
                    control={control}
                    download={download}
                    downloadType={downloadType}
                    triggerForm={triggerForm}
                    hasError={hasError}
                    useDownloadsExperiment={useDownloadsExperiment}
                  />
                );
              })}
            </OakGrid>
          </OakBox>
          <OakHandDrawnHR hrColor="grey40" $mt={"space-between-s"} />
        </OakFieldset>
      </OakBox>
    );
  });
};

export default DownloadCardGroup;
