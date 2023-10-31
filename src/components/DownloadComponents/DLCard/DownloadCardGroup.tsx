import React, { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";
import styled from "styled-components";

import type {
  DownloadResourceType,
  DownloadFormProps,
} from "../downloads.types";
import DownloadCard from "../DLCard";

import { LessonDownloadsData } from "@/node-lib/curriculum-api";
import Box from "@/components/Box";
import { getBreakpoint } from "@/styles/utils/responsive";

export type DownloadCardGroupProps = {
  downloads?: LessonDownloadsData["downloads"];
  control: Control<DownloadFormProps>;
  hasError?: boolean;
  triggerForm: () => void;
};

const DownloadCardGrid = styled(Box)`
  display: grid;
  position: relative;
  gap: 16px;
  grid-template-columns: "max-content max-content";
  grid-template-areas: "presentation . " "worksheet-pptx worksheet-pdf" "intro-quiz-questions intro-quiz-answers" "exit-quiz-questions exit-quiz-answers" "supplementary-pdf supplementary-docx";
  @media (max-width: ${getBreakpoint("small")}px) {
    grid-template-columns: "1fr";
    grid-template-areas: "presentation" "worksheet-pptx" "worksheet-pdf" "intro-quiz-questions" "intro-quiz-answers" "exit-quiz-questions" "exit-quiz-answers" "supplementary-pdf" "supplementary-docx";
  }
`;

const DownloadCardArea = styled(Box)<{ area: string }>`
  grid-area: ${(props) => props.area};
`;

const DownloadCardGroup: FC<DownloadCardGroupProps> = ({
  downloads,
  control,
  hasError = false,
  triggerForm,
}) => {
  return (
    <DownloadCardGrid>
      {downloads?.map((download) => {
        if (download.exists && !download.forbidden) {
          return (
            <DownloadCardArea
              area={download.type}
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
                    <DownloadCard
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
    </DownloadCardGrid>
  );
};

export default DownloadCardGroup;
