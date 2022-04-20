import { FC, useContext } from "react";
import Link from "next/link";

import { UserStyleContext } from "../../context/UserStyleContext";
import useAuth from "../../auth/useAuth";

import styles from "./SiteHeader.module.css";

const SiteHeader: FC = () => {
  const { user, signOut } = useAuth();
  const userStyleContext = useContext(UserStyleContext);

  const handleClick = () => {
    userStyleContext.user === "teachers"
      ? userStyleContext.setUser("pupils")
      : userStyleContext.setUser("teachers");
  };

  return (
    <header className={styles.header}>
      <button onClick={handleClick}>{userStyleContext.user}</button>
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
