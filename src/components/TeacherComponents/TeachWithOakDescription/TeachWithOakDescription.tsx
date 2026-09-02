import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakIconName,
  OakMaxWidth,
  OakP,
  OakUL,
} from "@oaknational/oak-components";

export const TeachWithOakDescription = () => {
  return (
    <OakBox $width="100%" $background="bg-decorative2-main">
      <OakMaxWidth>
        <OakGrid
          $pv={["spacing-56", "spacing-80"]}
          $ph={["spacing-20", "spacing-40"]}
          $rg={"spacing-32"}
        >
          <OakGridArea
            $flexDirection="column"
            $colStart={1}
            $colSpan={[12, 5]}
            $pr={["spacing-0", "spacing-32", "spacing-0"]}
            $rowGap="spacing-24"
            $rowStart={1}
          >
            <OakHeading
              $font={["heading-4", "heading-3", "heading-2"]}
              tag="h2"
            >
              There's a lot of thinking behind every Oak lesson
            </OakHeading>
            <OakFlex
              $flexDirection="column"
              $font={["body-2", "body-1"]}
              $gap={"spacing-24"}
            >
              <OakP>
                Structure is important for effective learning, which is why we
                use learning cycles. Each focuses on a particular theme, idea or
                content linked to the learning outcome.
              </OakP>
              <OakP>
                Every learning cycle is carefully structured to give you a
                strong foundation for teaching new or complex knowledge and
                skills - and ensure consistency across subjects and key stages.
              </OakP>
              <OakP>
                They give you the tools to introduce new knowledge through
                explanation, which is assessed through checks for understanding
                peppered throughout. You can then support your pupils to
                practise what they've learnt, and use feedback to help move
                their learning forward.
              </OakP>
            </OakFlex>
          </OakGridArea>
          <OakGridArea $colStart={[1, 7]} $colSpan={[12, 6]} $rowStart={[2, 1]}>
            <OakUL
              $reset
              $gap={["spacing-4", "spacing-12"]}
              $display={"flex"}
              $flexDirection="column"
            >
              <LearningCycle
                label="Explanation"
                iconName="lc-explanation"
                connector={<With />}
              />
              <LearningCycle
                label="Check for understanding"
                iconName="lc-check-for-understanding"
                connector={
                  <OakIcon
                    iconName="arrow-down"
                    iconHeight="spacing-80"
                    iconWidth="spacing-80"
                    $mv={"spacing-12"}
                  />
                }
              />
              <LearningCycle
                label="Practice"
                iconName="lc-practice"
                connector={<With />}
              />
              <LearningCycle label="Feedback" iconName="lc-feedback" />
            </OakUL>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </OakBox>
  );
};

const LearningCycle = ({
  connector,
  iconName,
  label,
}: {
  connector?: React.ReactNode;
  iconName: OakIconName;
  label: string;
}) => {
  return (
    <OakFlex $flexDirection="column" $gap={["spacing-4", "spacing-12"]} as="li">
      <OakFlex
        $alignItems="center"
        $gap={["spacing-20", "spacing-32"]}
        $flexWrap={["wrap", "wrap", "nowrap"]}
      >
        <OakIcon
          iconName={iconName}
          $width={["spacing-72", "spacing-100"]}
          $height={["spacing-72", "spacing-100"]}
        />
        <OakHeading $font={["heading-light-4", "heading-light-3"]} tag="h3">
          {label}
        </OakHeading>
      </OakFlex>
      {connector}
    </OakFlex>
  );
};

const With = () => {
  return (
    <OakFlex
      $background="bg-inverted"
      $width="fit-content"
      $ph={"spacing-8"}
      $pv={"spacing-4"}
      $transform={"rotate(-1.5deg)"}
      $ml={"spacing-12"}
    >
      <OakP $color="text-inverted" $font="heading-5">
        With
      </OakP>
    </OakFlex>
  );
};
