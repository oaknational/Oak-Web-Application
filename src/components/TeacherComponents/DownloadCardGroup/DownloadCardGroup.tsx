import React, { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";
import styled from "styled-components";

import type {
  DownloadResourceType,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import ResourceCard from "@/components/TeacherComponents/ResourceCard";
import { sortDownloadResources } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/sortResources";
import Box from "@/components/SharedComponents/Box";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { OakGrid } from "@/styles/oakThemeApp";

export type DownloadCardGroupProps = {
  downloads?: LessonDownloadsPageData["downloads"];
  control: Control<ResourceFormProps>;
  hasError?: boolean;
  triggerForm: () => void;
};

const DownloadCardArea = styled(Box)<{ area: string }>`
  grid-area: ${(props) => props.area};
  margin-bottom: 16px;
`;

const getGridArea = (
  type: DownloadResourceType,
  presentationExists: boolean,
  worksheetsLength?: number,
) => {
  if (type === "curriculum-pdf") {
    return "auto";
  } else if (type !== "worksheet-pdf" && type !== "worksheet-pptx") {
    return type;
  } else if (worksheetsLength === 2 || !presentationExists) {
    return type;
  } else {
    return "presentationOrWorksheet";
  }
};

const DownloadCardGroup: FC<DownloadCardGroupProps> = ({
  downloads,
  control,
  hasError = false,
  triggerForm,
}) => {
  const worksheetsLength = downloads?.filter(
    (d) => d.type === "worksheet-pdf" || d.type === "worksheet-pptx",
  )?.length;
  const presentationExists =
    downloads?.filter((d) => d.type === "presentation")?.length === 1;

  const sortedDownloads = downloads
    ? sortDownloadResources(downloads)
    : undefined;

  console.log(sortedDownloads, "<< sortedDownloads");

  return (
    <OakGrid
      $position="relative"
      $width="max-content"
      $gridTemplateColumns={["1fr", "max-content max-content"]}
      $cg={"space-between-s"}
      $gridTemplateAreas={[
        `"presentation" "presentationOrWorksheet" "worksheet-pdf" "worksheet-pptx" "intro-quiz-questions" "intro-quiz-answers" "exit-quiz-questions" "exit-quiz-answers" "supplementary-pdf" "supplementary-docx"`,
        `"presentation presentationOrWorksheet" "worksheet-pdf worksheet-pptx" "intro-quiz-questions intro-quiz-answers" "exit-quiz-questions exit-quiz-answers" "supplementary-pdf supplementary-docx"`,
      ]}
    >
      {sortedDownloads?.map((download) => {
        if (download.exists && !download.forbidden) {
          return (
            <DownloadCardArea
              area={getGridArea(
                download.type,
                presentationExists,
                worksheetsLength,
              )}
              key={download.type}
            >
              <Controller
                control={control}
                name="resources"
                defaultValue={[]}
                render={({
                  field: { value: fieldValue, onChange, name, onBlur },
                }) => {
                  const onChangeHandler = (
                    e: ChangeEvent<HTMLInputElement>,
                  ) => {
                    if (e.target.checked) {
                      onChange([...fieldValue, download.type]);
                    } else {
                      onChange(
                        fieldValue.filter(
                          (val: DownloadResourceType | string) =>
                            val !== download.type,
                        ),
                      );
                    }
                    // Trigger the form to reevaluate errors
                    triggerForm();
                  };
                  return (
                    <ResourceCard
                      id={download.type}
                      name={name}
                      label={download.label}
                      subtitle={download.ext.toUpperCase()}
                      resourceType={download.type}
                      onChange={onChangeHandler}
                      checked={fieldValue.includes(download.type)}
                      onBlur={onBlur}
                      hasError={hasError}
                      data-testid={`download-card-${download.type}`}
                    />
                  );
                }}
              />
            </DownloadCardArea>
          );
        }
      })}
    </OakGrid>
  );
};

export default DownloadCardGroup;
