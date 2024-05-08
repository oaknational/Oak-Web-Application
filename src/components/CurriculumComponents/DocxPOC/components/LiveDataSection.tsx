import { useState } from "react";
import {
  OakFlex,
  OakHeading,
  OakLink,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import FileSelect from "@/components/CurriculumComponents/DocxPOC/components/FileSelect";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Box from "@/components/SharedComponents/Box";

export default function LiveDataSection({
  pageTitle,
  onClick,
}: {
  pageTitle: string;
  onClick: (file: File) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleGenerateClick = () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    onClick(file);
  };

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
        <OakP $mb="space-between-l">
          Docx primary template file can be found{" "}
          <OakLink
            href="https://www.notion.so/oaknationalacademy/Curriculum-Downloads-Engineering-Spike-CUR-422-5edfb7d91b1c40a292a29b1d6cc4366a?pvs=4#41485cbadd5b4782969d1151d4903851"
            target="_blank"
          >
            here
          </OakLink>
        </OakP>
        <Box $maxWidth={960} $mb={40}>
          <OakFlex $alignItems={"center"} $mb="space-between-m">
            <FileSelect
              label="Choose docx template"
              onChange={(file) => {
                setFile(file);
              }}
            />
            <Box $ml={20}>{file?.name}</Box>
          </OakFlex>
          <OakPrimaryButton
            onClick={handleGenerateClick}
            iconName="download"
            disabled={file === null}
          >
            Generate Document
          </OakPrimaryButton>
        </Box>
      </MaxWidth>
    </OakFlex>
  );
}
