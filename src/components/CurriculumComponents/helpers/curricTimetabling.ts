type TimetableParams = {
  subject: string;
  year: number;
};

export function generateQueryParams(
  params: TimetableParams | Record<string, string | number | boolean>,
) {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
