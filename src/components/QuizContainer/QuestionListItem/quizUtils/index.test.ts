// import { render } from "@testing-library/react";
// import renderWithProviders from "../../../../__tests__/__helpers__/renderWithProviders.jsx";
// import renderWithTheme from "../../../../__tests__/__helpers__/renderWithTheme.jsx";
// import Typography from "../../../Typography/Typography.jsx";

// import QuestionListItem from "../QuestionListItem.jsx";
// import { shortAnswerTitleFormatter } from "./index.jsx";

// describe("shortAnswerTitleFormatter", () => {
// it("when passed an empty str returns an empty string", () => {
//   const result = shortAnswerTitleFormatter("");
//   expect(result).toBe("");
// });

// it("when passed a string with no {{}} returns the same string", () => {
//   const result = shortAnswerTitleFormatter("This is a string");
//   expect(result).toBe("This is a string");
// });

// it("when passed undefined or null returns an empty string", () => {
//   const result = shortAnswerTitleFormatter(undefined);
//   const result2 = shortAnswerTitleFormatter(null);
//   expect(result2).toBe("");
//   expect(result).toBe("");
// });

// it("should replace {{}} pattern with Underline component", () => {
//   const title = "Given that a = 3b, fill in the gap: a + 3b = {{}}b.";
//   const arrange = shortAnswerTitleFormatter(title);
//   const { queryByTestId } = renderWithTheme(arrange);

// const { queryByTestId } = renderWithTheme(
//   <Typography>{arrange}</Typography>
// );

//   expect(queryByTestId("underline")).toBeTruthy();
// });

// it("should replace {{}} pattern with Underline component", () => {
//   const title = "Given that a = 3b, fill in the gap: a + 3b = {{}}b.";
//   const props = { title, images, choices, answer, type, displayNumber };

//   QuestionListItem({ title, type: "shortAnswer" });
// });

// it("should return the same title if no pattern is found", () => {
//   const title = "This is a normal title.";
//   const { container } = render(<>{shortAnswerTitleFormatter(title)}</>);
//   expect(container.innerHTML).toBe(title);
// });

// it("should handle null and undefined titles", () => {
//   const nullTitle = null;
//   const undefinedTitle = undefined;
//   const { container: nullContainer } = render(
//     <>{shortAnswerTitleFormatter(nullTitle)}</>
//   );
//   const { container: undefinedContainer } = render(
//     <>{shortAnswerTitleFormatter(undefinedTitle)}</>
//   );
//   expect(nullContainer.innerHTML).toBe("");
//   expect(undefinedContainer.innerHTML).toBe("");
// });
// });
