import { FC } from "react";
import Link from "next/link";

import { useUserStyleContext } from "../../context/UserStyleContext";
import useAuth from "../../auth/useAuth";

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
      <input
        className={styles["search-input"]}
        type="text"
        placeholder="Search"
      />

      <button className={styles.button} onClick={handleClick}>
        {userStyleContext.user}
      </button>

      {user ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <Link href="/sign-in">Sign in</Link>
      )}
    </header>
  );
};

export default SiteHeader;
