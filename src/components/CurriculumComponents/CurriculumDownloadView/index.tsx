import { OakBox, OakSecondaryLink } from "@oaknational/oak-components";
import { FC, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { DownloadType, School } from "./helper";
import SignedOutFlow from "./SignedOutFlow";
import SignedInFlow from "./SignedInFlow";

export type CurriculumDownloadViewData = {
  schools: School[];
  schoolId?: string;
  schoolName?: string;
  email?: string;
  downloadTypes: DownloadType[];
  termsAndConditions?: boolean;
  schoolNotListed?: boolean;
};

export type CurriculumDownloadViewProps = {
  isSubmitting: boolean;
  data: CurriculumDownloadViewData;
  schools: School[];
  onChange?: (value: CurriculumDownloadViewData) => void;
  onSubmit?: (value: CurriculumDownloadViewData) => void;
  onBackToKs4Options?: () => void;
  availableDownloadTypes: DownloadType[];
  submitError?: string;
};

const CurriculumDownloadView: FC<CurriculumDownloadViewProps> = (props) => {
  const [downloadTypes, setDownloadTypes] = useState(
    props.availableDownloadTypes,
  );
  const user = useUser();

  return (
    <OakBox $color="text-primary">
      {props.onBackToKs4Options && (
        <OakBox $mb="spacing-24">
          <OakSecondaryLink
            element="button"
            data-testid="back-to-downloads-link"
            iconName="chevron-left"
            onClick={props.onBackToKs4Options}
          >
            Back to KS4 options
          </OakSecondaryLink>
        </OakBox>
      )}
      {user.isLoaded && (
        <>
          {!user.isSignedIn && (
            <SignedOutFlow
              {...props}
              onChangeDownloadTypes={setDownloadTypes}
              downloadTypes={downloadTypes}
              availableDownloadTypes={props.availableDownloadTypes}
            />
          )}
          {user.isSignedIn && (
            <SignedInFlow
              {...props}
              user={user}
              downloadTypes={downloadTypes}
              onChangeDownloadTypes={setDownloadTypes}
              availableDownloadTypes={props.availableDownloadTypes}
            />
          )}
        </>
      )}
    </OakBox>
  );
};

export default CurriculumDownloadView;
