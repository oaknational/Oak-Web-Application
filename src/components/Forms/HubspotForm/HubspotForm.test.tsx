import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { computeAccessibleDescription } from "dom-accessibility-api";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import OakError from "../../../errors/OakError";

import HubspotForm from "./HubspotForm";

const onSubmit = jest.fn();

describe("HubspotForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
});
