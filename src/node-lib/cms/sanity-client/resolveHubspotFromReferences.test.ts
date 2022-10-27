import OakError from "../../../errors/OakError";
import { getHubspotFormById } from "../../hubspot-forms";

import { resolveHubspotFromReferences } from "./resolveHubspotFromReferences";

jest.mock("../../hubspot-forms");

const mockedGetHubspotFormById = getHubspotFormById as jest.MockedFn<
  typeof getHubspotFormById
>;

describe("addHubspotForms", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockedGetHubspotFormById
      .mockResolvedValueOnce({
        portalId: 12345,
        formId: "abcd-efgh-ijkl",
        fields: [{ name: "name", label: "Name", type: "string" }],
      })
      .mockResolvedValueOnce({
        portalId: 6789,
        formId: "mnop-qrst-uvwx",
        fields: [{ name: "email", label: "Email", type: "email" }],
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
        fields: [],
      })
      .mockResolvedValueOnce({
        portalId: 6789,
        formId: "mnop-qrst-uvwx",
        fields: [],
      });

    await resolveHubspotFromReferences(mockObjWithReferences);

    expect(getHubspotFormById).toHaveBeenNthCalledWith(1, "abcd-efgh-ijkl");
    expect(getHubspotFormById).toHaveBeenNthCalledWith(2, "mnop-qrst-uvwx");
  });

  it.skip("throws an OakError with metadata when it can't match refs to responses", async () => {
    // @TODO: getById fail response
    const mockErrorCausingResponse = [
      {
        contentType: "aboutCorePage",
        _type: "aboutCorePage",
        id: "wont-be-found",
      },
    ];

    mockedGetHubspotFormById.mockResolvedValue(mockErrorCausingResponse);

    const capturedError = await resolveHubspotFromReferences(mockObjWithReferences).catch(
      (err) => err
    );

    await expect(
      async () => await resolveHubspotFromReferences(mockObjWithReferences)
    ).rejects.toThrowError(
      new OakError({ code: "cms/invalid-reference-data" })
    );

    expect(capturedError.meta).toEqual({
      portableTextPath: ["foo", "bar", "post"],
      portableTextRefId: "ref1",
      queryResults: JSON.stringify(mockErrorCausingResponse),
    });
  });
});
