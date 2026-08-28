"use client";

import {
  getMediaQuery,
  OakCheckBox,
  OakHeading,
  OakIcon,
  OakJauntyAngleLabel,
  OakLink,
  OakP,
  OakTextInput,
  parseColor,
} from "@oaknational/oak-components";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";
import { NationalCurriculumInsightsSelect } from "./NationalCurriculumInsightsSelect";

import type { NationalCurriculumInsightsModule } from "@/common-lib/cms-types/nationalCurriculumInsights";
import { EDU_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { MultiSelect } from "@/components/SharedComponents/MultiSelect";

type DownloadSection = Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsDownloadSection" }
>;

const Section = styled.section<{ $sticky: boolean }>`
  width: 100%;
  background: ${parseColor("bg-primary")};

  ${({ $sticky }) =>
    $sticky
      ? `
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 20;
        display: flex;
        flex-direction: column;
        max-height: 100dvh;
        box-shadow: 0 -4px 16px rgb(0 0 0 / 16%);
      `
      : ""}
`;

const HeaderButton = styled.button`
  display: block;
  width: 100%;
  min-height: 64px;
  padding: 10px 20px;
  border: 0;
  border-top: 2px solid ${parseColor("border-decorative2-stronger")};
  background: ${parseColor("bg-decorative2-main")};
  color: ${parseColor("text-primary")};
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 4px solid ${parseColor("border-decorative5")};
    outline-offset: -4px;
  }

  @media (${getMediaQuery("desktop")}) {
    min-height: 100px;
    padding: 19px 20px;
  }
`;

const HeaderInner = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  min-height: 40px;
  margin: 0 auto;

  @media (${getMediaQuery("desktop")}) {
    min-height: 60px;
    padding: 0 97px;
    box-sizing: border-box;
  }
`;

const HeaderIcon = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  flex: 0 0 60px;
  margin-right: 16px;
  border-radius: 50%;
  background: ${parseColor("bg-primary")};
  color: ${parseColor("icon-primary")};

  @media (max-width: 1279px) {
    display: ${({ $expanded }) => ($expanded ? "none" : "inline-flex")};
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }
`;

const HeaderHeading = styled.span<{ $expanded: boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;

  @media (max-width: 1279px) {
    display: ${({ $expanded }) => ($expanded ? "none" : "inline")};
  }
`;

const HeaderCta = styled.span<{ $expanded: boolean }>`
  display: none;
  min-height: 28px;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${parseColor("bg-btn-primary")};
  color: ${parseColor("text-inverted")};
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.5px;
  margin-left: 16px;

  @media (max-width: 1279px) {
    display: ${({ $expanded }) => ($expanded ? "inline-flex" : "none")};
    margin-left: 0;
  }

  @media (${getMediaQuery("desktop")}) {
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

  @media (max-width: 1279px) {
    display: ${({ $expanded }) => ($expanded ? "none" : "inline-flex")};
  }
`;

const MobileClose = styled.span<{ $expanded: boolean }>`
  position: relative;
  display: ${({ $expanded }) => ($expanded ? "inline-flex" : "none")};
  width: 40px;
  height: 40px;
  margin-left: auto;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    position: absolute;
    width: 24px;
    height: 2px;
    background: currentColor;
    content: "";
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }

  @media (${getMediaQuery("desktop")}) {
    display: none;
  }
`;

const Expanded = styled.form<{ $sticky: boolean }>`
  width: 100%;
  background: ${parseColor("bg-primary")};

  ${({ $sticky }) =>
    $sticky
      ? `
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
      `
      : ""}
`;

const Columns = styled.div`
  position: relative;
  display: grid;
  max-width: 1280px;
  margin: 0 auto;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: minmax(0, 53%) minmax(0, 47%);

    &::after {
      position: absolute;
      top: 24px;
      bottom: 24px;
      left: 53%;
      width: 1px;
      background: ${parseColor("grey30")};
      content: "";
      pointer-events: none;
    }
  }
`;

const Column = styled.div<{
  $activeMobileStage: "details" | "subjects";
  $mobileStage: "details" | "subjects";
}>`
  box-sizing: border-box;
  min-width: 0;
  padding: 32px 20px 40px;
  display: ${({ $activeMobileStage, $mobileStage }) =>
    $activeMobileStage === $mobileStage ? "block" : "none"};

  @media (${getMediaQuery("desktop")}) {
    display: block;
    min-height: 632px;
    padding: 24px 64px 0 0;

    & + & {
      padding-right: 0;
      padding-left: 64px;
    }
  }
`;

const MobileSubjectButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 64px;
  margin-top: 32px;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 2px solid ${parseColor("border-primary")};
  border-radius: 4px;
  background: ${parseColor("bg-primary")};
  color: ${parseColor("text-primary")};
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;

  &:focus-visible {
    outline: 4px solid ${parseColor("border-decorative5")};
    outline-offset: 2px;
  }

  @media (${getMediaQuery("desktop")}) {
    display: none;
  }
`;

const MobileBackButton = styled.button`
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: ${parseColor("text-primary")};
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  @media (${getMediaQuery("desktop")}) {
    display: none;
  }
`;

const DesktopDownloadsHeader = styled.div`
  display: none;

  @media (${getMediaQuery("desktop")}) {
    display: block;
  }
`;

const MobileDownloadsHeader = styled.div`
  display: block;
  margin-top: 16px;

  @media (${getMediaQuery("desktop")}) {
    display: none;
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
`;

const SelectField = styled(Field)`
  button {
    min-height: 64px;
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
  background: ${parseColor("bg-neutral-stronger")};
`;

const ActionBar = styled.div<{ $activeMobileStage: "details" | "subjects" }>`
  display: grid;
  max-width: 1280px;
  min-height: 80px;
  margin: 0 auto;
  background: ${parseColor("bg-primary")};

  @media (max-width: 1279px) {
    display: ${({ $activeMobileStage }) =>
      $activeMobileStage === "details" ? "grid" : "none"};
  }

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
    padding: 12px 0 12px 64px;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 2px solid ${parseColor("border-primary")};
  border-radius: 4px;
  background: ${parseColor("bg-btn-primary")};
  color: ${parseColor("text-inverted")};
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;

  &:disabled {
    border-color: ${parseColor("border-neutral")};
    background: ${parseColor("bg-btn-primary-disabled")};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 4px solid ${parseColor("border-decorative5")};
    outline-offset: 2px;
  }
`;

const ErrorMessage = styled(OakP)`
  margin: 12px 0 0;
  /* No Oak theme token currently matches the design's #B00020. */
  color: #b00020;
`;

const responseFilename = (response: Response) => {
  const explicitFilename = response.headers.get("x-filename");
  if (explicitFilename) return explicitFilename;
  const disposition = response.headers.get("content-disposition") ?? "";
  const filename = /filename="?([^";]+)"?/i.exec(disposition);
  return filename?.[1] ?? "Curriculum insights";
};

export const NationalCurriculumInsightsDownload = ({
  data,
  section,
}: {
  data: NationalCurriculumInsightsRouteData;
  section: DownloadSection;
}) => {
  const formId = useId().replace(/:/g, "");
  const expandedRef = useRef<HTMLFormElement>(null);
  const sticky = data.route.kind === "hub";
  const [expanded, setExpanded] = useState(false);
  const [mobileStage, setMobileStage] = useState<"details" | "subjects">(
    "details",
  );
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [schoolNotListed, setSchoolNotListed] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!expanded) return;
    expandedRef.current?.scrollTo?.({ top: 0 });
  }, [expanded, mobileStage]);

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
      const query = new URLSearchParams();
      selectedValues.forEach((selection) =>
        query.append("selection", selection),
      );
      const response = await fetch(
        `/api/national-curriculum-insights/download?${query.toString()}`,
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
    <Section data-insights-module="downloads" $sticky={sticky}>
      <HeaderButton
        type="button"
        aria-expanded={expanded}
        aria-controls={`${formId}-content`}
        onClick={() => {
          setExpanded((value) => !value);
          setMobileStage("details");
        }}
      >
        <HeaderInner>
          <HeaderIcon $expanded={expanded} aria-hidden="true">
            <OakIcon
              iconName="worksheet"
              $width="spacing-32"
              $height="spacing-32"
            />
          </HeaderIcon>
          <HeaderHeading $expanded={expanded}>
            {section.barHeading}
          </HeaderHeading>
          <HeaderCta $expanded={expanded}>{section.barCtaLabel}</HeaderCta>
          <Toggle $expanded={expanded} aria-hidden="true" />
          <MobileClose $expanded={expanded} aria-hidden="true" />
        </HeaderInner>
      </HeaderButton>

      {expanded ? (
        <Expanded
          ref={expandedRef}
          id={`${formId}-content`}
          onSubmit={submit}
          noValidate
          $sticky={sticky}
        >
          <Columns>
            <Column $activeMobileStage={mobileStage} $mobileStage="details">
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
                <SelectField>
                  <NationalCurriculumInsightsSelect
                    id={`${formId}-role`}
                    name="role"
                    label="Role (required)"
                    placeholder="Select your role"
                    options={EDU_ROLES.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                    value={role}
                    onChange={setRole}
                  />
                </SelectField>
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
              <MobileSubjectButton
                type="button"
                onClick={() => setMobileStage("subjects")}
              >
                <span>
                  {selectedValues.length > 0
                    ? `${selectedValues.length} selected`
                    : "Select subjects"}
                </span>
                <OakIcon iconName="arrow-right" />
              </MobileSubjectButton>
            </Column>

            <Column $activeMobileStage={mobileStage} $mobileStage="subjects">
              <MobileBackButton
                type="button"
                onClick={() => setMobileStage("details")}
              >
                <OakIcon iconName="arrow-left" />
                Back
              </MobileBackButton>
              <MobileDownloadsHeader>
                <OakHeading tag="h2" $font="heading-6">
                  Select subjects
                </OakHeading>
              </MobileDownloadsHeader>
              <DesktopDownloadsHeader>
                <OakHeading tag="h2" $font="heading-6">
                  {section.downloadsHeading}
                </OakHeading>
                <OakP $font="body-2">{section.downloadsIntroduction}</OakP>
              </DesktopDownloadsHeader>
              <Selector>
                <MultiSelect
                  id={`${formId}-subjects`}
                  groups={groups}
                  selectedValues={selectedValues}
                  onChange={setSelectedValues}
                  placeholder="Select subjects"
                  mobileTitle="Download subjects"
                  hideMobileHeader
                  size="large"
                  mobileConfirmLabel="Confirm selection"
                  onMobileConfirm={() => setMobileStage("details")}
                  selectedItemsLabel="Selected subjects"
                  groupSelectLabel={(group) =>
                    `All ${group.label.toLowerCase()} subjects`
                  }
                  data-testid="curriculum-insights-subjects"
                />
              </Selector>
            </Column>
          </Columns>
          <ActionBar $activeMobileStage={mobileStage}>
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
