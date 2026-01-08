import { GetInvolvedCollaborateWithUs } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("GetInvolvedCollaborateWithUs", () => {
  it("renders", () => {
    const { container } = render(
      <GetInvolvedCollaborateWithUs
        heading="Collaborate with us"
        imageUrl="http://example.com/chatting.svg"
        imageAlt=""
        cards={[
          {
            headingTag: "h3",
            headingTitle: "Give your feedback",
            content: [
              {
                _key: "key0001",
                _type: "block",
                children: [
                  {
                    _key: "key0002",
                    _type: "span",
                    marks: [],
                    text: "Share your story and we'll send you a gift voucher as a thanks for your time.",
                  },
                ],
                markDefs: [],
                style: "normal",
              },
            ],
            buttons: [
              {
                text: "Get in touch",
                link: "https://share.hsforms.com/2pi1ZLqVKQNyKznqJrpqsgwbvumd",
                external: true,
              },
            ],
          },
          {
            headingTag: "h3",
            headingTitle: "Help us improve",
            content: [
              {
                _key: "key0001",
                _type: "block",
                children: [
                  {
                    _key: "key0002",
                    _type: "span",
                    marks: [],
                    text: "Teachers are at the heart of everything we build. Have your say by taking part in research.",
                  },
                ],
                markDefs: [],
                style: "normal",
              },
            ],

            buttons: [
              {
                text: "Take part in research",
                link: "https://share.hsforms.com/1dv2FiLvTQraZIZmhUUURmQbvumd",
                external: true,
              },
            ],
          },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
