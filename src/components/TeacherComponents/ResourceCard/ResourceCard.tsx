import { FC } from "react";
import { OakResourceCard } from "@oaknational/oak-components";
import styled from "styled-components";

import type { DownloadResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { getDownloadCardFieldErrorAriaProps } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/shareDownloadFormErrorIds";
import { CheckboxProps } from "@/components/SharedComponents/Checkbox/Checkbox";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { getLessonDownloadMetadata } from "@/common-lib/lessonDownloads";

const CustomSizing = styled("div")<{
  $checked?: boolean;
  $useDownloadPageLayout?: boolean;
}>`
  display: grid;
  width: ${(props) => (props.$useDownloadPageLayout ? "100%" : "320px")};
  input {
    border: ${(props) => (props.$checked ? "0" : "default")};
  }

  @media (min-width: 1280px) {
    width: ${(props) => (props.$useDownloadPageLayout ? "300px" : "320px")};
  }
`;

export type ResourceCardProps = Omit<CheckboxProps, "checked"> & {
  label: string;
  resourceType: DownloadResourceType;
  subtitle: string;
  subjectIcon?: string;
  isEditable?: boolean;
  useDownloadPageLayout: boolean;
  asRadio?: boolean;
  checked?: boolean;
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
    useDownloadPageLayout = false,
    hasError = false,
  } = props;

  const isCurriculumIcon = resourceType === "curriculum-pdf";
  const iconName =
    isCurriculumIcon && subjectIcon
      ? getValidSubjectIconName(subjectIcon)
      : getLessonDownloadMetadata(resourceType).icon;

  return (
    <CustomSizing
      $checked={checked}
      $useDownloadPageLayout={useDownloadPageLayout}
    >
      <OakResourceCard
        id={id}
        data-testid="resourceCard"
        value={id}
        name={name}
        title={label}
        {...getDownloadCardFieldErrorAriaProps(hasError)}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        isRadio={asRadio}
        description={subtitle}
        isEditable={isEditable}
        iconName={iconName}
      />
    </CustomSizing>
  );
};

export default ResourceCard;
