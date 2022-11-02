import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { computeAccessibleDescription } from "dom-accessibility-api";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import OakError from "../../../errors/OakError";

import DynamicForm from "./DynamicForm";

const onSubmit = jest.fn();

describe("DynamicForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
});
