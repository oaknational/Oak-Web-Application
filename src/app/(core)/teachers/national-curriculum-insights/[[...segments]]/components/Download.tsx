"use client";

import {
  OakBox,
  OakFlex,
  OakCheckBox,
  OakFieldError,
  OakFocusIndicator,
  OakGrid,
  OakGridArea,
  OakPrimaryButton,
  OakSecondaryButton,
  OakTertiaryButton,
  OakHeading,
  OakIcon,
  OakJauntyAngleLabel,
  OakLink,
  OakP,
  OakTextInput,
  parseSpacing,
} from "@oaknational/oak-components";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsSelect } from "./Select";

import type { NationalCurriculumInsightsModule } from "@/common-lib/cms-types/nationalCurriculumInsights";
import { EDU_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { MultiSelect } from "@/components/SharedComponents/MultiSelect";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

const reportError = errorReporter("NationalCurriculumInsightsDownload");

type DownloadSection = Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsDownloadSection" }
>;

type DownloadFormValues = {
  name: string;
  school: string;
  schoolNotListed: boolean;
  role: string;
  email: string;
  acceptedTerms: boolean;
  selectedValues: string[];
};

const Section = styled(OakFlex)<{ $sticky: boolean }>`
  ${({ $sticky }) =>
    $sticky
      ? "position: fixed; inset: auto 0 0; z-index: 20; max-height: 100dvh;"
      : ""}
`;

const HeaderButton = styled(OakBox)`
  font: inherit;
  cursor: pointer;
`;

const Expanded = styled(OakBox)<{ $sticky: boolean }>`
  ${({ $sticky }) =>
    $sticky
      ? "min-height: 0; overflow-y: auto; overscroll-behavior: contain;"
      : ""}
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
  const downloadInFlight = useRef(false);
  const sticky = data.route.kind === "hub";
  const [expanded, setExpanded] = useState(false);
  const [mobileStage, setMobileStage] = useState<"details" | "subjects">(
    "details",
  );
  const { control, watch, handleSubmit } = useForm<DownloadFormValues>({
    defaultValues: {
      name: "",
      school: "",
      schoolNotListed: false,
      role: "",
      email: "",
      acceptedTerms: false,
      selectedValues: [],
    },
    shouldUnregister: false,
  });
  const { name, school, schoolNotListed, role, acceptedTerms, selectedValues } =
    watch();
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
          options: data.subjects
            .filter(({ tabs }) => tabs.some(({ kind }) => kind === phase))
            .map(({ slug, title }) => ({
              label: title,
              value: `${slug}:${phase}`,
            })),
        }))
        .filter(({ options }) => options.length > 0),
    [data.subjects],
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

  const submit = async () => {
    if (!canDownload || downloadInFlight.current) return;

    downloadInFlight.current = true;
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
      try {
        createAndClickHiddenDownloadLink(url, {
          filename: responseFilename(response),
          removeAfterClick: true,
          openInNewTabWhenEmbedded: false,
        });
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (downloadError) {
      if (downloadError instanceof TypeError) {
        reportError(
          new OakError({
            code: "downloads/failed-to-fetch",
            originalError: downloadError,
          }),
        );
      }
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "The download could not be made.",
      );
    } finally {
      downloadInFlight.current = false;
      setDownloading(false);
    }
  };

  return (
    <Section
      as="section"
      data-insights-module="downloads"
      $sticky={sticky}
      $width="100%"
      $flexDirection="column"
      $background="bg-primary"
      $dropShadow={sticky ? "drop-shadow-centred-standard" : undefined}
    >
      <OakFocusIndicator $width="100%">
        <HeaderButton
          as="button"
          $display="block"
          $width="100%"
          $minHeight={["spacing-64", "spacing-64", "spacing-100"]}
          $ph="spacing-20"
          $pv={["spacing-12", "spacing-12", "spacing-20"]}
          $ba="border-solid-none"
          $bt="border-solid-m"
          $borderColor="border-decorative2-stronger"
          $background="bg-decorative2-main"
          $color="text-primary"
          type="button"
          aria-label={`${section.barHeading} ${section.barCtaLabel}`}
          aria-expanded={expanded}
          aria-controls={`${formId}-content`}
          onClick={() => {
            setExpanded((value) => !value);
            setMobileStage("details");
          }}
        >
          <OakFlex
            as="span"
            $alignItems="center"
            $width="100%"
            $maxWidth="spacing-1280"
            $minHeight={["spacing-40", "spacing-40", "spacing-56"]}
            $mh="auto"
            $ph={["spacing-0", "spacing-0", "spacing-92"]}
          >
            <OakFlex
              as="span"
              $display={[
                expanded ? "none" : "inline-flex",
                null,
                "inline-flex",
              ]}
              $alignItems="center"
              $justifyContent="center"
              $width={["spacing-40", "spacing-40", "spacing-56"]}
              $height={["spacing-40", "spacing-40", "spacing-56"]}
              $flexShrink={0}
              $mr="spacing-16"
              $borderRadius="border-radius-circle"
              $background="bg-primary"
              aria-hidden="true"
            >
              <OakIcon
                iconName="worksheet"
                $width="spacing-32"
                $height="spacing-32"
              />
            </OakFlex>
            <OakBox
              as="span"
              $display={[expanded ? "none" : "inline", null, "inline"]}
              $font="heading-7"
              $textAlign="left"
            >
              {section.barHeading}
            </OakBox>
            <OakBox
              as="span"
              $display={[
                expanded ? "inline-flex" : "none",
                null,
                "inline-flex",
              ]}
              $background="bg-btn-primary"
              $color="text-inverted"
              $font="heading-light-7"
              $pa="spacing-4"
              $ph="spacing-8"
              $borderRadius="border-radius-m"
              $ml={["spacing-0", "spacing-0", "spacing-16"]}
            >
              {section.barCtaLabel}
            </OakBox>
            <OakIcon
              iconName={expanded ? "chevron-down" : "chevron-up"}
              $display={[
                expanded ? "none" : "inline-flex",
                null,
                "inline-flex",
              ]}
              $ml="auto"
              $width="spacing-24"
              $height="spacing-24"
              aria-hidden="true"
            />
            <OakIcon
              iconName="cross"
              $display={[expanded ? "block" : "none", null, "none"]}
              $ml="auto"
              $width="spacing-32"
              $height="spacing-32"
              aria-hidden="true"
            />
          </OakFlex>
        </HeaderButton>
      </OakFocusIndicator>

      {expanded ? (
        <Expanded
          as="form"
          $width="100%"
          $background="bg-primary"
          ref={expandedRef}
          id={`${formId}-content`}
          onSubmit={handleSubmit(submit)}
          noValidate
          $sticky={sticky}
        >
          <OakGrid
            $maxWidth="spacing-1280"
            $mh="auto"
            $ph={["spacing-20", "spacing-20", "spacing-32"]}
          >
            <OakGridArea
              $colSpan={[12, 12, 6]}
              $display={[
                mobileStage === "details" ? "block" : "none",
                null,
                "block",
              ]}
              $pt={["spacing-32", "spacing-32", "spacing-24"]}
              $pb="spacing-40"
              $pr={["spacing-0", "spacing-0", "spacing-64"]}
            >
              <OakHeading tag="h2" $font="heading-6">
                {section.detailsHeading}
              </OakHeading>
              <OakFlex
                $flexDirection="column"
                $gap="spacing-32"
                $mt="spacing-32"
              >
                <OakBox $position="relative" $width="100%">
                  <OakJauntyAngleLabel
                    as="label"
                    htmlFor={`${formId}-name`}
                    label="Name (required)"
                    $background="bg-decorative5-main"
                    $font="heading-7"
                    $position="absolute"
                    $top={`-${parseSpacing("spacing-20")}`}
                    $left="spacing-8"
                    $zIndex="in-front"
                  />
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <OakTextInput
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        id={`${formId}-name`}
                        placeholder="Type your name"
                        autoComplete="name"
                        wrapperWidth="100%"
                        $height="spacing-64"
                      />
                    )}
                  />
                </OakBox>
                <OakFlex $flexDirection="column" $gap="spacing-16">
                  <OakBox $position="relative" $width="100%">
                    <OakJauntyAngleLabel
                      as="label"
                      htmlFor={`${formId}-school`}
                      label="School (required)"
                      $background="bg-decorative5-main"
                      $font="heading-7"
                      $position="absolute"
                      $top={`-${parseSpacing("spacing-20")}`}
                      $left="spacing-8"
                      $zIndex="in-front"
                    />
                    <Controller
                      control={control}
                      name="school"
                      render={({ field }) => (
                        <OakTextInput
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          id={`${formId}-school`}
                          placeholder="Type school name, postcode, or ‘homeschool’"
                          disabled={schoolNotListed}
                          autoComplete="organization"
                          wrapperWidth="100%"
                          $height="spacing-64"
                        />
                      )}
                    />
                  </OakBox>
                  <Controller
                    control={control}
                    name="schoolNotListed"
                    render={({ field }) => (
                      <OakCheckBox
                        id={`${formId}-school-not-listed`}
                        name="school-not-listed"
                        value="school-not-listed"
                        displayValue="My school isn't listed"
                        checked={field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                      />
                    )}
                  />
                </OakFlex>
                <OakBox $width="100%">
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <NationalCurriculumInsightsSelect
                        id={`${formId}-role`}
                        name={field.name}
                        label="Role (required)"
                        placeholder="Select your role"
                        options={EDU_ROLES.map((option) => ({
                          label: option,
                          value: option,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </OakBox>
                <OakBox $position="relative" $width="100%">
                  <OakJauntyAngleLabel
                    as="label"
                    htmlFor={`${formId}-email`}
                    label="Email (Optional)"
                    $background="bg-decorative5-main"
                    $font="heading-7"
                    $position="absolute"
                    $top={`-${parseSpacing("spacing-20")}`}
                    $left="spacing-8"
                    $zIndex="in-front"
                  />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <OakTextInput
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        id={`${formId}-email`}
                        type="email"
                        placeholder="Enter email address here"
                        autoComplete="email"
                        wrapperWidth="100%"
                        $height="spacing-64"
                      />
                    )}
                  />
                </OakBox>
                <OakP $maxWidth="spacing-640" $font="body-3" $mv="spacing-0">
                  Join over 200k teachers and get free resources and other
                  helpful content by email. Unsubscribe at any time. Read our{" "}
                  <OakLink href="/legal/privacy-policy" target="_blank">
                    privacy policy
                  </OakLink>
                  .
                </OakP>
                <OakFlex
                  $minHeight="spacing-56"
                  $alignItems="center"
                  $pa="spacing-8"
                  $borderRadius="border-radius-s"
                  $background="bg-neutral-stronger"
                >
                  <Controller
                    control={control}
                    name="acceptedTerms"
                    render={({ field }) => (
                      <OakCheckBox
                        id={`${formId}-terms`}
                        name="terms"
                        value="terms"
                        displayValue="I accept the terms and conditions (required)"
                        checked={field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                      />
                    )}
                  />
                </OakFlex>
              </OakFlex>
              <OakBox $display={["block", "block", "none"]} $mt="spacing-32">
                <OakSecondaryButton
                  width="100%"
                  iconName="arrow-right"
                  isTrailingIcon
                  type="button"
                  onClick={() => setMobileStage("subjects")}
                >
                  <span>
                    {selectedValues.length > 0
                      ? `${selectedValues.length} selected`
                      : "Select subjects"}
                  </span>
                </OakSecondaryButton>
              </OakBox>
            </OakGridArea>

            <OakGridArea
              $colSpan={[12, 12, 6]}
              $display={[
                mobileStage === "subjects" ? "block" : "none",
                null,
                "block",
              ]}
              $pt={["spacing-32", "spacing-32", "spacing-24"]}
              $pb="spacing-40"
              $pl={["spacing-0", "spacing-0", "spacing-64"]}
              $bl={["border-solid-none", "border-solid-none", "border-solid-s"]}
              $borderColor={[null, null, "border-neutral-lighter"]}
            >
              <OakBox $display={["block", "block", "none"]}>
                <OakTertiaryButton
                  iconName="arrow-left"
                  type="button"
                  onClick={() => setMobileStage("details")}
                >
                  Back
                </OakTertiaryButton>
              </OakBox>
              <OakBox $display={["block", "block", "none"]} $mt="spacing-16">
                <OakHeading tag="h2" $font="heading-6">
                  Select subjects
                </OakHeading>
              </OakBox>
              <OakBox $display={["none", "none", "block"]}>
                <OakHeading tag="h2" $font="heading-6">
                  {section.downloadsHeading}
                </OakHeading>
                <OakP $font="body-2">{section.downloadsIntroduction}</OakP>
              </OakBox>
              <OakBox $width="100%" $mt="spacing-24">
                <Controller
                  control={control}
                  name="selectedValues"
                  render={({ field }) => (
                    <MultiSelect
                      id={`${formId}-subjects`}
                      groups={groups}
                      selectedValues={field.value}
                      onChange={field.onChange}
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
                  )}
                />
              </OakBox>
            </OakGridArea>
          </OakGrid>
          <OakBox
            $display={[
              mobileStage === "details" ? "grid" : "none",
              null,
              "grid",
            ]}
          >
            <OakGrid
              $maxWidth="spacing-1280"
              $mh="auto"
              $ph={["spacing-20", "spacing-20", "spacing-32"]}
              $pv="spacing-12"
            >
              <OakGridArea
                $colSpan={[12, 12, 6]}
                $colStart={[1, 1, 7]}
                $pl={["spacing-0", "spacing-0", "spacing-64"]}
              >
                <OakBox $width="100%">
                  <OakPrimaryButton
                    type="submit"
                    width="100%"
                    textAlign="center"
                    disabled={!canDownload}
                  >
                    {downloading ? "Preparing download…" : buttonLabel}
                  </OakPrimaryButton>
                  {error ? (
                    <OakBox role="alert" $mt="spacing-12">
                      <OakFieldError>{error}</OakFieldError>
                    </OakBox>
                  ) : null}
                </OakBox>
              </OakGridArea>
            </OakGrid>
          </OakBox>
        </Expanded>
      ) : null}
    </Section>
  );
};
