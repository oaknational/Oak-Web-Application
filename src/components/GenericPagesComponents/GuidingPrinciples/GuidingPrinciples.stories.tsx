import { Meta, StoryObj } from "@storybook/nextjs";
import { oakUiRoleTokens } from "@oaknational/oak-components";

import { GuidingPrinciples as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/GuidingPrinciples",
  argTypes: {
    accentColor: {
      options: oakUiRoleTokens,
    },
    $background: {
      options: oakUiRoleTokens,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    $background: "bg-decorative1-subdued",
    accentColor: "border-decorative1-stronger",
    title: "Guiding Principles",
    text: "We have crafted a set of overarching principles that describe the features important to our curricula in all subjects.",
    principles: [
      {
        heading: "Evidence-informed",
        text: "Our approach enables the rigorous application of research outcomes, science of learning and impactful best practice.",
      },
      {
        heading: "Knowledge and vocabulary rich",
        text: "Our curriculum is knowledge and vocabulary rich so that pupils build on what they already know to develop deep knowledge and apply this through skills.",
      },
      {
        heading: "Sequenced and coherent",
        text: "We carefully and purposefully sequence our curriculum to ensure that pupils can build on and make links with existing knowledge. We pay attention to vertical coherence via threads, which map the developments of concepts over time.",
      },
      {
        heading: "Flexible",
        text: "Our curriculum is flexible by design so that schools can use them in a way to fit their setting and meet the varying needs of teachers and their pupils - all aligned to the national curriculum.",
      },
      {
        heading: "Accessible",
        text: "Our curriculum is designed to support all pupils to learn and follows accessibility guidelines. It uses insights from the science of learning to inform how content is designed and presented.",
      },
      {
        heading: "Diverse",
        text: "Our commitment to breadth and diversity in content, language, texts and media can be seen throughout our curriculum, to help pupils feel positively represented.",
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
