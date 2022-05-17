import { FC } from "react";
import Link from "next/link";

import { useUserStyleContext } from "../../context/UserStyleContext";
import { useAuth } from "../../context/Auth";
import SearchForm from "../SearchForm";

import styles from "./SiteHeader.module.css";

const SiteHeader: FC = () => {
  const { user, signOut } = useAuth();
  const userStyleContext = useUserStyleContext();

  const handleClick = () => {
    userStyleContext.user === "teachers"
      ? userStyleContext.setUser("pupils")
      : userStyleContext.setUser("teachers");
  };

  return (
    <header className={styles.header}>
      <div className={styles.title}>Oak</div>
      <SearchForm />
      <div className={styles.signInButtonWrapper}>
        <button className={styles.userThemeButton} onClick={handleClick}>
          {userStyleContext.user}
        </button>
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
