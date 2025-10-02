// import { StoryFn, Meta } from "@storybook/nextjs";
// import type {Meta} from "@storybook/nextjs";

// import Component from "./PostListItem";

// export default {
//
//   component: Component,
// } as Meta<typeof Component>;

// const Template: Meta<typeof Component> = (args) => {
//   return <Component {...args} />;
// };

// export const PostListItem = Template.bind({});
// PostListItem.args = {
//   titleTag: "h3",
//   title: "The long and winding road",
//   summary:
//     "The long and winding road  That leads to your door  Will never disappear  I've seen that road before  It always leads me here  Lead me to you door  The wild and windy night  That the rain washed away  Has left a pool of tears  Crying for the day  Why leave me standing here?  Let me know the way",
//   slug: "the-long-and-winding-road",
//   category: { title: "Oak updates", slug: "oak-updates" },
//   date: "2022-10-04",
//   withImage: true,
//   contentType: "blog-post",
// };

import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./PostListItem";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const PostListItem: Story = {
  args: {
    titleTag: "h3",
    title: "The long and winding road",
    summary:
      "The long and winding road  That leads to your door  Will never disappear  I've seen that road before  It always leads me here  Lead me to you door  The wild and windy night  That the rain washed away  Has left a pool of tears  Crying for the day  Why leave me standing here?  Let me know the way",
    slug: "the-long-and-winding-road",
    category: { title: "Oak updates", slug: "oak-updates" },
    date: "2022-10-04",
    withImage: true,
    contentType: "blog-post",
  },
};
