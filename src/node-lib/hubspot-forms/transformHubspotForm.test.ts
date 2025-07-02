import { HubspotFormDefinition } from "./hubspotSchemas";
import {
  transformHubspotFilter,
  transformHubspotForm,
} from "./transformHubspotForm";

describe("transformHubspotForm", () => {
  const formBase = {
    portalId: 24947711,
    guid: "968e95c1-6520-4a18-a3d4-6ff12996af45",
    inlineMessage: "Thank you for submitting the form.",
    submitText: "Submit",
    someOtherKeys: "weDon'tCareAbout",
    formFieldGroups: [{ fields: [] }],
  };

  it("extracts the form details", () => {
    const mockForm = {
      ...formBase,
    } as unknown as HubspotFormDefinition;

    expect(transformHubspotForm(mockForm)).toMatchObject({
      portalId: 24947711,
      formId: "968e95c1-6520-4a18-a3d4-6ff12996af45",
      successMessage: "Thank you for submitting the form.",
      submitButtonLabel: "Submit",
      fields: expect.any(Array),
    });
  });

  it("returns a flattened list of fields", () => {
    const mockForm = {
      ...formBase,
      formFieldGroups: [
        {
          fields: [
            {
              name: "name",
              label: "Name",
              type: "string",
              fieldType: "text",
              description: "The name field description",
              hidden: false,
              defaultValue: "the default",
              placeholder: "the placeholder",
              required: true,
            },
          ],
        },
      ],
    } as unknown as HubspotFormDefinition;

    expect(transformHubspotForm(mockForm)).toMatchObject({
      fields: [
        {
          name: "name",
          label: "Name",
          type: "string",
          description: "The name field description",
          hidden: false,
          required: true,
          default: "the default",
          placeholder: "the placeholder",
        },
      ],
    });
  });

  describe("enumeration fields", () => {
    it("handles the enumeration+select type", () => {
      const mockForm = {
        ...formBase,
        formFieldGroups: [
          {
            fields: [
              {
                name: "user_type",
                label: "User Type",
                type: "enumeration",
                fieldType: "select",
                options: [
                  {
                    label: "Teacher",
                    value: "Teacher",
                    displayOrder: -1,
                    doubleData: 0,
                    hidden: false,
                    description: "",
                    readOnly: false,
                  },
                  {
                    label: "Parent",
                    value: "Parent",
                    displayOrder: -1,
                    doubleData: 0,
                    hidden: false,
                    description: "",
                    readOnly: false,
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(transformHubspotForm(mockForm)).toMatchObject({
        fields: [
          {
            name: "user_type",
            label: "User Type",
            type: "select",
            options: [
              { label: "Teacher", value: "Teacher" },
              { label: "Parent", value: "Parent" },
            ],
            hidden: false,
            required: true,
          },
        ],
      });
    });
  });

  it("transforms fields named `email` to email type", () => {
    const mockForm = {
      ...formBase,
      formFieldGroups: [
        {
          fields: [
            {
              name: "email",
              label: "Email",
              type: "string",
              fieldType: "text",
            },
          ],
        },
      ],
    };

    expect(transformHubspotForm(mockForm)).toMatchObject({
      fields: [
        {
          name: "email",
          label: "Email",
          type: "email",
          hidden: false,
          required: true,
        },
      ],
    });
  });

  it("handles dependent fields", () => {
    const mockForm = {
      ...formBase,
      formFieldGroups: [
        {
          fields: [
            {
              name: "user_type",
              label: "User Type",
              type: "enumeration",
              fieldType: "select",
              options: [
                { label: "Teacher", value: "Teacher" },
                { label: "Parent", value: "Parent" },
              ],
              dependentFieldFilters: [
                {
                  filters: [
                    {
                      operator: "SET_ANY",
                      strValue: "",
                      boolValue: false,
                      numberValue: 0,
                      strValues: ["Teacher"],
                      numberValues: [],
                    },
                  ],
                  dependentFormField: {
                    name: "school",
                    label: "School",
                    type: "string",
                    fieldType: "text",
                    required: false,
                  },
                  formFieldAction: "DISPLAY",
                },
              ],
            },
          ],
        },
      ],
    };

    expect(transformHubspotForm(mockForm)).toMatchObject({
      fields: [
        {
          name: "user_type",
          label: "User Type",
          type: "select",
          required: true,
        },
        {
          name: "school",
          label: "School",
          type: "string",
          required: false,
          renderWhen: [
            {
              field: "user_type",
              operator: "in",
              value: ["Teacher"],
            },
          ],
        },
      ],
    });
  });

  describe("addConditions", () => {
    const hubspotFilter = {
      operator: "SET_ANY",
      strValue: "",
      boolValue: false,
      numberValue: 0,
      strValues: ["Teacher"],
      numberValues: [],
    };

    expect(transformHubspotFilter(hubspotFilter, "user_type")).toEqual({
      field: "user_type",
      operator: "in",
      value: ["Teacher"],
    });
  });
});
