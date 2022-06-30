import { FC, ReactNode } from "react";

import { useCookieConsents } from "../../context/CookieConsents/CookieConsents";

type ConsentGateProps = {
  policySlug: string;
  children: ReactNode;
};
const ConsentGate: FC<ConsentGateProps> = (props) => {
  const { policySlug, children } = props;
  const { isConsented } = useCookieConsents();

  if (!isConsented(policySlug)) {
    return null;
  }

  return <>{children}</>;
};

export default ConsentGate;
