import {
  OakFlex,
  OakTagFunctional,
  OakHeading,
  OakLink,
  OakP,
} from "@oaknational/oak-components";
import { PortableTextBlock } from "@portabletext/types";
import upperFirst from "lodash/upperFirst";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

type CaseStudyHeaderProps = {
  title: string;
  tag?: string | null;
  publishedDate: string;
  summary?: PortableTextBlock[] | null;
  onCopyLink: () => void;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
export function CaseStudyHeader({
  title,
  tag,
  publishedDate,
  summary,
  onCopyLink,
  headingLevel = "h1",
}: Readonly<CaseStudyHeaderProps>) {
  return (
    <OakFlex $flexDirection="column" $gap="spacing-48">
      <OakFlex
        $pt="spacing-32"
        $gap="spacing-16"
        $flexDirection="column"
        $alignItems="flex-start"
      >
        {tag && (
          <OakTagFunctional
            label={upperFirst(tag)}
            $background="bg-decorative2-main"
          />
        )}
        <OakHeading
          tag={headingLevel}
          $font={["heading-4", "heading-3", "heading-3"]}
        >
          {title}
        </OakHeading>
        <OakFlex $flexDirection="row" $flexGrow={1} $alignSelf="stretch">
          <OakFlex $flexGrow={1} $font={["body-2", "body-1", "body-1"]}>
            {publishedDate}
          </OakFlex>
          <OakLink
            element="button"
            variant="secondary"
            onClick={onCopyLink}
            iconName="copy"
          >
            Copy link
          </OakLink>
        </OakFlex>
      </OakFlex>
      {summary && (
        <OakFlex
          $flexDirection={"column"}
          $background={"bg-decorative2-very-subdued"}
          $pa={"spacing-20"}
          $borderRadius={"border-radius-s"}
          $gap={"spacing-16"}
          $ba="border-solid-s"
          $borderColor="border-decorative2"
        >
          <OakHeading tag={"div"} $font={["heading-7", "heading-6"]}>
            Summary
          </OakHeading>
          <PortableTextWithDefaults
            value={summary}
            components={{
              block: {
                normal: (props) => {
                  return (
                    <OakP $font={["body-2", "body-1"]}>{props.children}</OakP>
                  );
                },
              },
            }}
          />
        </OakFlex>
      )}
    </OakFlex>
  );
}
