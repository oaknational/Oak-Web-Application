import { FC } from "react";
import {
  OakIconName,
  OakTagFunctional,
  OakDownloadCard,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { CheckboxProps } from "@/components/SharedComponents/Checkbox/Checkbox";
import { LessonShareResourceData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

export const CustomSizing = styled("div")<{
  checked?: boolean;
  useDownloadPageLayout?: boolean;
}>`
  input {
    border: ${(props) => (props.checked ? "0" : "default")};
  }
`;

export type ResourceCardProps = Omit<CheckboxProps, "checked"> & {
  label: string;
  resourceType: LessonShareResourceData["type"];
  subtitle: string;
  subjectIcon?: string;
  isEditable?: boolean;
  useDownloadPageLayout: boolean;
  asRadio?: boolean;
  checked?: boolean;
};

const RESOURCE_TYPE_ICON_MAP: Record<
  LessonShareResourceData["type"],
  OakIconName
> = {
  "starter-quiz": "quiz",
  "exit-quiz": "quiz",
  video: "video",
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
  } = props;

  const iconName = subjectIcon
    ? getValidSubjectIconName(subjectIcon)
    : RESOURCE_TYPE_ICON_MAP[resourceType];

  return (
    <CustomSizing
      checked={checked}
      useDownloadPageLayout={useDownloadPageLayout}
    >
      <OakDownloadCard
        id={id}
        data-testid="resourceCard"
        value={id}
        name={name}
        title={label}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        isRadio={asRadio}
        format={
          <>
            {subtitle}
            {isEditable && (
              <OakTagFunctional
                key="tag"
                $ml={"spacing-8"}
                $display="inline"
                $color={"text-primary"}
                $font={"heading-light-7"}
                $ph={"spacing-4"}
                $pv={"spacing-4"}
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
