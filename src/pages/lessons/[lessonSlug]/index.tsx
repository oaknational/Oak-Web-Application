import { NextPage } from "next";

import Breadcrumbs from "../../../components/Breadcrumbs";
import Button, { ButtonProps } from "../../../components/Button";
import Card from "../../../components/Card";
import Layout from "../../../components/Layout/Layout";

import styles from "./index.module.css";

const data = {
  name: "Food tests",
  subject: {
    name: "Combined Science",
  },
  keyStage: {
    name: "Key Stage 4",
  },
  unit: {
    name: "Organisation (HT)",
    lessons: [
      { name: "Food tests" },
      { name: "Digestive enzymes" },
      { name: "Digestion" },
      { name: "Absorption" },
      { name: "Investigating enzymes" },
      { name: "pH and enzymes (Part 1)" },
      { name: "pH and enzymes (Part 2)" },
      { name: "The lungs" },
      { name: "Blood and blood vessels" },
      { name: "The heart" },
      { name: "Heart rate" },
      { name: "Heart disease" },
      { name: "Non-communicable disease" },
      { name: "Cancer" },
      { name: "Plant tissue" },
      { name: "Plant roots" },
      { name: "Transport in plants" },
      { name: "Investigating transpiration" },
      { name: "Review (Part 1)" },
      { name: "Review (Part 2)" },
      { name: "Maud Leonora Menten" },
      { name: "Exam technique" },
      { name: "Maths skills" },
    ],
  },
};

const Lesson: NextPage = () => {
  const lesson = data;

  const buttons: Omit<ButtonProps, "background">[] = [
    { href: "/", label: "Unit Quiz" },
    { href: "/", label: "View In Classroom", icon: "OpenExternal" },
    { href: "/", label: "Foundation Curriculum (PDF)", icon: "Download" },
    { href: "/", label: "Higher Curriculum (PDF)", icon: "Download" },
  ];

  return (
    <Layout>
      <Breadcrumbs
        breadcrumbs={[
          { href: "/", label: lesson.keyStage.name },
          { href: "/", label: "Subjects" },
          { href: "/", label: lesson.subject.name },
          { href: "/", label: lesson.unit.name },
        ]}
      />
      <div className={styles["primary-buttons"]}>
        <Button
          background="teachers-primary"
          href="/"
          label="Download"
          icon="Download"
        />
        <Button
          background="teachers-primary"
          href="/"
          label="Share Lesson"
          icon="Share"
        />
      </div>
      <h1 className={styles["title"]}>
        <span className={styles["lesson-overview-text"]}>Lesson overview:</span>
        <br />
        {lesson.name}
      </h1>
      <div className={styles["secondary-buttons"]}>
        {buttons.map((buttonProps) => {
          return <Button variant="text-link" {...buttonProps} />;
        })}
      </div>
      <Card>Lesson content</Card>
    </Layout>
  );
};

export default Lesson;
