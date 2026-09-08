"use client";

import { OakBox, parseColor } from "@oaknational/oak-components";
import styled from "styled-components";

import { SectionProps, InsightsContentMaxWidth } from "./shared";

const TableScroll = styled(OakBox)`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
`;

const InsightsTable = styled.table`
  width: 100%;
  min-width: 640px;
  border-spacing: 0;
  border-collapse: separate;
  border: 1px solid ${parseColor("border-decorative1-stronger")};
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
    padding: 12px;
    border-right: 1px solid ${parseColor("border-decorative1-stronger")};
    border-bottom: 1px solid ${parseColor("border-decorative1-stronger")};
    text-align: left;
    vertical-align: top;
    font-size: 16px;
    line-height: 24px;
  }

  th {
    background: ${parseColor("bg-decorative1-main")};
    font-weight: 700;
    line-height: 20px;
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
        <TableScroll>
          <InsightsTable>
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
        </TableScroll>
      </InsightsContentMaxWidth>
    </OakBox>
  );
};
