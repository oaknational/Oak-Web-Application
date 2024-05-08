import { MutableRefObject, useCallback, useRef, useState } from "react";
import {
  OakHeading,
  OakLink,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Input, {
  InputFieldWrap,
  RotatedInputLabel,
} from "@/components/SharedComponents/Input/Input";
import Box from "@/components/SharedComponents/Box";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

export interface POCFormData {
  subject: string;
  curriculum_explainer: string;
  principles: string;
  url: string;
  include_page_break: boolean;
  units: string;
  text_in_toc: string;
  link_to_new_table: string;
}

interface POCFormProps {
  onSubmit: (formData: POCFormData, file: File) => void;
  onGenerateDemoFile: (
    type: "unit_table",
    formData: POCFormData,
    file: File,
  ) => void;
}

export default function POCForm({
  onSubmit,
  onGenerateDemoFile,
}: POCFormProps) {
  const hiddenFileInputRef: MutableRefObject<null | HTMLInputElement> =
    useRef(null);

  const [docxTemplateName, setDocxTemplateName] = useState<string>("");

  const [formData, setFormData] = useState<POCFormData>({
    subject: "Maths",
    curriculum_explainer: `Our curriculum provides adaptable, coherently sequenced units to allow pupils to develop a deep, sustained understanding of mathematics at Key Stages 1 and 2. Evidence informed approaches including variation and the development of core sets of models and representations build pupil knowledge and conceptual understanding. Lessons are designed to be flexible, accessible and to acknowledge the diversity in our schools. Central to the design of our curriculum is coherence in the development of key threads in mathematics. These threads reflect the structure of the National Curriculum, allowing teachers to track the development of key knowledge and skills.`,
    principles: `Principle 1
Principle 2
Principle 3`,
    url: `https://www.google.com`,
    include_page_break: false,
    units: `Counting, recognising and comparing numbers 0 - 10
Counting to and from 20
Counting in tens - decade numbers
Pattern in counting from 20 to 100
Comparing quantities - part whole relationships`,
    text_in_toc: `N/A`,
    link_to_new_table: `New Units Table!`,
  });

  const handleDownloadClick = () => {
    if (!hiddenFileInputRef.current?.files?.[0]) {
      alert("Please add a docx template file ");
      return;
    }

    onSubmit(formData, hiddenFileInputRef.current?.files?.[0]);
  };

  const handleGenerateRepeatables = () => {
    if (!hiddenFileInputRef.current?.files?.[0]) {
      alert("Please add a docx template file ");
      return;
    }

    onGenerateDemoFile(
      "unit_table",
      formData,
      hiddenFileInputRef.current.files[0],
    );
  };

  const handleFileSelect = () => {
    hiddenFileInputRef.current?.click();
  };

  // Update the file name when a new file is selected
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target?.files?.[0]) {
      return;
    }
    setDocxTemplateName(event.target.files[0].name);
  };

  // Update the form data when an input changes
  const handleFormDataChange = useCallback(
    (name: keyof POCFormData, value: POCFormData[keyof POCFormData]) => {
      setFormData({
        ...formData,
        [name]: value,
      });
    },
    [formData],
  );

  return (
    <Flex $justifyContent={"center"} $background={"mint"}>
      <MaxWidth $ph={16}>
        <OakHeading
          tag="h1"
          $font={"heading-2"}
          $mt="space-between-l"
          $mb="space-between-s"
        >
          Curriculum downloads - DOCX POC
        </OakHeading>
        <OakP $mb="space-between-l">
          This proof of concept takes a docx template (
          <OakLink
            href="https://www.notion.so/oaknationalacademy/Curriculum-Downloads-Engineering-Spike-CUR-422-5edfb7d91b1c40a292a29b1d6cc4366a?pvs=4#41485cbadd5b4782969d1151d4903851"
            target="_blank"
          >
            download here
          </OakLink>
          ) and replaces areas within it with the text below. <br />
          You can modify the template but the placeholder identifiers are hard
          coded into the POC for now.
          <br />
          You can also select a curriculum{" "}
          <OakLink href="docx-poc/select">here</OakLink> to test the download.
          (WIP)
        </OakP>
        <Box $maxWidth={960} $mb={40}>
          <Flex $alignItems={"center"}>
            <OakPrimaryButton onClick={handleFileSelect} iconName="rocket">
              Choose docx template
            </OakPrimaryButton>
            <Box $ml={20}>{docxTemplateName}</Box>
            <input
              type="file"
              ref={hiddenFileInputRef}
              onChange={handleFileInputChange}
              hidden
            />
          </Flex>

          <Flex $flexDirection={"column"} $maxWidth={510} $mt={40} $gap={10}>
            <Input
              id={"subject"}
              label="Subject (Heading test)"
              autoComplete="off"
              placeholder=""
              isOptional={false}
              value={formData.subject}
              onChange={(evt) =>
                handleFormDataChange("subject", evt.target.value)
              }
            />
            <Input
              id={"threads"}
              label="Curriculum Explainer (Paragraph test)"
              autoComplete="off"
              placeholder=""
              isOptional={false}
              value={formData.curriculum_explainer}
              onChange={(evt) =>
                handleFormDataChange("curriculum_explainer", evt.target.value)
              }
            />
            <InputFieldWrap
              $mb={32}
              $alignItems="center"
              $background="white"
              $width={"100%"}
            >
              <Flex $width={"100%"} $position={"relative"}>
                <BoxBorders gapPosition="rightTop" />
                <Flex $position={"absolute"}>
                  <RotatedInputLabel
                    aria-hidden="true"
                    background={"lemon"}
                    color={"black"}
                    $font={"heading-7"}
                  >
                    Priciples (Loop test, seperate by newline)
                  </RotatedInputLabel>
                </Flex>

                <textarea
                  rows={3}
                  style={{
                    width: "100%",
                    margin: "25px 10px 10px 10px",
                    border: "none",
                    outline: "none",
                  }}
                  value={formData.principles}
                  onChange={(evt) =>
                    handleFormDataChange("principles", evt.target.value)
                  }
                />
              </Flex>
            </InputFieldWrap>

            <InputFieldWrap
              $mb={32}
              $alignItems="center"
              $background="white"
              $width={"100%"}
            >
              <Flex $width={"100%"} $position={"relative"}>
                <BoxBorders gapPosition="rightTop" />
                <Flex $position={"absolute"}>
                  <RotatedInputLabel
                    aria-hidden="true"
                    background={"lemon"}
                    color={"black"}
                    $font={"heading-7"}
                  >
                    Units (Complex Loop test, seperate by newline)
                  </RotatedInputLabel>
                </Flex>

                <textarea
                  rows={3}
                  style={{
                    width: "100%",
                    margin: "25px 10px 10px 10px",
                    border: "none",
                    outline: "none",
                  }}
                  value={formData.units}
                  onChange={(evt) =>
                    handleFormDataChange("units", evt.target.value)
                  }
                />
              </Flex>
            </InputFieldWrap>

            <Input
              id={"new_table_link"}
              label="New Link Text (Test new link navigates to new units table)"
              autoComplete="off"
              placeholder=""
              isOptional={false}
              value={formData.link_to_new_table}
              onChange={(evt) =>
                handleFormDataChange("link_to_new_table", evt.target.value)
              }
            />
          </Flex>

          <Box $mb={12}>
            <OakPrimaryButton onClick={handleDownloadClick} iconName="download">
              Download new document
            </OakPrimaryButton>
          </Box>

          <Box $mb={12}>
            <OakPrimaryButton
              onClick={handleGenerateRepeatables}
              iconName="download"
            >
              Generate unit table
            </OakPrimaryButton>
          </Box>
        </Box>
      </MaxWidth>
    </Flex>
  );
}
