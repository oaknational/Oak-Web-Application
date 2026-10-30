import {
  OakBasicAccordion,
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakSpan,
} from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

export type JoinResearchPanelFaqsProps = Omit<
  JoinResearchPanelPageBlock<"JoinResearchPanelPageFaqs">,
  "__typename"
>;

export default function JoinResearchPanelFaqs({
  items,
}: Readonly<JoinResearchPanelFaqsProps>) {
  return (
    <NewGutterMaxWidth>
      <OakFlex
        $flexDirection={"column"}
        $gap="spacing-32"
        $alignItems={"center"}
        $pv={["spacing-56", "spacing-80"]}
      >
        <OakHeading tag="h2" $font={["heading-5", "heading-4"]}>
          Frequently asked questions
        </OakHeading>
        <OakGrid>
          <OakGridArea
            $colSpan={[12, 10, 8]}
            $colStart={[1, 2, 3]}
            $alignSelf={"flex-start"}
            $flexDirection={"column"}
          >
            {items.map((item, i) => (
              <OakBasicAccordion
                key={item.question}
                header={
                  <OakSpan
                    $textAlign={"left"}
                    $font={["heading-7", "heading-6"]}
                  >
                    {item.question}
                  </OakSpan>
                }
                id={`faq-${i}`}
                $bl="border-solid-none"
                $br="border-solid-none"
                $bt={i === 0 ? "border-solid-m" : "border-solid-s"}
                $bb={
                  i === items.length - 1 ? "border-solid-m" : "border-solid-s"
                }
                $borderColor={"border-neutral-lighter"}
              >
                <OakBox $mt="spacing-20">
                  <PortableTextWithDefaults value={item.answerRaw} />
                </OakBox>
              </OakBasicAccordion>
            ))}
          </OakGridArea>
        </OakGrid>
      </OakFlex>
    </NewGutterMaxWidth>
  );
}
