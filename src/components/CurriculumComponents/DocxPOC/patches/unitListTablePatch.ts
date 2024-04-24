import { PatchType } from "@btitterington_org/docx";

import { POCFormData } from "../components/POCForm";
import { UnitsTable } from "../templates/unitsTable";

export const unitListTablePatch = (curriculumData: POCFormData) => {
  // Create the unit list table from the units input
  const unitListChildren = [
    UnitsTable(
      curriculumData.units
        .split("\n")
        .map((unit, index) => ({ title: unit, number: index + 1 })),
    ),
  ];

  return {
    UNIT_LIST_TABLE: {
      type: PatchType.JSON,
      children: unitListChildren,
    },
  };
};
