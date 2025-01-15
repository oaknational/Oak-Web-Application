import { FC, useId } from "react";
import { OakHeadingTag, OakP, OakFlex } from "@oaknational/oak-components";

import NewsletterForm, {
  useNewsletterForm,
} from "@/components/GenericPagesComponents/NewsletterForm";
import OwaLink from "@/components/SharedComponents/OwaLink";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type WebinarRegistrationProps = {
  headingTag?: OakHeadingTag;
  onSubmit: () => void;
};

/**
 * Visual component to cover a webinar if a user is yet to fill out the
 * 'registration' form for webinars.
 *
 * ## Usage
 *
 * In the parent component call `useWebinarRegistration` which returns:
 * `webinarsUnlocked` and `onSubmit`.
 *
 * ### `webinarsUnlocked`
 *
 * This is set to true after the user as submitted the form, and is stored in
 * local storage. It should determine whether a user sees the recorded webinar
 * video, or this form.
 *
 * ### `onSubmit`
 *
 * This should be passed as a prop to this form.
 *
 */
const WebinarRegistration: FC<WebinarRegistrationProps> = (props) => {
  const { headingTag = "h2", onSubmit } = props;
  const id = useId();
  const descriptionId = useId();
  const newsletterForm = useNewsletterForm({ onSubmit });

  return (
    <Flex
      $flexDirection={["column", "row"]}
      $position="relative"
      $background="white"
      $width="100%"
      $pv={44}
      $ph={20}
    >
      <BoxBorders />
      <OakFlex $flexGrow={1}>
        <Flex
          $maxWidth={[360, 300]}
          $pr={20}
          $flexDirection="column"
          $ma="auto"
        >
          <CardTitle
            tag={headingTag}
            icon="magic-carpet"
            iconSize={"all-spacing-10"}
            $iconPosition={["leading", "aboveTitle"]}
          >
            Almost there!
          </CardTitle>
          <OakP
            $font={["body-3", "body-2"]}
            $mb={["space-between-m2", "space-between-none"]}
            color={"black"}
            id={descriptionId}
          >
            Fill this form to watch this webinar and get free resources and
            other helpful content by email. Unsubscribe any time.{" "}
            <OwaLink page="legal" legalSlug="privacy-policy" $isInline>
              Privacy policy
            </OwaLink>
            .
          </OakP>
        </Flex>
      </OakFlex>
      <OakFlex
        $width={["100%", "all-spacing-20"]}
        $maxWidth={"all-spacing-20"}
        $ma="auto"
      >
        <NewsletterForm
          id={id}
          descriptionId={descriptionId}
          {...newsletterForm}
        />
      </OakFlex>
    </Flex>
  );
};

export default WebinarRegistration;
