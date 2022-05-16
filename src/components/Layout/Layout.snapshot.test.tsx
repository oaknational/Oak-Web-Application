import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Layout from "./Layout";

it("renders <Layout> unchanged", () => {
  const { container } = renderWithProviders(
    <Layout
      seoProps={{
        title: "",
        description: "",
        noIndex: undefined,
        image: undefined,
      }}
    />
  );
  expect(container).toMatchSnapshot();
});
