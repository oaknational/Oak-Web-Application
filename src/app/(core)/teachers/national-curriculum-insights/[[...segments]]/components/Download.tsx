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
  OakTertiaryButton,
  OakHeading,
  OakIcon,
  OakLink,
  OakP,
  OakRadioButton,
  OakRadioGroup,
  OakSpan,
  OakTextInput,
} from "@oaknational/oak-components";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { FocusOn } from "react-focus-on";

import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsSelect } from "./Select";
import { useDownloadSelection } from "./useDownloadSelection";
import { NationalCurriculumInsightsFieldLabel } from "./FieldLabel";
import { NationalCurriculumInsightsDownloadConfirmation } from "./DownloadConfirmation";

import {
  nationalCurriculumInsightsOpenDownloadEvent,
  type NationalCurriculumInsightsOpenDownloadDetail,
} from "@/common-lib/urls/nationalCurriculumInsightsDownload";
import type { NationalCurriculumInsightsModule } from "@/common-lib/cms-types/nationalCurriculumInsights";
import { EDU_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { MultiSelect } from "@/components/SharedComponents/MultiSelect";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import { NEWSLETTER_COUNT } from "@/components/GenericPagesComponents/NewsletterForm/newsletterConstants";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";

const reportError = errorReporter("NationalCurriculumInsightsDownload");

type DownloadSection = Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsDownloadSection" }
>;

type DownloadFormValues = {
  name: string;
  schoolNotListed: boolean;
  role: string;
  email: string;
  acceptedTerms: boolean;
};

const getDocumentCountLabel = (count: number) => {
  if (count === 0) return "guidance";
  const noun = count === 1 ? "document" : "documents";
  return `${count} ${noun}`;
};

const getDownloadDialogProps = (expanded: boolean) =>
  expanded
    ? ({
        role: "dialog",
        "aria-modal": true,
        "aria-label": "Curriculum guidance download",
      } as const)
    : {};

const responseFilename = (response: Response) => {
  const explicitFilename = response.headers.get("x-filename");
  if (explicitFilename) return explicitFilename;
  const disposition = response.headers.get("content-disposition") ?? "";
  const filename = /filename="?([^";]+)"?/i.exec(disposition);
  return filename?.[1] ?? "Curriculum insights";
};

const DownloadHeader = ({
  formId,
  section,
  expanded,
  onToggle,
  buttonRef,
}: {
  formId: string;
  section: DownloadSection;
  expanded: boolean;
  onToggle: () => void;
  buttonRef: RefObject<HTMLButtonElement>;
}) => (
  <OakFocusIndicator $width="100%" style={{ flexShrink: 0 }}>
    <OakBox
      as="button"
      ref={buttonRef}
      $display="block"
      $width="100%"
      $minHeight={["spacing-64", "spacing-64", "spacing-100"]}
      $ph={["spacing-16", "spacing-16", "spacing-20"]}
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
      onClick={onToggle}
    >
      <OakFlex
        as="span"
        $alignItems="center"
        $width="100%"
        $maxWidth="spacing-1280"
        $minHeight={["spacing-40", "spacing-40", "spacing-56"]}
        $mh="auto"
        $ph="spacing-0"
      >
        <OakFlex
          as="span"
          $display={[expanded ? "none" : "inline-flex", null, "inline-flex"]}
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
          $display={[expanded ? "inline-flex" : "none", null, "inline-flex"]}
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
          $display={[expanded ? "none" : "inline-flex", null, "inline-flex"]}
          $ml="auto"
          $width="spacing-24"
          $height="spacing-24"
          aria-hidden="true"
        />
        <OakIcon
          iconName="cross"
          $display={[expanded ? "block" : "none", null, "none"]}
          $ml="auto"
          $width="spacing-24"
          $height="spacing-24"
          aria-hidden="true"
        />
      </OakFlex>
    </OakBox>
  </OakFocusIndicator>
);

const DownloadActions = ({
  mobileStage,
  canDownload,
  downloading,
  buttonLabel,
  error,
}: {
  mobileStage: "details" | "subjects";
  canDownload: boolean;
  downloading: boolean;
  buttonLabel: string;
  error: string | null;
}) => (
  <OakBox
    $display={[mobileStage === "details" ? "grid" : "none", null, "grid"]}
    $position="sticky"
    $bottom="spacing-0"
    $background="bg-primary"
    $zIndex="in-front"
  >
    <OakGrid
      $mh="auto"
      $ph={["spacing-20", "spacing-20", "spacing-56"]}
      $pv="spacing-16"
    >
      <OakGridArea
        $colSpan={[12, 12, 6]}
        $colStart={[1, 1, 7]}
        $pl={["spacing-0", "spacing-0", "spacing-32"]}
        $pr={["spacing-0", "spacing-0", "spacing-56"]}
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
);

export const NationalCurriculumInsightsDownload = ({
  data,
  section,
}: {
  data: NationalCurriculumInsightsRouteData;
  section: DownloadSection;
}) => {
  const formId = useId().replace(/:/g, "");
  const expandedRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const downloadInFlight = useRef(false);
  const { selectedValues, changeSelection, resetSelection } =
    useDownloadSelection(data);
  const {
    schools,
    schoolPickerInputValue,
    setSchoolPickerInputValue,
    setSelectedSchool,
  } = useSchoolPicker({ withHomeschool: true });
  const [expanded, setExpanded] = useState(false);
  const [mobileStage, setMobileStage] = useState<"details" | "subjects">(
    "subjects",
  );
  const { control, watch, handleSubmit } = useForm<DownloadFormValues>({
    defaultValues: {
      name: "",
      schoolNotListed: false,
      role: "",
      email: "",
      acceptedTerms: false,
    },
    shouldUnregister: false,
  });
  const { name, schoolNotListed, role, acceptedTerms } = watch();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    expandedRef.current?.scrollTo?.({ top: 0 });
    expandedRef.current?.focus({ preventScroll: true });
  }, [expanded, mobileStage, downloadComplete]);

  useEffect(() => {
    const openDownloads = (event: Event) => {
      const detail = (
        event as CustomEvent<NationalCurriculumInsightsOpenDownloadDetail>
      ).detail;
      returnFocusRef.current = detail?.returnFocusTo ?? headerRef.current;
      setMobileStage("subjects");
      setDownloadComplete(false);
      setExpanded(true);
    };
    window.addEventListener(
      nationalCurriculumInsightsOpenDownloadEvent,
      openDownloads,
    );
    return () =>
      window.removeEventListener(
        nationalCurriculumInsightsOpenDownloadEvent,
        openDownloads,
      );
  }, []);

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
              mobileLabel: `${title} ${phase}`,
              value: `${slug}:${phase}`,
            })),
        }))
        .filter(({ options }) => options.length > 0),
    [data.subjects],
  );

  const detailsComplete =
    name.trim().length > 0 &&
    (schoolNotListed || schoolPickerInputValue.trim().length > 0) &&
    role.length > 0 &&
    acceptedTerms;
  const canDownload =
    detailsComplete && selectedValues.length > 0 && !downloading;
  const buttonLabel = `${section.downloadButtonLabel} ${getDocumentCountLabel(selectedValues.length)} (.DOCX)`;

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
      resetSelection();
      setDownloadComplete(true);
    } catch (downloadError) {
      if (downloadError instanceof TypeError) {
        void reportError(
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
    <FocusOn
      enabled={expanded}
      autoFocus={false}
      scrollLock
      onEscapeKey={(event) => {
        // Native selects handle Escape themselves.
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("select")
        ) {
          return;
        }
        setExpanded(false);
      }}
      returnFocus={() => {
        const target = returnFocusRef.current ?? headerRef.current;
        if (target?.isConnected) target.focus();
        return false;
      }}
    >
      <OakFlex
        as="section"
        {...getDownloadDialogProps(expanded)}
        data-insights-module="downloads"
        $position="fixed"
        $bottom="spacing-0"
        $left="spacing-0"
        $right="spacing-0"
        $dropShadow="drop-shadow-centred-standard"
        $zIndex={expanded ? "modal-dialog" : "fixed-header"}
        $maxHeight="100vh"
        style={{
          maxHeight: "calc(100dvh - env(safe-area-inset-top))",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        $width="100%"
        $flexDirection="column"
        $background="bg-primary"
      >
        <DownloadHeader
          formId={formId}
          section={section}
          expanded={expanded}
          buttonRef={headerRef}
          onToggle={() => {
            if (!expanded) returnFocusRef.current = headerRef.current;
            setExpanded((value) => !value);
            setMobileStage("subjects");
            setDownloadComplete(false);
          }}
        />

        {expanded ? (
          <OakBox
            as="form"
            $width="100%"
            $background="bg-primary"
            ref={expandedRef}
            id={`${formId}-content`}
            onSubmit={handleSubmit(submit)}
            tabIndex={-1}
            aria-label="Curriculum guidance download"
            aria-busy={downloading}
            noValidate
            $minHeight="spacing-0"
            $overflowY="auto"
          >
            {downloadComplete ? (
              <NationalCurriculumInsightsDownloadConfirmation />
            ) : (
              <>
                <OakGrid
                  $mh="auto"
                  $ph={["spacing-0", "spacing-0", "spacing-56"]}
                >
                  <OakGridArea
                    $colSpan={[12, 12, 6]}
                    $colStart={1}
                    $display={[
                      mobileStage === "subjects" ? "block" : "none",
                      null,
                      "block",
                    ]}
                    $pt={["spacing-20", "spacing-20", "spacing-56"]}
                    $pb={["spacing-0", "spacing-0", "spacing-40"]}
                    $pr={["spacing-0", "spacing-0", "spacing-100"]}
                    $pl={["spacing-0", "spacing-0", "spacing-64"]}
                    $br={[
                      "border-solid-none",
                      "border-solid-none",
                      "border-solid-s",
                    ]}
                    $borderColor={[null, null, "border-neutral-lighter"]}
                  >
                    <OakBox $display={["none", "none", "block"]}>
                      <OakHeading tag="h2" $font="heading-6">
                        {section.downloadsHeading}
                      </OakHeading>
                      <OakP
                        $font="heading-light-6"
                        $mt="spacing-24"
                        $mb="spacing-0"
                      >
                        {section.downloadsIntroduction}
                      </OakP>
                    </OakBox>
                    <OakBox
                      $width="100%"
                      $mt={["spacing-0", "spacing-0", "spacing-40"]}
                    >
                      <MultiSelect
                        id={`${formId}-subjects`}
                        groups={groups}
                        selectedValues={selectedValues}
                        onChange={changeSelection}
                        placeholder="Select subjects to download"
                        mobileTitle="Download subjects"
                        hideMobileHeader
                        size="large"
                        mobileConfirmLabel="Confirm selection"
                        selectAllLabel="Select all subjects"
                        unselectAllLabel="Unselect all subjects"
                        onMobileConfirm={() => setMobileStage("details")}
                        selectedItemsLabel="Selected subjects"
                        groupSelectLabel={(group) =>
                          `All ${group.label.toLowerCase()} subjects`
                        }
                        data-testid="curriculum-insights-subjects"
                      />
                    </OakBox>
                  </OakGridArea>

                  <OakGridArea
                    $colSpan={[12, 12, 6]}
                    $colStart={[1, 1, 7]}
                    $display={[
                      mobileStage === "details" ? "block" : "none",
                      null,
                      "block",
                    ]}
                    $pt={["spacing-32", "spacing-32", "spacing-40"]}
                    $pb="spacing-40"
                    $pl={["spacing-20", "spacing-20", "spacing-32"]}
                    $pr={["spacing-20", "spacing-20", "spacing-56"]}
                  >
                    <OakBox
                      $display={["block", "block", "none"]}
                      $mb="spacing-32"
                    >
                      <OakTertiaryButton
                        iconName="arrow-left"
                        type="button"
                        onClick={() => setMobileStage("subjects")}
                      >
                        Back
                      </OakTertiaryButton>
                    </OakBox>
                    <OakHeading tag="h2" $font="heading-6">
                      {section.detailsHeading}
                    </OakHeading>
                    <OakFlex
                      $flexDirection="column"
                      $gap="spacing-20"
                      $mt="spacing-20"
                    >
                      <OakBox $position="relative" $width="100%">
                        <NationalCurriculumInsightsFieldLabel
                          htmlFor={`${formId}-name`}
                          label="Name (required)"
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
                              required
                              wrapperWidth="100%"
                              $height="spacing-64"
                            />
                          )}
                        />
                      </OakBox>
                      <OakFlex $flexDirection="column" $gap="spacing-16">
                        <ResourcePageSchoolPicker
                          hasError={false}
                          schools={schools}
                          label="School"
                          schoolPickerInputValue={schoolPickerInputValue}
                          setSchoolPickerInputValue={setSchoolPickerInputValue}
                          setSelectedSchool={setSelectedSchool}
                          required={!schoolNotListed}
                          disabled={schoolNotListed}
                          withHomeschool
                        />
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
                              onChange={(event) => {
                                field.onChange(event.target.checked);
                                if (event.target.checked) {
                                  setSelectedSchool(undefined);
                                  setSchoolPickerInputValue("");
                                }
                              }}
                            />
                          )}
                        />
                      </OakFlex>
                      <OakBox $width="100%">
                        <Controller
                          control={control}
                          name="role"
                          render={({ field }) => (
                            <>
                              <OakBox $display={["none", "none", "block"]}>
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
                              </OakBox>
                              <OakBox $display={["block", "block", "none"]}>
                                <OakRadioGroup
                                  name={field.name}
                                  label="What describes you best? (required)"
                                  value={field.value}
                                  onChange={(event) =>
                                    field.onChange(event.target.value)
                                  }
                                  $flexDirection="column"
                                  $gap="spacing-16"
                                >
                                  {EDU_ROLES.map((option, index) => (
                                    <OakRadioButton
                                      key={option}
                                      id={`${formId}-role-${index}`}
                                      label={option}
                                      value={option}
                                      required
                                    />
                                  ))}
                                </OakRadioGroup>
                              </OakBox>
                            </>
                          )}
                        />
                      </OakBox>
                      <OakBox $position="relative" $width="100%">
                        <NationalCurriculumInsightsFieldLabel
                          htmlFor={`${formId}-email`}
                          label="Email (Optional)"
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
                      <OakBox $maxWidth="spacing-640">
                        <OakP $font="body-3" $mv="spacing-0">
                          Join over {NEWSLETTER_COUNT} teachers and get free
                          resources and other helpful content by email.
                          Unsubscribe at any time. Read our{" "}
                          <OakLink href="/legal/privacy-policy" target="_blank">
                            privacy policy
                          </OakLink>
                          .
                        </OakP>
                      </OakBox>
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
                            <OakFlex
                              $gap="spacing-16"
                              $alignItems="center"
                              $width="100%"
                            >
                              <OakCheckBox
                                id={`${formId}-terms`}
                                name="terms"
                                value="terms"
                                displayValue=""
                                aria-label="I accept the terms and conditions (required)"
                                checked={field.value}
                                onChange={(event) =>
                                  field.onChange(event.target.checked)
                                }
                              />
                              <OakBox
                                as="label"
                                htmlFor={`${formId}-terms`}
                                $font="body-2"
                              >
                                I accept the{" "}
                                <OakLink
                                  href="/legal/terms-and-conditions"
                                  target="_blank"
                                  variant="secondary"
                                >
                                  terms and conditions
                                </OakLink>{" "}
                                <OakSpan>(required)</OakSpan>
                              </OakBox>
                            </OakFlex>
                          )}
                        />
                      </OakFlex>
                    </OakFlex>
                  </OakGridArea>
                </OakGrid>
                <DownloadActions
                  mobileStage={mobileStage}
                  canDownload={canDownload}
                  downloading={downloading}
                  buttonLabel={buttonLabel}
                  error={error}
                />
              </>
            )}
          </OakBox>
        ) : null}
      </OakFlex>
    </FocusOn>
  );
};
