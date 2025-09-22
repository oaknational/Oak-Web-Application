import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { action } from "@storybook/addon-actions";

import { DOWNLOAD_TYPES } from "./helper";

import Component, { CurriculumDownloadViewData } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const sleep = (t: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), t));

export const CurriculumDownloadView: Story = {
  args: {
    data: {
      schools: [
        {
          urn: "100000",
          la: "City of London",
          name: "The Aldgate School",
          postcode: "EC3A 5DE",
          fullInfo: "100000, City of London, The Aldgate School, EC3A 5DE",
          status: "Open",
        },
        {
          urn: "100009",
          la: "Camden",
          name: "West Hampstead Primary School",
          postcode: "NW6 1QL",
          fullInfo: "100009, Camden, West Hampstead Primary School, NW6 1QL",
          status: "Open",
        },
        {
          urn: "100028",
          la: "Camden",
          name: "Christ Church Primary School, Hampstead",
          postcode: "NW3 1JH",
          fullInfo:
            "100028, Camden, Christ Church Primary School, Hampstead, NW3 1JH",
          status: "Open",
        },
        {
          urn: "100031",
          la: "Camden",
          name: "Hampstead Parochial Church of England Primary School",
          postcode: "NW3 6TX",
          fullInfo:
            "100031, Camden, Hampstead Parochial Church of England Primary School, NW3 6TX",
          status: "Open",
        },
        {
          urn: "100052",
          la: "Camden",
          name: "Hampstead School",
          postcode: "NW2 3RT",
          fullInfo: "100052, Camden, Hampstead School, NW2 3RT",
          status: "Open",
        },
        {
          urn: "100059",
          la: "Camden",
          name: "La Sainte Union Catholic Secondary School",
          postcode: "NW5 1RP",
          fullInfo:
            "100059, Camden, La Sainte Union Catholic Secondary School, NW5 1RP",
          status: "Open",
        },
        {
          urn: "100067",
          la: "Camden",
          name: "St Mary's School, Hampstead",
          postcode: "NW3 6PG",
          fullInfo: "100067, Camden, St Mary's School, Hampstead, NW3 6PG",
          status: "Open",
        },
        {
          urn: "100073",
          la: "Camden",
          name: "Hampstead Hill School",
          postcode: "NW3 2PP",
          fullInfo: "100073, Camden, Hampstead Hill School, NW3 2PP",
          status: "Open",
        },
        {
          urn: "100076",
          la: "Camden",
          name: "South Hampstead High School",
          postcode: "NW3 5SS",
          fullInfo: "100076, Camden, South Hampstead High School, NW3 5SS",
          status: "Open",
        },
        {
          urn: "100090",
          la: "Camden",
          name: "Southbank International School Hampstead",
          postcode: "NW3 5TH",
          fullInfo:
            "100090, Camden, Southbank International School Hampstead, NW3 5TH",
          status: "Open",
        },
      ],
      schoolId: undefined,
      email: "test@example.com",
      downloadTypes: ["curriculum-plans"],
      termsAndConditions: true,
      schoolNotListed: false,
    },
  },
  render: function StoryComponent(args) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState<CurriculumDownloadViewData>(args.data);
    useEffect(() => setData(args.data), [args]);

    const onSubmit = async (e: CurriculumDownloadViewData) => {
      action("onSubmit")(e);
      setIsSubmitting(true);
      await sleep(2000);
      setIsSubmitting(false);
    };

    return (
      <Component
        data={data}
        onChange={setData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        schools={[]}
        availableDownloadTypes={DOWNLOAD_TYPES}
      />
    );
  },
};
