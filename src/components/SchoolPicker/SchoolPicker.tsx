import { FC } from "react";
import { Item } from "react-stately";

import SearchAutocomplete from "../SearchAutocomplete/SearchAutocomplete";

type SchoolPickerProps = {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  schools: School[];
  defaultSchools?: School[];
  label: string;
};

export type School = {
  name: string;
  urn: string;
  la: string;
};

const SchoolPicker: FC<SchoolPickerProps> = (props) => {
  return (
    <SearchAutocomplete
      label={props.label}
      items={props.schools || []}
      inputValue={props.inputValue}
      onInputChange={props.setInputValue}
      defaultItems={props.defaultSchools}
    >
      {(item) => (
        <Item
          key={`${item.urn}-${item.name}`}
        >{`${item.name}, ${item.la}`}</Item>
      )}
    </SearchAutocomplete>
  );
};

export default SchoolPicker;
