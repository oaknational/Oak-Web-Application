import { useRouter } from "next/router";

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

  if (
    `${currentPath}/`.startsWith(`/beta/teachers/`) &&
    currentPath.length > 15
  ) {
    return false;
  }

  return `${currentPath}/`.startsWith(`${href}/`);
};

type UseIsCurrentProps = {
  href: string;
};

/**
 * Returns true if a menu link is should be styled as 'current',
 * i.e. if the link's href is a subpath of the current path.
 */
const useIsCurrent = (props: UseIsCurrentProps) => {
  const { href } = props;
  const { pathname: currentPath } = useRouter();

  const isCurrent = isSubPath({
    currentPath,
    href,
  });

  return isCurrent;
};

export default useIsCurrent;
