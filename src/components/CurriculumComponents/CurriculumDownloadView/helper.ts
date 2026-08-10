import { OakIconName } from "@oaknational/oak-components";
import { ZodType } from "zod";

export type School = {
  urn: string;
  la: string;
  name: string;
  postcode: string;
  fullInfo: string;
  status: string;
};
export function parseSchoolToListItems(schools: School[]) {
  return schools.map((item) => {
    const comboItemKey = `${item.urn}-${item.name}`;
    const textValue = `${item.name}, ${item.la}, ${item.postcode}`;

    return {
      key: comboItemKey,
      textValue: String(textValue),
    };
  });
}

export function runSchema<T extends Record<string, unknown>>(
  schema: ZodType,
  data: T,
) {
  const rslt = schema.safeParse(data);
  const newErrors: Partial<Record<keyof T, string>> = {};
  if (!rslt.success) {
    for (const issue of rslt.error.issues) {
      const dataKey = String(issue.path[0]);
      newErrors[dataKey as keyof T] = issue.message;
    }
  }
  return {
    success: rslt.success,
    errors: newErrors,
  };
}

export const DOWNLOAD_TYPE_LABELS: {
  id: string;
  label: string;
  group: string;
  disabled?: boolean;
  icon: OakIconName;
  subTitle?: string;
  fileExt: string;
}[] = [
  {
    id: "curriculum-plans",
    group: "curriculum",
    label: "Curriculum plan",
    subTitle: "Word (accessible)",
    icon: "curriculum-plan",
    fileExt: "DOCX",
  },
  {
    id: "national-curriculum",
    group: "curriculum",
    label: "National curriculum",
    subTitle: "Excel (accessible)",
    icon: "spreadsheet",
    fileExt: "XLSX",
  },
  {
    id: "curriculum-quality",
    group: "implementation-guide",
    label: "Curriculum quality",
    icon: "subject-computing",
    fileExt: "PDF",
  },
  {
    id: "whats-included",
    group: "implementation-guide",
    label: "What's included",
    icon: "subject-computing",
    fileExt: "PDF",
  },
  {
    id: "assessment",
    group: "implementation-guide",
    label: "Assessment",
    icon: "subject-computing",
    fileExt: "PDF",
  },
  {
    id: "common-questions",
    group: "implementation-guide",
    label: "Common questions",
    icon: "subject-computing",
    fileExt: "PDF",
  },
  {
    id: "equipment-list",
    group: "implementation-guide",
    label: "Equipment list",
    icon: "subject-computing",
    fileExt: "PDF",
  },
] as const;

export const DOWNLOAD_TYPES = DOWNLOAD_TYPE_LABELS.map(({ id }) => id);

export type ValidDownloadTypes = (typeof DOWNLOAD_TYPES)[number];

export function assertValidDownloadType(val: string) {
  if (!DOWNLOAD_TYPES.includes(val as DownloadType)) {
    throw new Error("Invalid ");
  }
  return val as DownloadType;
}

export type DownloadType = (typeof DOWNLOAD_TYPES)[number];

export type DownloadTypeLabel = (typeof DOWNLOAD_TYPE_LABELS)[number];
