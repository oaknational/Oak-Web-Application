import {
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";

function OakPlaceholder() {
  return <OakFlex $ba="border-solid-s">??</OakFlex>;
}

export function OaksImpactStats() {
  return (
    <OakFlex
      $alignItems={"flex-start"}
      $flexDirection={["column", "row", "row"]}
      $background={"bg-decorative2-main"}
      $ph={["spacing-32", "spacing-40", "spacing-100"]}
      $pv={"spacing-80"}
      $gap={["spacing-120", "spacing-16"]}
    >
      <OakFlex
        $alignItems={"flex-start"}
        $flexDirection={"column"}
        $pr={["spacing-32", "spacing-32", "spacing-0"]}
        $gap={"spacing-32"}
      >
        <OakFlex
          $alignItems={"flex-start"}
          $flexDirection={"column"}
          $gap={"spacing-24"}
        >
          <OakHeading tag={"h1"} $color={"text-primary"} $font={"heading-3"}>
            Oak is now used in 72% of schools
          </OakHeading>
          <OakP $color={"text-primary"} $font={["body-2", "body-1", "body-1"]}>
            Our latest independent evaluation shows just how valuable this
            support has already become for teachers and school leaders.
          </OakP>
        </OakFlex>
        <OakPrimaryButton iconName={"external"}>
          Read the 24/25 impact report
        </OakPrimaryButton>
      </OakFlex>
      <OakFlex $alignItems={"flex-start"} $gap={"spacing-8"}>
        <OakFlex
          $alignItems={"flex-start"}
          $flexDirection={"column"}
          $gap={"spacing-40"}
        >
          <OakFlex
            $alignItems={"flex-start"}
            $flexDirection={["column", "row", "row"]}
            $borderRadius={"border-radius-m2"}
            $gap={["spacing-20", "spacing-20", "spacing-32"]}
          >
            <OakFlex $alignItems={"flex-start"}>
              <OakPlaceholder componentName={"Group 1218"} />
            </OakFlex>
            <OakFlex
              $alignItems={"flex-start"}
              $flexDirection={"column"}
              $borderRadius={"border-radius-m2"}
              $gap={"spacing-4"}
            >
              <OakFlex $alignItems={"flex-start"} $gap={"spacing-8"}>
                <OakHeading
                  tag={"h1"}
                  $color={"text-primary"}
                  $font={"heading-light-1"}
                >
                  200,000
                </OakHeading>
              </OakFlex>
              <OakP $color={"text-primary"} $font={"body-1"}>
                Between January and July 2025 alone, almost 200,000 teachers
                used Oak, with over 54,000 using it every week – a 53% rise on
                the previous year.
              </OakP>
            </OakFlex>
          </OakFlex>
          <OakPlaceholder componentName={"Rectangle 444"} />
          <OakFlex
            $alignItems={"flex-start"}
            $flexDirection={["column", "row", "row"]}
            $borderRadius={"border-radius-m2"}
            $gap={["spacing-20", "spacing-20", "spacing-32"]}
          >
            <OakFlex $alignItems={"flex-start"}>
              <OakPlaceholder
                componentName={"reducing-workload_illustration (1) 1"}
              />
            </OakFlex>
            <OakFlex
              $alignItems={"flex-start"}
              $flexDirection={"column"}
              $borderRadius={"border-radius-m2"}
              $gap={"spacing-4"}
            >
              <OakHeading
                tag={"h1"}
                $color={"text-primary"}
                $font={"heading-light-1"}
              >
                85%
              </OakHeading>
              <OakP $color={"text-primary"} $font={"body-1"}>
                85% of Oak users say it has a positive impact on their workload.
                Two thirds (67%) report an overall workload reduction, saving a
                median four hours per week.
              </OakP>
            </OakFlex>
          </OakFlex>
          <OakPlaceholder componentName={"Rectangle 445"} />
          <OakFlex
            $alignItems={"flex-start"}
            $flexDirection={["column", "row", "row"]}
            $borderRadius={"border-radius-m2"}
            $gap={["spacing-20", "spacing-20", "spacing-32"]}
          >
            <OakFlex $alignItems={"flex-start"}>
              <OakPlaceholder
                componentName={"teacher-whiteboard_illustration (1)"}
              />
            </OakFlex>
            <OakFlex
              $alignItems={"flex-start"}
              $flexDirection={"column"}
              $borderRadius={"border-radius-m2"}
              $gap={"spacing-4"}
            >
              <OakHeading
                tag={"h1"}
                $color={"text-primary"}
                $font={"heading-light-1"}
              >
                92%
              </OakHeading>
              <OakP $color={"text-primary"} $font={"body-1"}>
                92% of Oak users see themselves staying in a teaching role in
                the next two years compared to 77% of non-users, indicating
                higher retention could be linked to Oak usage.
              </OakP>
            </OakFlex>
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
}
