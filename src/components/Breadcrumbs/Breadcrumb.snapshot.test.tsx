import { render } from "@testing-library/react";

import Breadcrumbs from "./Breadcrumbs";

const breadcrumbs = [
  { href: "/", label: "Unit Quiz" },
  { href: "/", label: "View In Classroom" },
  { href: "/", label: "Foundation Curriculum (PDF)" },
  { href: "/", label: "Higher Curriculum (PDF)" },
];

it("renders <Breadcrumb> unchanged", () => {
  const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
  expect(container).toMatchSnapshot();
});
