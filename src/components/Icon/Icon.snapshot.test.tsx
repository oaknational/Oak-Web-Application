import { render } from "@testing-library/react";

import Icon, { IconName, ICON_NAMES } from "./Icon";

describe("'icons' component", () => {
  test.each(ICON_NAMES)(
    "renders <Icon> %s unchanged",
    function (icon: IconName) {
      const { container } = render(<Icon name={icon} size={20} />);
      expect(container).toMatchSnapshot();
    }
  );
});
