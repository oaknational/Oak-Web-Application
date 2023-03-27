import React, { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";

import { TeachersKeyStageSubjectUnitsLessonsDownloadsData } from "../../../node-lib/curriculum-api";
import type {
  DownloadResourceType,
  DownloadFormProps,
} from "../downloads.types";
import { GridArea } from "../../Grid";
import Flex from "../../Flex";
import { Heading, Hr } from "../../Typography";
import Box from "../../Box";
import Button from "../../Button";
import FieldError from "../../FormFields/FieldError";

import DownloadCard from "./DownloadCard";

type DownloadCardGroupProps = {
  downloads?: TeachersKeyStageSubjectUnitsLessonsDownloadsData["downloads"];
  control: Control<DownloadFormProps>;
  hasError?: boolean;
  errorMessage?: string;
  onSelectAllClick: () => void;
  onDeselectAllClick: () => void;
};

const DownloadCardGroup: FC<DownloadCardGroupProps> = ({
  downloads,
  control,
  hasError = false,
  errorMessage,
  onSelectAllClick,
  onDeselectAllClick,
}) => {
  return (
    <>
      <GridArea $colSpan={[12]}>
        <Flex
          $alignItems={["left", "center"]}
          $flexDirection={["column", "row"]}
        >
          <Heading tag="h2" $font={"heading-5"} $mb={[16, 8]}>
            Lesson resources
          </Heading>
          <Box $ml={[0, 48]}>
            <Button
              label="Select all"
              variant="minimal"
              onClick={() => onSelectAllClick()}
            />
            <Button
              label="Deselect all"
              variant="minimal"
              onClick={() => onDeselectAllClick()}
              $ml={24}
            />
          </Box>
        </Flex>
        <FieldError id={"downloads-error"}>{errorMessage}</FieldError>
        <Hr $color={"oakGrey3"} $mt={0} $mb={48} />
      </GridArea>
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
