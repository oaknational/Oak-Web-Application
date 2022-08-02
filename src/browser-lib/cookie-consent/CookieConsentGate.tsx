import { FC, ReactNode } from "react";

import { ServiceType } from "./types";
import useHasConsentedTo from "./useHasConsentedTo";

type CookieConsentGateProps = {
  serviceType: ServiceType;
  children: ReactNode;
};
/**
 * CookieConsentGate will conditionally render it's children if the user
 * has consented to the service whose name is pass as prop
 * 'serviceType'.
 */
const CookieConsentGate: FC<CookieConsentGateProps> = (props) => {
  const { serviceType, children } = props;
  const hasConsented = useHasConsentedTo(serviceType);

  if (!hasConsented) {
    return null;
  }

  return <>{children}</>;
};

export default CookieConsentGate;
