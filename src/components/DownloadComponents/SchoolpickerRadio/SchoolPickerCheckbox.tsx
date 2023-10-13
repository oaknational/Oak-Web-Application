import React, { FC, useEffect, useState } from "react";
import { FieldErrorsImpl } from "react-hook-form";

import Flex from "@/components/Flex";
import SchoolPicker from "@/components/SchoolPicker";
import useSchoolPicker from "@/components/SchoolPicker/useSchoolPicker";
import { Heading } from "@/components/Typography";
import Checkbox from "@/components/Checkbox";

export type SchoolPickerCheckboxProps = {
  setSchool: (value: string, name?: string) => void;
  initialValue?: string;
  initialSchoolName?: string;
  errors?: Partial<
    FieldErrorsImpl<{
      school: string;
    }>
  >;
};

const SchoolPickerCheckbox: FC<SchoolPickerCheckboxProps> = ({
  setSchool,
  initialValue,
  initialSchoolName,
  errors,
}) => {
  const [checkboxValue, setCheckboxValue] = useState(
    initialValue === "notListed" ? true : false,
  );
  const {
    selectedSchool,
    setSelectedSchool,
    schoolPickerInputValue,
    setSchoolPickerInputValue,
    schools,
  } = useSchoolPicker();

  // initial values
  useEffect(() => {
    if (initialValue) {
      if (initialValue === "notListed") {
        setCheckboxValue(true);
        setSchool(initialValue);
        setSchoolPickerInputValue("");
      } else {
        setCheckboxValue(false);
        setSchool(initialValue);
        if (initialSchoolName) {
          setSchoolPickerInputValue(initialSchoolName);
        }
      }
    }
  }, [initialValue, setSchool, setSchoolPickerInputValue, initialSchoolName]);

  useEffect(() => {
    if (selectedSchool && schoolPickerInputValue !== "") {
      setSchool(selectedSchool.toString(), schoolPickerInputValue);
    }
  }, [selectedSchool, setSchool, schoolPickerInputValue]);

  const onCheckboxChange = () => {
    setCheckboxValue(!checkboxValue);
    setSelectedSchool("");
    setSchool(checkboxValue ? "" : "notListed");
    setSchoolPickerInputValue("");
  };

  const onSchoolPickerInputChange = (value: React.SetStateAction<string>) => {
    if (value === "" && !value) {
      setSchool("");
    }
    setCheckboxValue(false);
    setSchoolPickerInputValue(value);
  };
  return (
    <>
      <Heading tag="h2" $font={"heading-5"} $mb={16}>
        Your details
      </Heading>
      <Heading tag="h3" $font={"heading-7"} $mt={0} $mb={24}>
        Find your school in the field below (required)
      </Heading>
      <SchoolPicker
        hasError={errors?.school !== undefined}
        schoolPickerInputValue={schoolPickerInputValue}
        setSchoolPickerInputValue={onSchoolPickerInputChange}
        schools={schools}
        label={"Name of school"}
        setSelectedSchool={setSelectedSchool}
        required={true}
      />
      <Flex $mt={12} $mb={32}>
        <Checkbox
          checked={checkboxValue}
          onChange={onCheckboxChange}
          aria-label={"my school isn't listed"}
          id={`checkbox-not-listed`}
          name={"checkbox-not-listed"}
          labelText={"My school isn't listed"}
          data-testid={"checkbox-download"}
        />
        <p>{checkboxValue}</p>
      </Flex>
    </>
  );
};

export default SchoolPickerCheckbox;
