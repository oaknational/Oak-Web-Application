import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import {
  OakFieldset,
  OakFlex,
  OakHeading,
  OakIcon,
  OakIconName,
  OakP,
  OakRadioButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { kebabCase } from "lodash";

import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";

export type LessonShareRadioGroupProps = {
  control: Control<ResourceFormValues>;
  name: keyof ResourceFormValues;
  title: string;
  description: string;
  icon: OakIconName;
  options: {
    value: ResourceFormValues[keyof ResourceFormValues];
    label: string;
  }[];
  defaultValue?: string;
};
const LessonShareRadioGroup: FC<LessonShareRadioGroupProps> = (props) => {
  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-24"} $mb={"spacing-32"}>
      <OakFlex $gap={"spacing-16"} $alignItems={"center"}>
        <OakFlex
          $background={"bg-btn-secondary"}
          $borderRadius={"border-radius-circle"}
          $width={"spacing-48"}
          $height={"spacing-48"}
          $pa={"spacing-2"}
          $alignItems={"center"}
          $justifyContent={"center"}
        >
          <OakIcon iconName={props.icon} />
        </OakFlex>
        <OakHeading tag="h2" $font={"heading-6"} id={kebabCase(props.title)}>
          {props.title}
        </OakHeading>
      </OakFlex>
      <OakP $font={"body-2"}>{props.description}</OakP>
      <OakFieldset aria-labelledby={kebabCase(props.title)}>
        <Controller
          control={props.control}
          name={props.name}
          defaultValue={props.defaultValue ?? props.options?.[0]?.value}
          render={({ field: { value: fieldValue, onChange, name } }) => {
            return (
              <OakRadioGroup
                name={name}
                aria-label={props.title}
                onChange={onChange}
                value={fieldValue?.toString()}
              >
                {props.options.map((option) => (
                  <OakRadioButton
                    key={option.value?.toString() ?? kebabCase(option.label)}
                    id={option.value?.toString() ?? kebabCase(option.label)}
                    label={option.label}
                    value={option.value?.toString() ?? ""}
                  />
                ))}
              </OakRadioGroup>
            );
          }}
        />
      </OakFieldset>
    </OakFlex>
  );
};

export default LessonShareRadioGroup;
