import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import Component, { DownloadCardGroupProps } from "./DownloadCardGroup";

import {
  ResourceFormProps,
  ResourceFormWithRiskAssessmentProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import * as downloads from "@/node-lib/curriculum-api-2023/fixtures/downloads.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const Wrapper = (args: DownloadCardGroupProps) => {
  const { control } = useForm<
    ResourceFormProps | ResourceFormWithRiskAssessmentProps
  >({
    mode: "onBlur",
  });
  return <Component {...args} control={control} />;
};

export const AllResources: Story = {
  args: {
    downloads: downloads.allResources,
    triggerForm: () => {},
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export const NoSlideDeck: Story = {
  args: {
    downloads: downloads.noSlideDeck,
    triggerForm: () => {},
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export const NoSlideDeckOneWorksheet: Story = {
  args: {
    downloads: downloads.noSlideDeckOneWorksheet,
    triggerForm: () => {},
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export const OneWorksheet: Story = {
  args: {
    downloads: downloads.oneWorksheet,
    triggerForm: () => {},
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};
