"use client";

import {
  getMediaQuery,
  OakCheckBox,
  OakHeading,
  OakIcon,
  OakJauntyAngleLabel,
  OakLink,
  OakMultiSelect,
  OakP,
  OakTextInput,
} from "@oaknational/oak-components";
import { ChangeEvent, FormEvent, useId, useMemo, useState } from "react";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";

import type { NationalCurriculumInsightsModule } from "@/common-lib/cms-types/nationalCurriculumInsights";
import { EDU_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";

type DownloadSection = Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsDownloadSection" }
>;

const Section = styled.section`
  width: 100%;
  background: #ffffff;
`;

const HeaderButton = styled.button`
  display: block;
  width: 100%;
  min-height: 99px;
  padding: 19px 20px;
  border: 0;
  background: #00746a;
  color: #ffffff;
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 4px solid #ffe555;
    outline-offset: -4px;
  }
`;

const HeaderInner = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  min-height: 60px;
  margin: 0 auto;
`;

const HeaderIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  margin-right: 24px;
  border-radius: 50%;
  background: #ffffff;
  color: #00746a;
`;

const HeaderHeading = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;
`;

const HeaderCta = styled.span`
  display: none;
  min-height: 28px;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  background: #0c5651;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.5px;
  margin-left: 16px;

  @media (${getMediaQuery("tablet")}), (${getMediaQuery("desktop")}) {
    display: inline-flex;
  }
`;

const Toggle = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  min-height: 32px;
  margin-left: auto;

  &::before {
    width: 9px;
    height: 9px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    content: "";
    transform: rotate(${({ $expanded }) => ($expanded ? "45deg" : "225deg")});
  }
`;

const Expanded = styled.form`
  width: 100%;
  background: #ffffff;
`;

const Columns = styled.div`
  display: grid;
  max-width: 1280px;
  margin: 0 auto;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: minmax(0, 53%) minmax(0, 47%);
  }
`;

const Column = styled.div`
  box-sizing: border-box;
  min-width: 0;
  padding: 32px 20px 40px;

  & + & {
    border-top: 1px solid #e4e4e4;
  }

  @media (${getMediaQuery("desktop")}) {
    min-height: 632px;
    padding: 24px 64px 0 0;

    & + & {
      padding-right: 0;
      padding-left: 64px;
      border-top: 0;
      border-left: 1px solid #e4e4e4;
    }
  }
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 32px;
`;

const SchoolFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  position: relative;
  width: 100%;

  input {
    height: 60px;
  }

  select {
    min-height: 64px;
  }
`;

const NativeSelect = styled.select`
  box-sizing: border-box;
  width: 100%;
  min-height: 64px;
  padding: 12px 48px 12px 16px;
  border: 2px solid #222222;
  border-radius: 4px;
  background: #ffffff;
  color: #222222;
  font: inherit;
  font-size: 16px;
  line-height: 24px;

  &:focus-visible {
    outline: 4px solid #ffe555;
    outline-offset: 2px;
  }
`;

const Selector = styled.div`
  width: 100%;
  margin-top: 24px;
`;

const Notice = styled(OakP)`
  max-width: 620px;
`;

const TermsBox = styled.div`
  display: flex;
  min-height: 56px;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background: #e4e4e4;
`;

const ActionBar = styled.div`
  display: grid;
  max-width: 1280px;
  min-height: 80px;
  margin: 0 auto;
  border-top: 1px solid #e4e4e4;
  background: #ffffff;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: minmax(0, 53%) minmax(0, 47%);
  }
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;

  @media (${getMediaQuery("desktop")}) {
    grid-column: 2;
    padding: 12px 0 12px 76px;
    border-left: 1px solid #e4e4e4;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 2px solid #222222;
  border-radius: 4px;
  background: #222222;
  color: #ffffff;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;

  &:disabled {
    border-color: #808080;
    background: #808080;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 4px solid #ffe555;
    outline-offset: 2px;
  }
`;

const ErrorMessage = styled(OakP)`
  margin: 12px 0 0;
  color: #b00020;
`;

const parseSelection = (value: string) => {
  const [subjectSlug, phase] = value.split(":");
  if (!subjectSlug || (phase !== "primary" && phase !== "secondary")) {
    throw new Error("Invalid curriculum selection");
  }
  return { subjectSlug, phase };
};

const responseFilename = (response: Response) => {
  const explicitFilename = response.headers.get("x-filename");
  if (explicitFilename) return explicitFilename;
  const disposition = response.headers.get("content-disposition") ?? "";
  return (
    disposition.match(/filename="?([^";]+)"?/i)?.[1] ?? "Curriculum insights"
  );
};

export const NationalCurriculumInsightsDownload = ({
  data,
  section,
}: {
  data: NationalCurriculumInsightsRouteData;
  section: DownloadSection;
}) => {
  const formId = useId().replace(/:/g, "");
  const [expanded, setExpanded] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [schoolNotListed, setSchoolNotListed] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo(
    () =>
      (["primary", "secondary"] as const)
        .map((phase) => ({
          value: phase,
          label: phase === "primary" ? "Primary" : "Secondary",
          tagBackground:
            phase === "primary"
              ? ("bg-decorative4-main" as const)
              : ("bg-decorative3-main" as const),
          options: data.hub.subjects
            .filter(({ tabs }) => tabs.some(({ kind }) => kind === phase))
            .map(({ slug, title }) => ({
              label: title,
              value: `${slug}:${phase}`,
            })),
        }))
        .filter(({ options }) => options.length > 0),
    [data.hub.subjects],
  );

  const detailsComplete =
    name.trim().length > 0 &&
    (schoolNotListed || school.trim().length > 0) &&
    role.length > 0 &&
    acceptedTerms;
  const canDownload =
    detailsComplete && selectedValues.length > 0 && !downloading;
  const multiple = selectedValues.length > 1;
  const buttonLabel = `${section.downloadButtonLabel} ${selectedValues.length} ${
    selectedValues.length === 1 ? "insight" : "insights"
  } (${multiple ? ".ZIP" : ".DOCX"})`;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canDownload) return;

    setDownloading(true);
    setError(null);
    try {
      const response = await fetch(
        "/api/national-curriculum-insights/download",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selections: selectedValues.map(parseSelection),
          }),
        },
      );
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(result?.error ?? "The download could not be made.");
      }

      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = responseFilename(response);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "The download could not be made.",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Section data-insights-module="downloads">
      <HeaderButton
        type="button"
        aria-expanded={expanded}
        aria-controls={`${formId}-content`}
        onClick={() => setExpanded((value) => !value)}
      >
        <HeaderInner>
          <HeaderIcon aria-hidden="true">
            <OakIcon
              iconName="worksheet"
              $width="spacing-32"
              $height="spacing-32"
            />
          </HeaderIcon>
          <HeaderHeading>{section.barHeading}</HeaderHeading>
          <HeaderCta>{section.barCtaLabel}</HeaderCta>
          <Toggle $expanded={expanded} aria-hidden="true" />
        </HeaderInner>
      </HeaderButton>

      {expanded ? (
        <Expanded id={`${formId}-content`} onSubmit={submit} noValidate>
          <Columns>
            <Column>
              <OakHeading tag="h2" $font="heading-6">
                {section.detailsHeading}
              </OakHeading>
              <Fields>
                <Field>
                  <OakJauntyAngleLabel
                    as="label"
                    htmlFor={`${formId}-name`}
                    label="Name (required)"
                    $background="bg-decorative5-main"
                    $font="heading-7"
                    $position="absolute"
                    $top="-20px"
                    $left="spacing-8"
                    $zIndex="in-front"
                  />
                  <OakTextInput
                    id={`${formId}-name`}
                    name="name"
                    value={name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setName(event.target.value)
                    }
                    placeholder="Type your name"
                    autoComplete="name"
                    wrapperWidth="100%"
                    $height="spacing-64"
                  />
                </Field>
                <SchoolFields>
                  <Field>
                    <OakJauntyAngleLabel
                      as="label"
                      htmlFor={`${formId}-school`}
                      label="School (required)"
                      $background="bg-decorative5-main"
                      $font="heading-7"
                      $position="absolute"
                      $top="-20px"
                      $left="spacing-8"
                      $zIndex="in-front"
                    />
                    <OakTextInput
                      id={`${formId}-school`}
                      name="school"
                      value={school}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setSchool(event.target.value)
                      }
                      placeholder="Type school name, postcode, or ‘homeschool’"
                      disabled={schoolNotListed}
                      autoComplete="organization"
                      wrapperWidth="100%"
                      $height="spacing-64"
                    />
                  </Field>
                  <OakCheckBox
                    id={`${formId}-school-not-listed`}
                    name="school-not-listed"
                    value="school-not-listed"
                    displayValue="My school isn't listed"
                    checked={schoolNotListed}
                    onChange={(event) =>
                      setSchoolNotListed(event.target.checked)
                    }
                  />
                </SchoolFields>
                <Field>
                  <OakJauntyAngleLabel
                    as="label"
                    htmlFor={`${formId}-role`}
                    label="Role (required)"
                    $background="bg-decorative5-main"
                    $font="heading-7"
                    $position="absolute"
                    $top="-20px"
                    $left="spacing-8"
                    $zIndex="in-front"
                  />
                  <NativeSelect
                    id={`${formId}-role`}
                    name="role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                  >
                    <option value="">Select your role</option>
                    {EDU_ROLES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field>
                  <OakJauntyAngleLabel
                    as="label"
                    htmlFor={`${formId}-email`}
                    label="Email (Optional)"
                    $background="bg-decorative5-main"
                    $font="heading-7"
                    $position="absolute"
                    $top="-20px"
                    $left="spacing-8"
                    $zIndex="in-front"
                  />
                  <OakTextInput
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Enter email address here"
                    autoComplete="email"
                    wrapperWidth="100%"
                    $height="spacing-64"
                  />
                </Field>
                <Notice $font="body-3" $mv="spacing-0">
                  Join over 200k teachers and get free resources and other
                  helpful content by email. Unsubscribe at any time. Read our{" "}
                  <OakLink href="/legal/privacy-policy" target="_blank">
                    privacy policy
                  </OakLink>
                  .
                </Notice>
                <TermsBox>
                  <OakCheckBox
                    id={`${formId}-terms`}
                    name="terms"
                    value="terms"
                    displayValue="I accept the terms and conditions (required)"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                  />
                </TermsBox>
              </Fields>
            </Column>

            <Column>
              <OakHeading tag="h2" $font="heading-6">
                {section.downloadsHeading}
              </OakHeading>
              <OakP $font="body-2">{section.downloadsIntroduction}</OakP>
              <Selector>
                <OakMultiSelect
                  id={`${formId}-subjects`}
                  groups={groups}
                  selectedValues={selectedValues}
                  onChange={setSelectedValues}
                  placeholder="Select subjects"
                  size="large"
                  mobileConfirmLabel="Confirm selection"
                  data-testid="curriculum-insights-subjects"
                />
              </Selector>
            </Column>
          </Columns>
          <ActionBar>
            <ActionCell>
              <div style={{ width: "100%" }}>
                <DownloadButton type="submit" disabled={!canDownload}>
                  {downloading ? "Preparing download…" : buttonLabel}
                </DownloadButton>
                {error ? (
                  <ErrorMessage role="alert" $font="body-3">
                    {error}
                  </ErrorMessage>
                ) : null}
              </div>
            </ActionCell>
          </ActionBar>
        </Expanded>
      ) : null}
    </Section>
  );
};
