"use client";

import { FC, useCallback } from "react";

import errorReporter from "@/common-lib/error-reporter";
import ConditionalScript from "@/components/GenericPagesComponents/ConditionalScript";
import OakError from "@/errors/OakError";
import isBrowser from "@/utils/isBrowser";

if (isBrowser) {
  window._hsq = window._hsq || [];
}

export type HubspotConfig = {
  portalId: string;
  scriptDomain: string;
};

type HubspotScriptProps = HubspotConfig & {
  shouldLoad: boolean;
  onLoad: () => void;
};
const HubspotScript: FC<HubspotScriptProps> = (props) => {
  const { scriptDomain, portalId } = props;
  const onError = useCallback(() => {
    const error = new OakError({
      code: "hubspot/script-failed-to-load",
    });
    errorReporter("HubspotScript.tsx")(error);
  }, []);

  return (
    <ConditionalScript
      type="text/javascript"
      id="hs-script-loaded"
      async
      defer
      {...props}
      src={`//${scriptDomain}/${portalId}.js`}
      onError={onError}
    />
  );
};

export default HubspotScript;
