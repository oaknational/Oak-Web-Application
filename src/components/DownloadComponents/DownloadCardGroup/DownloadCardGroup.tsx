import React, { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";
import styled from "styled-components";

import type {
  DownloadResourceType,
  DownloadFormProps,
} from "../downloads.types";
import ResourceCard from "../ResourceCard";

import { LessonDownloadsData } from "@/node-lib/curriculum-api";
import Box from "@/components/Box";
import Grid from "@/components/Grid";

export type DownloadCardGroupProps = {
  downloads?: LessonDownloadsData["downloads"];
  control: Control<DownloadFormProps>;
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
  if (type !== "worksheet-pdf" && type !== "worksheet-pptx") {
    return type;
  } else if (worksheetsLength === 2 || !presentationExists) {
    return type;
  } else {
    return "presentationOrWorksheet";
  }
};

const sortOrderKey = {
  presentation: 1,
  "worksheet-pdf": 2,
  "worksheet-pptx": 3,
  "intro-quiz-questions": 4,
  "intro-quiz-answers": 5,
  "exit-quiz-questions": 6,
  "exit-quiz-answers": 7,
  "supplementary-pdf": 8,
  "supplementary-docx": 9,
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

  // Sort the downloads in display order so tabbing order is correct
  const sortedDownloads = downloads?.sort((a, b) => {
    const aSortOrder = sortOrderKey[a.type];
    const bSortOrder = sortOrderKey[b.type];
    return aSortOrder - bSortOrder;
  });

  return (
    <Grid
      $position="relative"
      $width="max-content"
      $gridTemplateColumns={["1fr", "max-content max-content"]}
      $cg={16}
      $gridTemplateAreas={[
        '"presentation" "presentationOrWorksheet" "worksheet-pdf" "worksheet-pptx" "intro-quiz-questions" "intro-quiz-answers" "exit-quiz-questions" "exit-quiz-answers" "supplementary-pdf" "supplementary-docx"',
        '"presentation presentationOrWorksheet" "worksheet-pdf worksheet-pptx" "intro-quiz-questions intro-quiz-answers" "exit-quiz-questions exit-quiz-answers" "supplementary-pdf supplementary-docx"',
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
              data-testid={"lessonResourcesToDownload"}
            >
              <Controller
                control={control}
                name="downloads"
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
                      extension={download.ext}
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
    </Grid>
  );
};

export default DownloadCardGroup;
