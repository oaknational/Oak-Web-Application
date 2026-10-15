"use client";

import {
  OakBox,
  parseColor,
  parseSpacing,
  parseBorderWidth,
  parseFontSize,
  parseLineHeight,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { SectionProps, InsightsContentMaxWidth } from "./shared";

const InsightsTable = styled(OakBox)`
  border-spacing: 0;
  border-collapse: separate;

  th,
  td {
    padding: ${parseSpacing("spacing-12")};
    border-right: ${parseBorderWidth("border-solid-s")} solid
      ${parseColor("border-decorative1-stronger")};
    border-bottom: ${parseBorderWidth("border-solid-s")} solid
      ${parseColor("border-decorative1-stronger")};
    text-align: left;
    vertical-align: top;
    font-size: ${parseFontSize("body-2")};
    line-height: ${parseLineHeight("body-2")};
  }

  th {
    background: ${parseColor("bg-decorative1-main")};
    font-weight: 700;
    line-height: ${parseLineHeight("heading-7")};
  }

  tbody tr:nth-child(odd) td {
    background: ${parseColor("bg-primary")};
  }

  tbody tr:nth-child(even) td {
    background: ${parseColor("bg-decorative1-very-subdued")};
  }

  tr:last-child td {
    border-bottom: 0;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }
`;

export const NationalCurriculumInsightsTable = ({
  section,
}: SectionProps<"NationalCurriculumInsightsTableSection">) => {
  return (
    <OakBox
      as="section"
      $ph={["spacing-20", "spacing-40"]}
      $pv="spacing-16"
      aria-label={section.heading}
    >
      <InsightsContentMaxWidth
        $mh="auto"
        $flexDirection="column"
        data-insights-module="table"
      >
        <OakBox $width="100%" $maxWidth="100%" $overflowX="auto">
          <InsightsTable
            as="table"
            $width="100%"
            $minWidth="spacing-640"
            $ba="border-solid-s"
            $borderColor="border-decorative1-stronger"
            $borderRadius="border-radius-m2"
            $overflow="hidden"
          >
            <thead>
              <tr>
                {section.table.rows[0]?.cells.map((cell, cellIndex) => (
                  <th scope="col" key={`${section.heading}-head-${cellIndex}`}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.slice(1).map((row, rowIndex) => (
                <tr key={`${section.heading}-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={`${section.heading}-${rowIndex}-${cellIndex}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </InsightsTable>
        </OakBox>
      </InsightsContentMaxWidth>
    </OakBox>
  );
};
