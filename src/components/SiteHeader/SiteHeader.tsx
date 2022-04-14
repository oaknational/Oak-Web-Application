import { FC } from "react";
import Link from "next/link";

import useAuth from "../../auth/useAuth";

import styles from "./SiteHeader.module.css";

const SiteHeader: FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.title}>Oak</div>
      <input
        className={styles["search-input"]}
        type="text"
        placeholder="Search"
      />
      {user ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <Link href="/sign-in">Sign in</Link>
      )}
    </header>
  );
};

export default SiteHeader;
