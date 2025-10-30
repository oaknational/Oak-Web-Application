import { OakBox } from "@oaknational/oak-components";
import { FC, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { DownloadType, School } from "./helper";
import SignedOutFlow from "./SignedOutFlow";
import SignedInFlow from "./SignedInFlow";

import Button from "@/components/SharedComponents/Button";

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
    <OakBox $color="black">
      {props.onBackToKs4Options && (
        <OakBox $mb="space-between-m">
          <Button
            variant={"buttonStyledAsLink"}
            icon="chevron-left"
            data-testid="back-to-downloads-link"
            size="small"
            label="Back to KS4 options"
            onClick={props.onBackToKs4Options}
          />
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
              availableDownloadTypes={props.availableDownloadTypes}
            />
          )}
        </>
      )}
    </OakBox>
  );
};

export default CurriculumDownloadView;
