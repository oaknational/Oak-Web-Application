import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";

import DownloadCardGroup from "../DownloadCardGroup/DownloadCardGroup";
import { DownloadFormProps } from "../downloads.types";


import ResourcePageLayout, {
  ResourcePageLayoutProps,
} from "./ResourcePageLayout";
import Component from "./ResourcePageLayout";

import * as downloads from "@/node-lib/curriculum-api/fixtures/downloads.fixtures";

const meta: Meta<typeof Component> = {
  title: "Download Components/Resource Page Layout",
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

const Wrapper = (args: ResourcePageLayoutProps) => {
  const { control, register } = useForm<DownloadFormProps>();
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
    ctaText: "Download",
    ctaIcon: "download",
    isLoading: false,
    ctaDisabled: false,
    ctaLoadingText: "Downloading...",
    onCtaClick: () => {},
    onEditClick: () => {},
    setSchool: () => {},
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};
