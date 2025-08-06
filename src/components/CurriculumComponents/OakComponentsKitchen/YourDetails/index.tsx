import {
  OakCheckBox,
  OakFlex,
  OakLink,
  OakP,
} from "@oaknational/oak-components";
import { ComponentProps, useMemo } from "react";

import Autocomplete, { AutocompleteItem } from "../Autocomplete";

import { resolveOakHref } from "@/common-lib/urls";
import { formatSchoolName } from "@/components/TeacherComponents/ResourcePageSchoolPicker/formatSchoolName";
import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";

/*
 * Waiting for the following components to be in oak-components
 *
 *  - <Autocomplete />
 *  - <ListBox />
 */

export type School = {
  name: string;
  urn: string;
  la: string;
  postcode: string;
};

const Link = (props: ComponentProps<typeof OakLink>) => {
  const isExternal = props.rel === "external";
  const additionalProps = isExternal
    ? ({
        target: "_blank",
      } as const)
    : {};
  return (
    <OakLink {...props} {...additionalProps} style={{ display: "inline" }}>
      {props.children}
    </OakLink>
  );
};

export function parseSchoolToListItems(schools: School[]) {
  return schools.map((item) => {
    const comboItemKey = `${item.urn}-${item.name}`;
    const textValue = `${item.name}, ${item.la}, ${item.postcode}`;

    return {
      key: comboItemKey,
      textValue: String(textValue),
    };
  });
}

const useSchoolsFromApi = ({
  schools,
}: {
  schools: School[];
}): {
  key: string;
  textValue: string;
}[] => {
  return useMemo(() => {
    return [
      ...parseSchoolToListItems(schools),
      { textValue: "Homeschool", key: "homeschool" },
    ];
  }, [schools]);
};

const injectCurrentSchool = (
  data: { schoolId?: string; schoolName?: string },
  schools: { key: string; textValue: string }[],
) => {
  const found = !!schools.find((school) => {
    return school.key === data.schoolId;
  });

  if (!found && data.schoolId && data.schoolName) {
    return [
      ...schools,
      {
        key: data.schoolId,
        textValue: data.schoolName,
      },
    ];
  }
  return schools;
};

type YourDetailsProps = {
  data: {
    schoolId?: string;
    schoolName?: string;
    schoolNotListed?: boolean;
    email?: string;
  };
  errors: {
    schoolId?: string;
    email?: string;
  };
  onChange: (
    newData: Partial<{
      schoolId: string;
      schoolName: string;
      schoolNotListed: boolean;
      email: string;
    }>,
  ) => void;
  schools: School[];
};
export default function YourDetails({
  schools,
  data,
  errors,
  onChange,
}: YourDetailsProps) {
  const schoolsAsAutocompleteItems = useSchoolsFromApi({ schools });
  const autoCompleteList = injectCurrentSchool(
    data,
    schoolsAsAutocompleteItems,
  );

  return (
    <>
      <OakFlex
        $width={"100%"}
        $flexDirection={"column"}
        $alignItems={"start"}
        $gap={"space-between-xs"}
      >
        <Autocomplete
          isControlled={true}
          data-testid="school"
          inputProps={{
            label: "School (required)",
            id: "download-school",
            error: errors.schoolId,
            placeholder: "Type school name, postcode, or ‘homeschool’",
          }}
          onChange={(value, textValue) => {
            onChange({
              schoolId: value,
              schoolName: textValue,
              schoolNotListed: false,
            });
          }}
          onInputChange={(value) => {
            onChange({
              schoolName: value,
              schoolId: undefined,
            });
          }}
          value={data.schoolName}
        >
          {autoCompleteList.map(({ key, textValue }) => {
            const element = formatSchoolName(textValue, data.schoolName);
            return (
              <AutocompleteItem key={key} textValue={textValue}>
                {element}
              </AutocompleteItem>
            );
          })}
        </Autocomplete>
        <OakCheckBox
          displayValue={"My school isn't listed"}
          checked={data.schoolNotListed}
          onChange={(e) =>
            onChange({
              schoolNotListed: e.target.checked,
              schoolId: undefined,
              schoolName: undefined,
            })
          }
          value="download-school-isnt-listed"
          id="download-school-isnt-listed"
          data-testid="download-school-isnt-listed"
          name={"school-isnt-listed"}
        />
      </OakFlex>

      <OakFlex
        $width={"100%"}
        $flexDirection={"column"}
        $alignItems={"start"}
        $gap={"space-between-xs"}
      >
        <OakInputWithLabel
          label="Email (optional)"
          id="download-email"
          data-testid="download-email"
          error={errors.email}
          onChange={(e) => onChange({ email: e.target.value })}
          required={false}
          placeholder="Type your email address"
          name="download-email"
          defaultValue={data.email}
        />

        <OakP $font={["body-3"]}>
          Join over 100k teachers and get free resources and other helpful
          content by email. Unsubscribe at any time. Read our{" "}
          <Link
            href={resolveOakHref({
              page: "legal",
              legalSlug: "privacy",
            })}
          >
            privacy policy
          </Link>
          .
        </OakP>
      </OakFlex>
    </>
  );
}
