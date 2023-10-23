import { FC } from "react";
import { Item } from "react-stately";

import SearchComboBox from "../SearchComboBox/SearchComboBox";
import { formatSchoolName } from "../formatSchoolName";

import { HOMESCHOOL_URN, UseSchoolPickerReturnProps } from "./useSchoolPicker";

type SchoolPickerProps = Omit<
  UseSchoolPickerReturnProps,
  "data" | "error" | "selectedSchool"
> & {
  schools: School[];
  defaultSchools?: School[];
  label: string;
  hasError: boolean;
  required?: boolean;
};

export type School = {
  name: string;
  urn: string;
  la: string;
  postcode: string;
};

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

const SchoolPicker: FC<SchoolPickerProps> = (props) => {
  return (
    <SearchComboBox
      hasError={props.hasError}
      label={props.label}
      inputValue={props.schoolPickerInputValue}
      onInputChange={props.setSchoolPickerInputValue}
      defaultItems={props.schools || []}
      onSelectionChange={(value) => props.setSelectedSchool(value)}
      required={props.required}
    >
      {(item) => {
        const formattedSchool = formatSchoolName(
          `${item.name}, ${item.la}, ${item.postcode}`,
          props.schoolPickerInputValue,
        );
        const comboItemKey =
          item.urn === HOMESCHOOL_URN ? item.urn : `${item.urn}-${item.name}`;
        const comboItem =
          item.urn === HOMESCHOOL_URN ? item.name : formattedSchool;
        const textValue =
          item.urn === HOMESCHOOL_URN
            ? item.name
            : `${item.name}, ${item.la}, ${item.postcode}`;

        return (
          <Item key={comboItemKey} textValue={String(textValue)}>
            {comboItem}
          </Item>
        );
      }}
    </SearchComboBox>
  );
};

export default SchoolPicker;
