import { OverlayContainer } from "@react-aria/overlays";
import { FC, useState } from "react";

import {
  useCookieConsents,
  isPolicyConsentedTo,
  Policy,
  policyToConsent,
  CookieConsents,
} from "../../context/CookieConsents/CookieConsents";
import Flex from "../Flex";
import ModalDialog from "../ModalDialog/ModalDialog";
import Toggle from "../Toggle";

const CookieModal: FC = () => {
  const { saveConsents, policies, defaultConsents, modalOpen, setModalOpen } =
    useCookieConsents();
  // local consents has previously confirmed consent choices, with updated
  // policy versions
  const [localConsents, setLocalConsents] =
    useState<CookieConsents>(defaultConsents);

  const isEnabled = isPolicyConsentedTo(localConsents);

  const onConsentToggle = (policy: Policy) => {
    const enabled = !isEnabled(policy);
    setLocalConsents({
      ...localConsents,
      [policy.id]: policyToConsent(policy, enabled),
    });
  };

  const closeModal = () => setModalOpen(false);

  const onConfirmChoices = () => {
    console.log("saving", localConsents);

    saveConsents(localConsents);
    closeModal();
  };

  if (!modalOpen) {
    return null;
  }

  return (
    <OverlayContainer>
      <ModalDialog title="Cookie Prefences" isOpen onClose={closeModal}>
        {policies.map((policy) => (
          <Flex>
            <div key={`CookiePolicyDetails-policies-${policy.id}`}>
              <h3>{policy.name}</h3>
              <p>{policy.description}</p>
              <h3>Who do we share data with?</h3>
              <p>
                {policy.providers.map((provider) => provider.name).join(", ")}
              </p>
              <h3>Consent</h3>
              <Toggle
                checked={isEnabled(policy)}
                disabled={policy.required}
                labelOn="On"
                labelOff="Off"
                onChange={() => onConsentToggle(policy)}
              />
            </div>
          </Flex>
        ))}
        <button onClick={onConfirmChoices}>Confirm choices</button>
      </ModalDialog>
    </OverlayContainer>
  );
};

export default CookieModal;
