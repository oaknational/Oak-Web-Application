import { FC, useId } from "react";

import Flex from "../../Flex";
import { HeadingTag, P } from "../../Typography";
import NewsletterForm, { useNewsletterForm } from "../../Forms/NewsletterForm";
import CardTitle from "../../Card/CardComponents/CardTitle";
import OakLink from "../../OakLink";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";

export type WebinarRegistrationProps = {
  headingTag?: HeadingTag;
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
      <Flex $flexGrow={1}>
        <Flex
          $maxWidth={[360, 300]}
          $pr={20}
          $flexDirection="column"
          $ma="auto"
        >
          <CardTitle
            tag={headingTag}
            icon="magic-carpet"
            iconSize={56}
            $iconPosition={["leading", "aboveTitle"]}
          >
            Almost there!
          </CardTitle>
          <P
            $font={["body-3", "body-2"]}
            $mb={[36, 0]}
            color={"black"}
            id={descriptionId}
          >
            Fill this form to watch this webinar and get free resources and
            other helpful content by email. Unsubscribe any time.{" "}
            <OakLink page="legal" slug="privacy-policy" $isInline>
              Privacy policy
            </OakLink>
            .
          </P>
        </Flex>
      </Flex>
      <Flex $width={["100%", 360]} $maxWidth={360} $ma="auto">
        <NewsletterForm
          id={id}
          descriptionId={descriptionId}
          {...newsletterForm}
        />
      </Flex>
    </Flex>
  );
};

export default WebinarRegistration;
