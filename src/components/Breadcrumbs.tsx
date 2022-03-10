import { FC } from "react";
import Link from "next/link";

import styles from "./Breadcrumbs.module.css";
import Icon from "./Icon";

type Breadcrumb = {
  href: string;
  label: string;
};
type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};
const Breadcrumbs: FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.ol}>
        {breadcrumbs.map((breadcrumb, i) => {
          const { href, label } = breadcrumb;
          return (
            <li className={styles.li} key={`${i}-${breadcrumb.href}`}>
              {i !== 0 && <Icon name="ChevronRight" size={20} />}
              <Link href={href}>{label}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
