import { FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakSecondaryLink,
  OakMaxWidth,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";
import YourDetails, {
  School,
} from "@/components/CurriculumComponents/OakComponentsKitchen/YourDetails";

export type CampaignNewsletterSignupProps = {
  schoolId: string | undefined;
  schoolName: string | undefined;
  schools: School[];
  schoolNotListed: boolean;
  email?: string;
  errors: string;
  onChange: () => void;
};

const handleFormSubmit = () => {};

const CampaignNewsletterSignup: FC<CampaignNewsletterSignupProps> = ({
  email = undefined,
  schoolId = undefined,
  schoolName = undefined,
  schools = [],
  schoolNotListed = false,
  onChange = () => {},
}) => {
  const data = { schoolId, schoolName, email, schoolNotListed };
  return (
    <OakMaxWidth
      $flexDirection={"column"}
      $justifyContent={"center"}
      $alignItems={"center"}
    >
      <OakFlex
        $flexDirection={"column"}
        $alignItems={"flex-end"}
        $gap={"space-between-m"}
        $alignSelf={"stretch"}
      >
        <OakFlex
          $flexDirection={"row"}
          $alignItems={"center"}
          $alignSelf={"stretch"}
          $gap={"space-between-xxl"}
        >
          <OakFlex
            $alignSelf={"stretch"}
            $flexDirection={"column"}
            $gap={"space-between-s"}
          >
            <OakHeading tag="h4" $font={"heading-light-4"}>
              Think you've got to go it alone?
            </OakHeading>
            <OakFlex $alignSelf={"stretch"} $flexDirection={"column"}>
              Over 200,000 teachers are with you - and with Oak. Oak's resources
              aren't here to take over your planning - they're here to give you
              a starting point so you can build on what works. Think fresh ways
              to tackle tricky concepts. New angles that reach every pupil. Or
              just a little extra inspiration when the well runs dry. Our email
              list is where we share the good stuff first, to over 200k teachers
              - new content drops, expert insights and helpful resources. Oak is
              free - and always will be. Unsubscribe at any time. Read our{" "}
              <OakSecondaryLink
                href={resolveOakHref({
                  page: "legal",
                  legalSlug: "privacy-policy",
                })}
              >
                privacy policy
              </OakSecondaryLink>
            </OakFlex>
          </OakFlex>
          <OakFlex
            as="form"
            $flexDirection={"column"}
            $background={"white"}
            $pa={"inner-padding-xl"}
            $gap={"space-between-m"}
            $borderRadius={"border-radius-s"}
            onSubmit={handleFormSubmit}
          >
            <OakInputWithLabel
              label="Name"
              id="nameInput"
              name="Name"
              onChange={() => {}}
              required={true}
              labelBackground="mint"
            />
            <YourDetails
              data={data}
              schools={schools}
              errors={{}}
              onChange={onChange}
              labelBackground="mint"
              hidePrivacyPolicy={true}
            />
            <OakPrimaryButton
              type="submit"
              iconName="arrow-right"
              isTrailingIcon
            >
              Sign up and get assembly pack
            </OakPrimaryButton>
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakMaxWidth>
  );
};

export default CampaignNewsletterSignup;
