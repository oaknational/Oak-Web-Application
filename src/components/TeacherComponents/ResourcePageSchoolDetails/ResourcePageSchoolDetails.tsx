import React, { FC, useEffect, useState } from "react";
import { FieldErrorsImpl } from "react-hook-form";
import { OakBox, OakFlex } from "@oaknational/oak-components";

import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import Checkbox from "@/components/SharedComponents/Checkbox";

export type ResourcePageSchoolDetailsProps = {
  setSchool: (value: string, name?: string) => void;
  initialValue?: string;
  initialSchoolName?: string;
  errors?: Partial<
    FieldErrorsImpl<{
      school: string;
    }>
  >;
};

const ResourcePageSchoolDetails: FC<ResourcePageSchoolDetailsProps> = ({
  setSchool,
  initialValue,
  initialSchoolName,
  errors,
}) => {
  const [checkboxValue, setCheckboxValue] = useState(
    initialValue === "notListed",
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
    if (value === "" && !checkboxValue) {
      setSchool("");
    }
    setCheckboxValue(false);
    setSchoolPickerInputValue(value);
  };
  return (
    <OakBox $pa={"inner-padding-none"} $ba={"border-solid-none"} as="fieldset">
      <OakBox
        as="legend"
        $position="absolute"
        $width="all-spacing-0"
        $height="all-spacing-0"
        $pa={"inner-padding-none"}
        $overflow="hidden"
      >
        School details
      </OakBox>
      <ResourcePageSchoolPicker
        hasError={errors?.school !== undefined}
        schoolPickerInputValue={schoolPickerInputValue}
        setSchoolPickerInputValue={onSchoolPickerInputChange}
        schools={schools}
        label={"School"}
        setSelectedSchool={setSelectedSchool}
        required={true}
      />
      <OakFlex $mt="space-between-xs" $mb="space-between-m2">
        <Checkbox
          checked={checkboxValue}
          onChange={onCheckboxChange}
          // aria-label={"my school isn't listed"}
          id={`checkbox-not-listed`}
          name={"checkbox-not-listed"}
          zIndex={"neutral"}
          labelText={"My school isn't listed"}
          data-testid={"checkbox-download"}
        />
      </OakFlex>
    </OakBox>
  );
};

export default ResourcePageSchoolDetails;
