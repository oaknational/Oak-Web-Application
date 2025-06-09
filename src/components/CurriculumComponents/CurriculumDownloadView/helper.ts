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

export const validDownloadTypes = [
  "curriculum-plans",
  "national-curriculum",
] as const;

export function assertValidDownloadType(val: string) {
  if (!validDownloadTypes.includes(val as DownloadType)) {
    throw new Error("Invalid ");
  }
  return val as DownloadType;
}

export type DownloadType = (typeof validDownloadTypes)[number];

export const DOWNLOAD_TYPES: {
  id: DownloadType;
  label: string;
  disabled?: boolean;
  icon: string;
  subTitle?: string;
}[] = [
  {
    id: "curriculum-plans",
    label: "Curriculum plan",
    subTitle: "Word (accessible)",
    icon: "maths",
  },
  {
    id: "national-curriculum",
    label: "National curriculum",
    subTitle: "XLSX",
    icon: "maths",
  },
];
