import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";

const YearListingPage = () => {
  const years = [
    { yearSlug: "year-1", yearDescription: "Year 1" },
    { yearSlug: "year-2", yearDescription: "Year 2" },
    { yearSlug: "year-3", yearDescription: "Year 3" },
    { yearSlug: "year-4", yearDescription: "Year 4" },
    { yearSlug: "year-5", yearDescription: "Year 5" },
    { yearSlug: "year-6", yearDescription: "Year 6" },
    { yearSlug: "year-7", yearDescription: "Year 7" },
    { yearSlug: "year-8", yearDescription: "Year 8" },
    { yearSlug: "year-9", yearDescription: "Year 9" },
    { yearSlug: "year-10", yearDescription: "Year 10" },
    { yearSlug: "year-11", yearDescription: "Year 11" },
  ];
  return (
    <div>
      <ol>
        {years.map((year) => {
          return (
            <li key={year.yearSlug}>
              <Link
                href={resolveOakHref({
                  page: "pupil-subject-index",
                  yearSlug: year.yearSlug,
                })}
              >
                {year.yearDescription}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default YearListingPage;
