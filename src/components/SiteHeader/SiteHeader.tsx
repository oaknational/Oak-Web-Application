import { FC, useContext } from "react";

import { UserStyleContext } from "../../context/UserStyleContext";

import styles from "./SiteHeader.module.css";

const SiteHeader: FC = () => {
  const userStyleContext = useContext(UserStyleContext);

  const handleClick = () => {
    userStyleContext.user === "teacher"
      ? userStyleContext.setUser("pupil")
      : userStyleContext.setUser("teacher");
  };

  return (
    <header className={styles.header}>
      <div>
        <span className={styles.title}>Oak</span>
        <input type="text" placeholder="Search" />
      </div>
      <button onClick={handleClick}>{userStyleContext.user}</button>
    </header>
  );
};

export default SiteHeader;
