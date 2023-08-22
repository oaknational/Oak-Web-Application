import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { resolveOakHref } from "@/common-lib/urls";

const isSubPath = ({
  currentPath,
  href,
}: {
  currentPath: string;
  href: string;
}) => {
  if (href === "/") {
    return currentPath === "/";
  }

  const betaHomeHref = resolveOakHref({ page: "home", viewType: "teachers" });

  if (currentPath.startsWith(betaHomeHref + "/")) {
    return false;
  }

  return `${currentPath}/`.startsWith(`${href}/`);
};

type UseIsCurrentProps =
  | { href: string; keyStageSlug?: never }
  | { href?: never; keyStageSlug: string };

/**
 * Returns true if a menu link is should be styled as 'current',
 * i.e. if the link's href is a subpath of the current path.
 */
const useIsCurrent = (props: UseIsCurrentProps) => {
  const { href, keyStageSlug } = props;
  const { pathname: currentPath, asPath } = useRouter();
  const [isCurrent, setIsCurrent] = useState(false);
  // NB. We use useEffect here to avoid a server-side render error
  useEffect(() => {
    // Add in when href and keyStage at the same time or neither of them in also
    // throw new Error("useIsCurrent is not implemented");

    if (href) {
      const hash = asPath.split("#")[1];
      const isCurrentPath = isSubPath({
        currentPath,
        href,
      });
      setIsCurrent(isCurrentPath || hash === href.substring(1));
      return;
    }
    if (keyStageSlug) {
      const isKeyStageCurrent = asPath.includes(keyStageSlug);

      setIsCurrent(isKeyStageCurrent);
      return;
    }
  }, [currentPath, href, asPath, keyStageSlug, isCurrent]);

  return isCurrent;
};

export default useIsCurrent;
