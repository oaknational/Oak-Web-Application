import { useEffect, useState } from "react";

export const referrerSources = {
  google: "google",
  direct: "direct",
  internal: "internal",
  external: "external",
};

const useReferrer = () => {
  const [source, setSource] = useState<
    (typeof referrerSources)[keyof typeof referrerSources] | null
  >(null);
  useEffect(() => {
    const referrer = document.referrer;
    switch (true) {
      case referrer.includes(window.location.hostname):
        setSource(referrerSources.internal);
        break;
      case referrer === "":
        setSource(referrerSources.direct);
        break;
      case referrer.includes("google"):
        setSource(referrerSources.google);
        break;
      default:
        setSource(referrerSources.external);
    }
  }, []);
  return source;
};

export default useReferrer;
