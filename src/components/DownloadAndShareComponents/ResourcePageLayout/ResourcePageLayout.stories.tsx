import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";

import DownloadCardGroup from "../DownloadCardGroup/DownloadCardGroup";
import { ResourceFormProps } from "../downloadAndShare.types";

import ResourcePageLayout, {
  ResourcePageLayoutProps,
} from "./ResourcePageLayout";

import Component from ".";

import * as downloads from "@/node-lib/curriculum-api/fixtures/downloads.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof ResourcePageLayout>;

const Wrapper = (args: ResourcePageLayoutProps) => {
  const { control, register } = useForm<ResourceFormProps>();
  return (
    <ResourcePageLayout
      {...args}
      register={register}
      control={control}
      cardGroup={
        <DownloadCardGroup
          downloads={downloads.allResources}
          control={control}
          triggerForm={() => {}}
        />
      }
    />
  );
};

export const Layout: Story = {
  args: {
    header: "Downloads",
    selectAllChecked: true,
    handleToggleSelectAll: () => {},
    errors: {},
    showLoading: false,
    showNoResources: false,
    showPostAlbCopyright: true,
    showSavedDetails: false,
    onEditClick: () => {},
    setSchool: () => {},
    cta: <button>CTA</button>,
    apiError: null,
  },
  argTypes: {
    apiError: {
      control: "radio",
      options: [null, "error"],
    },
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};
