import React, { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";

import { TeachersKeyStageSubjectUnitsLessonsDownloadsData } from "../../../node-lib/curriculum-api";
import { GridArea } from "../../Grid";
import { DownloadResourceType } from "../downloads.types";
import type { DownloadFormProps } from "../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads";

import DownloadCard from "./DownloadCard";

type DownloadCardGroupProps = {
  downloads?: TeachersKeyStageSubjectUnitsLessonsDownloadsData["downloads"];
  control: Control<DownloadFormProps>;
  hasError?: boolean;
};

const DownloadCardGroup: FC<DownloadCardGroupProps> = ({
  downloads,
  control,
  hasError = false,
}) => {
  return (
    <>
      {downloads?.map((download) => {
        if (download.exists && !download.forbidden) {
          return (
            <GridArea
              $colSpan={[6, 3, 2]}
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
                    e: ChangeEvent<HTMLInputElement>
                  ) => {
                    if (e.target.checked) {
                      onChange([...fieldValue, download.type]);
                    } else {
                      onChange(
                        fieldValue.filter(
                          (val: DownloadResourceType) => val !== download.type
                        )
                      );
                    }
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
            </GridArea>
          );
        }
      })}
    </>
  );
};

export default DownloadCardGroup;
