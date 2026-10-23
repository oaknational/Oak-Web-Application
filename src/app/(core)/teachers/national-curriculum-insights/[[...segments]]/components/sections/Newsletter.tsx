"use client";
import {
  OakBox,
  OakCheckBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
  OakPrimaryButton,
  OakUL,
} from "@oaknational/oak-components";
import { FormEvent, useState } from "react";

import { insightsAssetUrl } from "../../helpers/assets";
import { NationalCurriculumInsightsSelect } from "../Select";
import {
  INSIGHTS_NEWSLETTER_FORM_ID,
  INSIGHTS_NEWSLETTER_PORTAL_ID,
  insightsNewsletterRoleValue,
} from "../../helpers/newsletter";
import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  SectionProps,
  imageUrl,
  imageAlt,
  guidancePortableTextComponents,
} from "./shared";

import { EDU_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { getSchema as getCampaignNewsletterSchema } from "@/components/GenericPagesComponents/CampaignNewsletterSignup/CampaignNewsletterSignup";
import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import useAnalytics from "@/context/Analytics/useAnalytics";

type NewsletterProps =
  SectionProps<"NationalCurriculumInsightsNewsletterSection"> & {
    variant: "plain" | "highlighted";
  };

export const NationalCurriculumInsightsNewsletter = ({
  section,
  variant,
}: NewsletterProps) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [schoolNotListed, setSchoolNotListed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { onSubmit: submitNewsletter } = useNewsletterForm({
    hubspotNewsletterFormId: INSIGHTS_NEWSLETTER_FORM_ID,
    hubspotPortalId: INSIGHTS_NEWSLETTER_PORTAL_ID,
  });
  const { track } = useAnalytics();
  const {
    schools,
    schoolPickerInputValue,
    setSchoolPickerInputValue,
    setSelectedSchool,
  } = useSchoolPicker({ withHomeschool: false });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    const result = getCampaignNewsletterSchema({
      freeSchoolInput: true,
      enableRole: true,
    }).safeParse({
      name,
      email,
      schoolOrg: schoolPickerInputValue,
      schoolNotListed,
      eduRole: role,
    });

    if (!result.success) {
      setFieldErrors(
        Object.fromEntries(
          result.error.issues.map((issue) => [
            String(issue.path[0] ?? "form"),
            issue.message,
          ]),
        ),
      );
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      await submitNewsletter({
        name,
        email,
        userRole: "",
        eduRole: insightsNewsletterRoleValue(role),
        schoolName: schoolNotListed ? "notListed" : schoolPickerInputValue,
      });
      track.newsletterSignUpCompleted();
      setSuccessMessage("Thanks, that's been received");
    } catch {
      setSubmitError("We couldn't submit the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OakBox
      $boxSizing="border-box"
      as="section"
      id="sign-up"
      $background={
        variant === "plain" ? "bg-primary" : "bg-decorative5-very-subdued"
      }
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-40", "spacing-48"]}
      $borderRadius="border-radius-l"
      aria-labelledby="national-curriculum-insights-newsletter-heading"
      data-insights-module="newsletter"
    >
      <OakBox
        $mh="auto"
        $width="100%"
        $maxWidth="spacing-1280"
        $ph={[
          "spacing-0",
          "spacing-0",
          variant === "plain" ? "spacing-80" : "spacing-40",
        ]}
      >
        <OakFlex
          $pr={["spacing-0", "spacing-0", "spacing-56"]}
          $flexDirection={["column", "column", "row"]}
          $gap="spacing-40"
          $alignItems="center"
        >
          <OakFlex
            $width="100%"
            $maxWidth={["100%", "spacing-800", "100%"]}
            $minWidth="spacing-0"
            $flexDirection="column"
            $gap="spacing-16"
          >
            <OakFlex $alignItems="center" $gap="spacing-12">
              <OakFlex $flexShrink={0}>
                <OakImage
                  src={imageUrl(
                    section.illustration,
                    insightsAssetUrl("newsletter"),
                  )}
                  alt={imageAlt(section.illustration)}
                  style={{ width: 60, height: 50 }}
                  $objectFit="contain"
                  aria-hidden={
                    section.illustration.isPresentational || undefined
                  }
                />
              </OakFlex>
              <OakHeading
                tag="h2"
                id="national-curriculum-insights-newsletter-heading"
                $font="heading-4"
              >
                {section.heading}
              </OakHeading>
            </OakFlex>
            <OakFlex $flexDirection="column" $gap="spacing-24">
              <OakP $font="body-1" $mv="spacing-0">
                {section.introduction}
              </OakP>
              <OakP $font="body-1" $mv="spacing-0">
                {section.benefitsHeading ?? "Sign up now for:"}
              </OakP>
              <OakUL
                $display="flex"
                $flexDirection="column"
                $gap="spacing-12"
                $ma="spacing-0"
                $pl="spacing-24"
              >
                {section.benefits.map((benefit) => (
                  <li key={benefit}>
                    <OakP $font="body-1" $mv="spacing-0">
                      {benefit}
                    </OakP>
                  </li>
                ))}
              </OakUL>
              <PortableTextWithDefaults
                value={section.privacyPortableText}
                components={guidancePortableTextComponents}
              />
            </OakFlex>
          </OakFlex>

          <OakFlex
            $width="100%"
            $maxWidth={["100%", "spacing-640", "spacing-480"]}
            $flexShrink={0}
            as="form"
            onSubmit={onSubmit}
            $gap="spacing-48"
            $flexDirection="column"
          >
            <OakInputWithLabel
              label="Name"
              id="insights-newsletter-name"
              name="name"
              required
              defaultValue={name}
              error={fieldErrors.name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Type your name"
              autocomplete="name"
            />
            <OakBox $position="relative">
              <NationalCurriculumInsightsSelect
                id="insights-newsletter-role"
                name="role"
                label="Role"
                placeholder="Select your role"
                options={EDU_ROLES.map((option) => ({
                  label: option,
                  value: option,
                }))}
                value={role}
                onChange={setRole}
                error={fieldErrors.eduRole}
              />
            </OakBox>
            <OakFlex $flexDirection="column" $gap="spacing-12">
              <ResourcePageSchoolPicker
                hasError={false}
                schools={schools}
                label="School or organisation"
                schoolPickerInputValue={schoolPickerInputValue}
                setSchoolPickerInputValue={(value) => {
                  setSchoolNotListed(false);
                  setSchoolPickerInputValue(value);
                }}
                setSelectedSchool={setSelectedSchool}
                required={false}
                withHomeschool={false}
                placeholder="Type your school or organisation"
              />
              <OakCheckBox
                checkboxBorderRadius="border-radius-square"
                id="insights-newsletter-school-not-listed"
                name="schoolNotListed"
                value="not-listed"
                displayValue="My school isn't listed"
                checked={schoolNotListed}
                onChange={(event) => {
                  const isChecked = event.target.checked;
                  setSchoolNotListed(isChecked);
                  if (isChecked) {
                    setSelectedSchool(undefined);
                    setSchoolPickerInputValue("");
                  }
                }}
              />
            </OakFlex>
            <OakInputWithLabel
              label="Email"
              id="insights-newsletter-email"
              name="email"
              required
              defaultValue={email}
              error={fieldErrors.email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Type your email address"
              autocomplete="email"
            />
            <OakPrimaryButton
              type="submit"
              iconName="arrow-right"
              isTrailingIcon
              width="100%"
              isLoading={submitting}
            >
              {section.buttonLabel}
            </OakPrimaryButton>
            {submitError ? (
              <OakP
                role="alert"
                aria-live="assertive"
                $font="body-3"
                $color="text-error"
                $mv="spacing-0"
              >
                {submitError}
              </OakP>
            ) : null}
            <OakBox $position={successMessage ? "static" : "absolute"}>
              <OakP
                role="status"
                aria-live="polite"
                aria-atomic="true"
                $font="body-3"
                $mv="spacing-0"
              >
                {successMessage}
              </OakP>
            </OakBox>
          </OakFlex>
        </OakFlex>
      </OakBox>
    </OakBox>
  );
};
