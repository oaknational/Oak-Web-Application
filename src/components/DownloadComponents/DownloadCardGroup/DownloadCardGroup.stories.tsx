import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import { DownloadFormProps } from "../downloads.types";
import * as downloads from "../../../node-lib/curriculum-api/fixtures/downloads.fixture";

import Component, { DownloadCardGroupProps } from "./DownloadCardGroup";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Download Components/Download Card Group",
};

export default meta;

type Story = StoryObj<typeof Component>;

const Wrapper = (args: DownloadCardGroupProps) => {
  const { control } = useForm<DownloadFormProps>({
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
