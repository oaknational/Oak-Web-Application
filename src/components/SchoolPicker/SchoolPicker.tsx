import { FC } from "react";
import { Item } from "react-stately";

import SearchComboBox from "../SearchComboBox/SearchComboBox";

import { UseSchoolPickerReturnProps } from "./useSchoolPicker";

type SchoolPickerProps = Omit<
  UseSchoolPickerReturnProps,
  "data" | "error" | "selectedValue"
> & {
  schools: School[];
  defaultSchools?: School[];
  label: string;
  error: boolean;
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
      error={props.error}
      label={props.label}
      inputValue={props.inputValue}
      onInputChange={props.setInputValue}
      defaultItems={props.schools || []}
      onSelectionChange={(value) => props.setSelectedValue(value)}
    >
      {(item) => (
        <Item
          key={`${item.urn}-${item.name}`}
        >{`${item.name}, ${item.la}, ${item.postcode}`}</Item>
      )}
    </SearchComboBox>
  );
};

export default SchoolPicker;
