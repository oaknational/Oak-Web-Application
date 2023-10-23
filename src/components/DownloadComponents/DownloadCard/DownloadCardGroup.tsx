import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";

import type {
  DownloadResourceType,
  DownloadFormProps,
} from "../downloads.types";

import DownloadCard from "./DownloadCard";

import { LessonDownloadsData } from "@/node-lib/curriculum-api";
import { GridArea } from "@/components/Grid";
import Flex from "@/components/Flex";
import { Heading } from "@/components/Typography";
import FieldError from "@/components/FormFields/FieldError";
import Checkbox from "@/components/Checkbox";
import Box from "@/components/Box";

type DownloadCardGroupProps = {
  downloads?: LessonDownloadsData["downloads"];
  control: Control<DownloadFormProps>;
  hasError?: boolean;
  errorMessage?: string;
  onSelectAllClick: () => void;
  onDeselectAllClick: () => void;
  preselectAll: boolean;
};

const DownloadCardGroup: FC<DownloadCardGroupProps> = ({
  downloads,
  control,
  hasError = false,
  errorMessage,
  onSelectAllClick,
  onDeselectAllClick,
  preselectAll,
}) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    if (preselectAll) {
      setSelectAllChecked(true);
    }
  }, [preselectAll]);

  const handleToggleSelectAll = () => {
    if (selectAllChecked) {
      onDeselectAllClick();
      setSelectAllChecked(false);
    } else {
      onSelectAllClick();
      setSelectAllChecked(true);
    }
  };

  return (
    <>
      <GridArea $colSpan={[12]}>
        <Flex
          $alignItems={"flex-start"}
          $flexDirection={"column"}
          $mb={28}
          $gap={24}
        >
          <Heading tag="h2" $font={"heading-5"} $mb={[16, 8]}>
            Lesson resources
          </Heading>
          <Box $maxWidth="max-content">
            <Checkbox
              checked={selectAllChecked}
              onChange={handleToggleSelectAll}
              id="select-all"
              name="select-all"
              variant="withLabel"
              labelText="Select all"
              labelFontWeight={600}
            />
          </Box>
        </Flex>
        <FieldError id={"downloads-error"}>{errorMessage}</FieldError>
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
