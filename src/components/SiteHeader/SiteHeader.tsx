import { FC } from "react";
import Link from "next/link";

import useAuth from "../../auth/useAuth";
import SearchForm from "../SearchForm";

import styles from "./SiteHeader.module.css";

const SiteHeader: FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.title}>Oak</div>
      <SearchForm />
      <div className={styles.signInButtonWrapper}>
        {user ? (
          <button onClick={signOut}>Sign out</button>
        ) : (
          <Link href="/sign-in">Sign in</Link>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
