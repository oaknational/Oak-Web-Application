import { FC } from "react";
import { OakBox, OakFlex, OakHeading } from "@oaknational/oak-components";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";

import { ResourcePageDetailsCompletedProps } from "@/components/TeacherComponents/ResourcePageDetailsCompleted/ResourcePageDetailsCompleted";
import { ResourcePageSchoolDetailsProps } from "@/components/TeacherComponents/ResourcePageSchoolDetails/ResourcePageSchoolDetails";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { DelayedLoadingSpinner } from "@/components/TeacherComponents/ResourcePageLayout/ResourcePageLayout";
import CopyrightNotice from "@/components/TeacherComponents/CopyrightNotice";
import FieldError from "@/components/SharedComponents/FieldError";

type DownloadPageWithAccordionProps = ResourcePageDetailsCompletedProps &
  ResourcePageSchoolDetailsProps & {
    geoRestricted: boolean;
    loginRequired: boolean;
    downloadsRestricted: boolean;
    handleToggleSelectAll: () => void;
    selectAllChecked: boolean;
    errors: FieldErrors<ResourceFormProps>;
    cardGroup: React.ReactNode;
    showLoading: boolean;
    showNoResources: boolean;
    hideSelectAll?: boolean;
    schoolId?: string;
    register: UseFormRegister<ResourceFormProps>;
    control: Control<ResourceFormProps>;
    showPostAlbCopyright: boolean;
    showSavedDetails: boolean;
    cta: React.ReactNode;
    resourcesHeader?: string;
    triggerForm: UseFormTrigger<ResourceFormProps>;
    apiError?: string | null;
    updatedAt: string;
    showTermsAgreement: boolean;
    isLoading: boolean;
    showRiskAssessmentBanner?: boolean;
  };

// TODO: Rename component if experiment is successful
const DownloadPageWithAccordion: FC<DownloadPageWithAccordionProps> = (
  props: DownloadPageWithAccordionProps,
) => {
  return (
    <OakFlex $justifyContent={"center"}>
      <OakFlex
        $maxWidth={"all-spacing-22"}
        $flexDirection={"column"}
        $gap={"space-between-l"}
      >
        <OakHeading tag="h1" $font={["heading-5", "heading-4"]}>
          Download
        </OakHeading>
        {props.isLoading ? (
          <OakBox $minHeight="all-spacing-21">
            <DelayedLoadingSpinner $delay={300} data-testid="loading" />
          </OakBox>
        ) : (
          <DownloadPageWithAccordionContent {...props} />
        )}
      </OakFlex>
    </OakFlex>
  );
};

const DownloadPageWithAccordionContent = (
  props: DownloadPageWithAccordionProps,
) => {
  const hasFormErrors = Object.keys(props.errors).length > 0;
  // const showFormErrors = hasFormErrors && !props.downloadsRestricted;
  // const showForm = props.showTermsAgreement && !props.downloadsRestricted;
  const hideCallToAction = props.downloadsRestricted;

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-l"}>
      {!hideCallToAction && props.cta}
      {props.apiError && !hasFormErrors && (
        <FieldError
          id="download-error"
          data-testid="download-error"
          variant={"large"}
          withoutMarginBottom
          ariaLive="polite"
        >
          {props.apiError}
        </FieldError>
      )}
      <CopyrightNotice
        fullWidth
        showPostAlbCopyright={props.showPostAlbCopyright}
        openLinksExternally={true}
        copyrightYear={props.updatedAt}
      />
    </OakFlex>
  );
};

export default DownloadPageWithAccordion;
