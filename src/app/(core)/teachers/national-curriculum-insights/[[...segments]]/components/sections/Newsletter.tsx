"use client";
import {
  getMediaQuery,
  OakBox,
  OakCheckBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { FormEvent, useState } from "react";
import styled from "styled-components";

import { insightsAssetUrl } from "../../helpers/assets";
import { NationalCurriculumInsightsSelect } from "../Select";
import {
  INSIGHTS_NEWSLETTER_FORM_ID,
  INSIGHTS_NEWSLETTER_PORTAL_ID,
  insightsNewsletterRoleValue,
} from "../../helpers/newsletter";
import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  ContextualSectionProps,
  insightsTabletMediaQuery,
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

const NewsletterList = styled(OakFlex)`
  list-style: disc;
  margin: 0;
  padding-left: 24px;
`;

const NewsletterSection = styled(OakBox)`
  box-sizing: border-box;

  @media (${getMediaQuery("desktop")}) {
    height: 632px;
    display: flex;
    align-items: center;
  }

  @media ${insightsTabletMediaQuery} {
    height: auto;
    display: block;
    padding-block: 40px;
  }
`;

const NewsletterInner = styled(OakBox)<{ $isGuidance: boolean }>`
  width: 100%;
  max-width: ${({ $isGuidance }) => ($isGuidance ? "1151px" : "1058px")};

  @media (${getMediaQuery("desktop")}) {
    transform: ${({ $isGuidance }) =>
      $isGuidance ? "none" : "translateX(12px)"};
  }
`;

const NewsletterLayout = styled(OakBox)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: 544px 475px;
    grid-template-rows: auto 1fr;
    column-gap: 39px;
    row-gap: 16px;
    justify-content: center;
    align-items: start;
  }

  @media ${insightsTabletMediaQuery} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    row-gap: 16px;
    justify-content: stretch;
  }
`;

const NewsletterLead = styled(OakFlex)`
  width: 100%;
  grid-column: 1;
  grid-row: 1;

  @media (${getMediaQuery("desktop")}) {
    width: 544px;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(666px, calc(38.679vw + 375.906px), 871px);
    max-width: 100%;
    justify-self: center;
  }
`;

const NewsletterDetails = styled(OakFlex)`
  width: 100%;
  grid-column: 1;
  grid-row: 3;

  @media (${getMediaQuery("desktop")}) {
    width: 544px;
    grid-row: 2;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(666px, calc(28.113vw + 455.151px), 815px);
    max-width: 100%;
    grid-column: 1;
    grid-row: 2;
    justify-self: center;
  }
`;

const NewsletterForm = styled(OakFlex)`
  width: 100%;
  grid-column: 1;
  grid-row: 2;

  @media (${getMediaQuery("mobile")}) {
    margin-top: 24px;
  }

  input[type="checkbox"] {
    border-radius: 0;
  }

  @media (${getMediaQuery("desktop")}) {
    width: 475px;
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  @media ${insightsTabletMediaQuery} {
    width: min(100%, 686px);
    grid-column: 1;
    grid-row: 3;
    justify-self: center;
    margin-top: 32px;
  }
`;

export const NationalCurriculumInsightsNewsletter = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsNewsletterSection">) => {
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
  const isGuidance = data.route.kind === "guidance";
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
    <NewsletterSection
      as="section"
      id="sign-up"
      $background={isGuidance ? "bg-primary" : "bg-decorative5-very-subdued"}
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-48"]}
      $borderRadius="border-radius-l"
      aria-labelledby="national-curriculum-insights-newsletter-heading"
      data-insights-module="newsletter"
    >
      <NewsletterInner $mh="auto" $isGuidance={isGuidance}>
        <NewsletterLayout>
          <NewsletterLead $flexDirection="column" $gap="spacing-16">
            <OakFlex $alignItems="center" $gap="spacing-12">
              <OakImage
                src={imageUrl(
                  section.illustration,
                  insightsAssetUrl("newsletter"),
                )}
                alt={imageAlt(section.illustration)}
                style={{ width: 60, height: 50 }}
                $objectFit="contain"
                aria-hidden={section.illustration.isPresentational || undefined}
              />
              <OakHeading
                tag="h2"
                id="national-curriculum-insights-newsletter-heading"
                $font="heading-4"
              >
                {section.heading}
              </OakHeading>
            </OakFlex>
            <OakP
              $font={isGuidance ? "body-1-bold" : "heading-7"}
              $mv="spacing-0"
            >
              {section.introduction}
            </OakP>
          </NewsletterLead>
          <NewsletterDetails $flexDirection="column" $gap="spacing-16">
            <OakP $font={isGuidance ? "body-1" : "body-2"} $mv="spacing-0">
              {section.benefitsHeading ?? "Sign up now for:"}
            </OakP>
            <NewsletterList as="ul" $flexDirection="column" $gap="spacing-16">
              {section.benefits.map((benefit) => (
                <li key={benefit}>
                  <OakP
                    $font={isGuidance ? "body-1" : "body-2"}
                    $mv="spacing-0"
                  >
                    {benefit}
                  </OakP>
                </li>
              ))}
            </NewsletterList>
            <PortableTextWithDefaults
              value={section.privacyPortableText}
              components={
                isGuidance ? guidancePortableTextComponents : undefined
              }
            />
          </NewsletterDetails>

          <NewsletterForm
            as="form"
            onSubmit={onSubmit}
            $gap="spacing-48"
            $flexDirection="column"
            data-form-id={section.formId ?? undefined}
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
            <OakP
              role="status"
              aria-live="polite"
              aria-atomic="true"
              $font="body-3"
              $mv="spacing-0"
              $position={successMessage ? "static" : "absolute"}
            >
              {successMessage}
            </OakP>
          </NewsletterForm>
        </NewsletterLayout>
      </NewsletterInner>
    </NewsletterSection>
  );
};
