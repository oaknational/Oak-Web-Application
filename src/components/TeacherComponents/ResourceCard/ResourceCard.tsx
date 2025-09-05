import { FC } from "react";
import {
  OakIconName,
  OakTagFunctional,
  OakDownloadCard,
} from "@oaknational/oak-components";
import styled from "styled-components";

import type { DownloadResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { CheckboxProps } from "@/components/SharedComponents/Checkbox/Checkbox";
import { LessonShareResourceData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

const CustomSizing = styled("div")`
  display: grid;
  width: 320px;
  input {
    border: 0px;
  }
`;

export type ResourceCardProps = Omit<CheckboxProps, "checked"> & {
  label: string;
  resourceType: DownloadResourceType | LessonShareResourceData["type"];
  subtitle: string;
  hasError?: boolean;
  subjectIcon?: string;
  isEditable?: boolean;
  useDownloadsExperiment?: boolean;
  asRadio?: boolean;
  checked?: boolean;
};

const RESOURCE_TYPE_ICON_MAP: Record<
  DownloadResourceType | LessonShareResourceData["type"],
  OakIconName
> = {
  presentation: "slide-deck",
  "intro-quiz-questions": "quiz",
  "intro-quiz-answers": "quiz",
  "exit-quiz-questions": "quiz",
  "exit-quiz-answers": "quiz",
  "worksheet-pdf": "worksheet",
  "worksheet-pptx": "worksheet",
  "supplementary-pdf": "additional-material",
  "supplementary-docx": "additional-material",
  video: "video",
  "curriculum-pdf": "additional-material",
  "lesson-guide-pdf": "additional-material",
  "additional-files": "additional-material",
};

const ResourceCard: FC<ResourceCardProps> = (props) => {
  const {
    checked,
    onChange,
    id,
    name,
    label,
    subtitle,
    onBlur,
    resourceType,
    subjectIcon,
    isEditable,
    disabled,
    asRadio = false,
  } = props;

  const isCurriculumIcon = resourceType === "curriculum-pdf";
  const iconName =
    isCurriculumIcon && subjectIcon
      ? getValidSubjectIconName(subjectIcon)
      : RESOURCE_TYPE_ICON_MAP[resourceType];

  return (
    <CustomSizing>
      <OakDownloadCard
        id={id}
        data-testid="resourceCard"
        value={id}
        name={name}
        titleSlot={label}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        asRadio={asRadio}
        formatSlot={
          <>
            {subtitle}
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
        iconName={iconName}
      />
    </CustomSizing>
  );
};

export default ResourceCard;
