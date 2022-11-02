import OakError from "../../../errors/OakError";
import { getHubspotFormById } from "../../hubspot-forms";

import { resolveHubspotFromReferences } from "./resolveHubspotFromReferences";

jest.mock("../../hubspot-forms");

const mockedGetHubspotFormById = getHubspotFormById as jest.MockedFn<
  typeof getHubspotFormById
>;

const reportError = jest.fn();
jest.mock("../../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

describe("addHubspotForms", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockedGetHubspotFormById
      .mockResolvedValueOnce({
        portalId: 12345,
        formId: "abcd-efgh-ijkl",
        submitButtonLabel: "Submit",
        successMessage: "Thanks",
        fields: [
          { name: "name", label: "Name", type: "string", required: true },
        ],
      })
      .mockResolvedValueOnce({
        portalId: 6789,
        formId: "mnop-qrst-uvwx",
        submitButtonLabel: "Submit",
        successMessage: "Thanks",
        fields: [
          { name: "email", label: "Email", type: "email", required: true },
        ],
      });
  });

  const mockObjWithReferences = {
    foo: {
      bar: {
        hubspotForm: { id: "abcd-efgh-ijkl" },
      },
    },
    baz: [
      {
        hubspotForm: { id: "mnop-qrst-uvwx" },
      },
    ],
  };

  it("replaces each hubspotForm object with the result of the api call", async () => {
    const resolved = await resolveHubspotFromReferences(mockObjWithReferences);

    expect(resolved.foo.bar.hubspotForm).toMatchObject({
      portalId: 12345,
      formId: "abcd-efgh-ijkl",
      fields: [{ name: "name", label: "Name", type: "string" }],
    });

    expect(resolved?.baz?.[0]?.hubspotForm).toMatchObject({
      portalId: 6789,
      formId: "mnop-qrst-uvwx",
      fields: [{ name: "email", label: "Email", type: "email" }],
    });
  });

  it("calls getHubspotFormById with each referenced form ID", async () => {
    mockedGetHubspotFormById
      .mockResolvedValueOnce({
        portalId: 12345,
        formId: "abcd-efgh-ijkl",
        submitButtonLabel: "Submit",
        successMessage: "Thanks",
        fields: [],
      })
      .mockResolvedValueOnce({
        portalId: 6789,
        formId: "mnop-qrst-uvwx",
        submitButtonLabel: "Submit",
        successMessage: "Thanks",
        fields: [],
      });

    await resolveHubspotFromReferences(mockObjWithReferences);

    expect(getHubspotFormById).toHaveBeenNthCalledWith(1, "abcd-efgh-ijkl");
    expect(getHubspotFormById).toHaveBeenNthCalledWith(2, "mnop-qrst-uvwx");
  });

  it("resolves to null for forms that throw an error", async () => {
    // Clear, then fail the first time and succeed the second
    mockedGetHubspotFormById
      .mockReset()
      .mockRejectedValueOnce(new Error("Oops"))
      .mockResolvedValueOnce({
        portalId: 6789,
        formId: "mnop-qrst-uvwx",
        submitButtonLabel: "Submit",
        successMessage: "Thanks",
        fields: [
          { name: "email", label: "Email", type: "email", required: true },
        ],
      });

    const resolved = await resolveHubspotFromReferences(mockObjWithReferences);

    expect(resolved.foo.bar.hubspotForm).toBeNull();

    expect(resolved?.baz?.[0]?.hubspotForm).toMatchObject({
      portalId: 6789,
      formId: "mnop-qrst-uvwx",
      fields: [{ name: "email", label: "Email", type: "email" }],
    });
  });

  it("logs errors encountered", async () => {
    const sourceError = new Error("Oops");

    mockedGetHubspotFormById.mockReset().mockRejectedValue(sourceError);

    await resolveHubspotFromReferences({
      id: "doc-id",
      ...mockObjWithReferences,
    });

    expect(reportError).toHaveBeenCalledWith(
      new OakError({
        code: "cms/invalid-hubspot-form",
      })
    );

    // toHaveBeenCalledWith doesn't match properly on a new OakError
    // with meta, so explicitly check the meta object
    const reportedError = reportError.mock.lastCall[0];
    expect(reportedError.meta).toEqual({
      hubspotFormId: "mnop-qrst-uvwx",
      sanityDocumentId: "doc-id",
    });
  });
});
