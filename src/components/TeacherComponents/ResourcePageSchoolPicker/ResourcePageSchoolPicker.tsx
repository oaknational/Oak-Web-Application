import { FC, useState } from "react";
import { Item } from "react-stately";

import { formatSchoolName } from "./formatSchoolName";
import { HOMESCHOOL_URN, UseSchoolPickerReturnProps } from "./useSchoolPicker";

import ResourcePageSearchComboBox from "@/components/TeacherComponents/ResourcePageSearchComboBox";

type ResourcePageSchoolPickerProps = Omit<
  UseSchoolPickerReturnProps,
  "data" | "error" | "selectedSchool"
> & {
  schools: School[];
  defaultSchools?: School[];
  label: string;
  hasError: boolean;
  required?: boolean;
  errorId?: string;
  withHomeschool: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export type School = {
  name: string;
  urn: string;
  la: string;
  postcode: string;
};

const schoolKey = (school: School) =>
  school.urn === HOMESCHOOL_URN ? school.urn : `${school.urn}-${school.name}`;

/**
 * A React aria combo box component school picker
 * use useSchoolPicker hook to fetch data and control input.
 *
 * ## Hook
 * const { inputValue, setInputValue, data } = useSchoolPicker();
 *
 * ## Usage
 * Used on downloads page
 */

const ResourcePageSchoolPicker: FC<ResourcePageSchoolPickerProps> = (props) => {
  const [selectedSchool, setSelectedSchool] = useState<School>();
  const schools =
    selectedSchool &&
    props.schoolPickerInputValue &&
    !props.schools.some(
      (school) => schoolKey(school) === schoolKey(selectedSchool),
    )
      ? [...props.schools, selectedSchool]
      : props.schools;

  return (
    <ResourcePageSearchComboBox
      isDisabled={props.disabled}
      errorId={props.errorId}
      hasError={props.hasError}
      label={props.label}
      inputValue={props.schoolPickerInputValue}
      onInputChange={props.setSchoolPickerInputValue}
      defaultItems={schools}
      onSelectionChange={(value) => {
        setSelectedSchool(
          schools.find((school) => schoolKey(school) === value),
        );
        if (value !== null) {
          props.setSelectedSchool(value);
        }
      }}
      required={props.required}
      withHomeschool={props.withHomeschool}
      placeholder={props.placeholder}
    >
      {(item) => {
        const formattedSchool = formatSchoolName(
          `${item.name}, ${item.la}, ${item.postcode}`,
          props.schoolPickerInputValue,
        );
        const formattedHomeSchool = formatSchoolName(
          item.name,
          props.schoolPickerInputValue,
        );
        const comboItem =
          item.urn === HOMESCHOOL_URN ? formattedHomeSchool : formattedSchool;
        const textValue =
          item.urn === HOMESCHOOL_URN
            ? item.name
            : `${item.name}, ${item.la}, ${item.postcode}`;

        return (
          <Item key={schoolKey(item)} textValue={String(textValue)}>
            {comboItem}
          </Item>
        );
      }}
    </ResourcePageSearchComboBox>
  );
};

export default ResourcePageSchoolPicker;
