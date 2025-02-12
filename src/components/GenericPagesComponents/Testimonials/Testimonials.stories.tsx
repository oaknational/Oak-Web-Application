import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Testimonials } from "./Testimonials";

import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { HomePage } from "@/common-lib/cms-types";

const meta = {
  component: Testimonials,
} satisfies Meta<typeof Testimonials>;

export default meta;

type Story = StoryObj<typeof meta>;

const testimonials: HomePage["testimonials"] = [
  {
    quote: {
      text: "When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      attribution: "Suzanne",
      role: "Head teacher",
      organisation: "Oak National Academy",
    },
    image: {
      asset: {
        _id: "test_quote_author",
        url: `https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1698336490/test-images/test_quote_author.jpg`,
      },
    },
  },
  {
    quote: {
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      attribution: "Janet",
      role: "Teacher",
      organisation: "Oak National Academy",
    },
    image: {
      asset: {
        _id: "test_quote_author",
        url: `https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1698336490/test-images/test_quote_author.jpg`,
      },
    },
  },
  {
    quote: {
      text: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      attribution: "Lizzy",
      role: "Assistant Teacher",
      organisation: "Oak National Academy",
    },
    image: {
      asset: {
        _id: "test_quote_author",
        url: `https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1698336490/test-images/test_quote_author.jpg`,
      },
    },
  },
];

export const Default: Story = {
  render: () => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Testimonials testimonials={testimonials} />
      </OakThemeProvider>
    );
  },
};
