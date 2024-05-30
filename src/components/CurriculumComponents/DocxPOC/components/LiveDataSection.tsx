import {
  OakFlex,
  OakHeading,
  OakLink,
  OakP,
  OakPrimaryButton,
  OakFieldError,
} from "@oaknational/oak-components";

import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Box from "@/components/SharedComponents/Box";
import { Item, Select } from "@/components/GenericPagesComponents/Select";
import { Label } from "@/components/SharedComponents/ListBox/ListBox";

export default function LiveDataSection({
  pageTitle,
  dataWarnings,
  onSubmit,
  state,
  onChangeState,
}: {
  pageTitle: string;
  dataWarnings: string[] | null;
  onSubmit: () => void;
  state: string;
  onChangeState: (newState: string) => void;
}) {
  return (
    <OakFlex $justifyContent={"center"} $background={"mint"}>
      <MaxWidth $ph={16}>
        <OakHeading
          tag="h1"
          $font={"heading-2"}
          $mt="space-between-l"
          $mb="space-between-s"
        >
          {pageTitle}
        </OakHeading>
        {dataWarnings?.map((warning, index) => (
          <OakFieldError key={index}>{warning}</OakFieldError>
        ))}
        <OakP $mb="space-between-l">
          Docx primary template file can be found{" "}
          <OakLink
            href="https://www.notion.so/oaknationalacademy/Curriculum-Downloads-Engineering-Spike-CUR-422-5edfb7d91b1c40a292a29b1d6cc4366a?pvs=4#25d60b57c87343cdb6591ba9eecdc03c"
            target="_blank"
          >
            here
          </OakLink>
        </OakP>
        <Box $maxWidth={960} $mb={40}>
          <OakFlex
            $alignItems={"left"}
            $mb="space-between-m"
            $gap={"space-between-m"}
            $flexDirection={"column"}
          >
            <Select
              name="state"
              label="Published state"
              items={[
                { label: "New", value: "new" },
                { label: "Published", value: "published" },
              ]}
              selectedValue={state}
              onSelectionChange={(key) => onChangeState(key as string)}
            >
              {(item) => (
                <Item
                  key={item.value}
                  textValue={item.label}
                  data-testid={"selectItem"}
                >
                  <div>
                    <Label>{item.label}</Label>
                  </div>
                </Item>
              )}
            </Select>
          </OakFlex>
          <OakPrimaryButton onClick={onSubmit} iconName="download">
            Generate Document
          </OakPrimaryButton>
        </Box>
      </MaxWidth>
    </OakFlex>
  );
}
