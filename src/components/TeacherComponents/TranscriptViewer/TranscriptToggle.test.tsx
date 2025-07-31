import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TranscriptToggle from "./TranscriptToggle";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("TranscriptToggle", () => {
  const transcriptSentences = [
    "This is sentence one.",
    "This is sentence two.",
  ];

  test("renders the button with 'Show transcript' label initially", () => {
    renderWithTheme(
      <TranscriptToggle transcriptSentences={transcriptSentences} />,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Show transcript");
  });

  test("renderWithThemes the transcript when button is clicked", async () => {
    renderWithTheme(
      <TranscriptToggle transcriptSentences={transcriptSentences} />,
    );
    const button = screen.getByRole("button");

    await userEvent.click(button);
    expect(screen.getByText("This is sentence one.")).toBeInTheDocument();
    expect(screen.getByText("This is sentence two.")).toBeInTheDocument();
  });

  test("changes the button label to 'Hide transcript' when clicked", async () => {
    renderWithTheme(
      <TranscriptToggle transcriptSentences={transcriptSentences} />,
    );
    const button = screen.getByRole("button");

    await userEvent.click(button);
    expect(button).toHaveTextContent("Hide transcript");
  });

  test("hides the transcript when button is clicked again", async () => {
    renderWithTheme(
      <TranscriptToggle transcriptSentences={transcriptSentences} />,
    );
    const button = screen.getByRole("button");

    // Click to show the transcript
    await userEvent.click(button);
    expect(screen.getByText("This is sentence one.")).toBeVisible();
    expect(screen.getByText("This is sentence two.")).toBeVisible();

    // Click to hide the transcript
    await userEvent.click(button);
    expect(screen.queryByText("This is sentence one.")).not.toBeVisible();
    expect(screen.queryByText("This is sentence two.")).not.toBeVisible();
  });
});
