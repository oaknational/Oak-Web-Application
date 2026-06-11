import slugify from "slugify";

import { FocusTreeNode } from "./types";

import {
  ProgrammeFactorButton,
  PupilsSubNavData,
  TeachersBrowseChildItem,
  TeachersSubNavData,
  isDropdownMenuItem,
  isTeachersBrowseItem,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export const createFocusId = (
  area: string,
  slug: string,
  parentId?: string,
): string => {
  if (parentId === undefined) return `${area}-${slug}`;
  if (slug === "") return `${area}-${parentId}`;
  return `${slug}-${parentId}`;
};

export const getExamBoardFocusSlug = (examBoard: ProgrammeFactorButton) => {
  const examboardSlug = examBoard.programmeFactors?.examboard?.slug;
  const tierSlug = examBoard.programmeFactors?.tier?.slug;

  if (examboardSlug && tierSlug) {
    return `${examboardSlug}-${tierSlug}`;
  }

  if (examboardSlug || tierSlug) {
    return examboardSlug ?? tierSlug ?? "";
  }

  return slugify(examBoard.buttonTitle || examBoard.programmeSlug);
};

const buildSubjectNode = ({
  phaseSlug,
  groupSlug,
  subject,
}: {
  phaseSlug: "primary" | "secondary";
  groupSlug: string;
  subject: TeachersBrowseChildItem["children"][number];
}): FocusTreeNode => {
  const subjectId = createFocusId(
    "teachers",
    `teachers-${phaseSlug}-${groupSlug}`,
    subject.slug,
  );

  return {
    id: subjectId,
    children:
      subject.examBoards?.map((examBoard) => ({
        id: createFocusId(
          "teachers",
          subjectId,
          getExamBoardFocusSlug(examBoard),
        ),
      })) ?? [],
  };
};

const buildTeachersBrowseNode = (
  browseSection: TeachersSubNavData["primary"],
): FocusTreeNode => {
  const rootId = createFocusId("teachers", "", browseSection.slug);
  const phaseButtonId = createFocusId("teachers", rootId, browseSection.slug);
  const keystagesButtonId = createFocusId("teachers", rootId, "keystages");

  const phaseGroups = browseSection.children.filter(
    (item) => item.type === "phase",
  );
  const phaseSubjectNodes = phaseGroups.flatMap((group) =>
    group.children.map((subject) =>
      buildSubjectNode({
        phaseSlug: browseSection.slug,
        groupSlug: group.slug,
        subject,
      }),
    ),
  );

  const keystageNodes = browseSection.children
    .filter((item) => item.type === "keystage")
    .map((keystage) => ({
      id: createFocusId("teachers", rootId, keystage.slug),
      children: keystage.children.map((subject) =>
        buildSubjectNode({
          phaseSlug: browseSection.slug,
          groupSlug: keystage.slug,
          subject,
        }),
      ),
    }));

  return {
    id: rootId,
    children: [
      {
        id: phaseButtonId,
        children: phaseSubjectNodes,
      },
      {
        id: keystagesButtonId,
        children: keystageNodes,
      },
    ],
  };
};

export const buildFocusTree = (
  data: TeachersSubNavData | PupilsSubNavData,
  areaType: "teachers" | "pupils",
): FocusTreeNode[] => {
  return Object.values(data).map((section) => {
    if (!isDropdownMenuItem(section)) {
      return {
        id: createFocusId(areaType, "", section.slug),
      };
    }

    if (areaType === "teachers" && isTeachersBrowseItem(section)) {
      return buildTeachersBrowseNode(section);
    }

    const rootId = createFocusId(areaType, "", section.slug);

    return {
      id: rootId,
      children: section.children.map((child) => ({
        id: createFocusId(areaType, rootId, child.slug),
      })),
    };
  });
};
