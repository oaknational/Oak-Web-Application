import React, { useState } from "react";
import { Dispatch, FC, SetStateAction } from "react";
import { Item } from "react-stately";
import ComboBox from "../ComboBox";

import DropdownSelect from "../DropdownSelect";
import { ComboSelect } from "../DropdownSelect/ComboSelect";
import Flex from "../Flex";

import useSchoolPicker from "./useSchoolPicker";

type SchoolPickerProps = {
  inputValued: string;
  setInputValue: Dispatch<SetStateAction<string>>;
};

const SchoolPicker: FC<SchoolPickerProps> = () => {
  const [inputValue, setInputValue] = useState("");
  console.log(inputValue);
  const { suggestions } = useSchoolPicker(inputValue);
  console.log(suggestions);
  // const suggestions = [
  //   { id: "1", name: "school" },
  //   { id: "2", name: "schoolsss" },
  // ];

  return (
    <>
      <ComboBox
        onInputChange={setInputValue}
        inputValue={inputValue}
        label="Favorite Animal"
        defaultItems={suggestions}
      >
        {suggestions.map((suggestion, index) => (
          <Item key={`${index}-${suggestion.name}`}>{suggestion.name}</Item>
        ))}
      </ComboBox>
    </>
  );
};

export default SchoolPicker;

// {/* <Flex>
//   <ComboBox label="Assignee" defaultItems={options}>
//     {(item) => (
//       <Item textValue={item.name}>
//         {/* <Avatar src={item.avatar} alt={item.name} /> */}
//         <div>
//           {/* <Label>{item.name}</Label>
//           <Description>{item.username}</Description> */}
//         </div>
//       </Item>
//     )}
//   </ComboBox>
//   <p>Selected topic id: {majorId}</p>
// </Flex> */}
