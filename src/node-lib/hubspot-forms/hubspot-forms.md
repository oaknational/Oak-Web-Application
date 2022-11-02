# Hubspot forms

## How it works

- A hubspot private app is set up and the access key stored in the environment. Hubspot recently deprecated API key access, and public apps rely on oauth so we use a private app for our internal integration
- Hubspot forms are selected in sanity and their ID stored in the sanity document
- In a process similar to how we resolve portable text references, we walk all sanity document trees looking for references to hubspot forms, and insert the form data in place
- The forms are looked up by ID, and then parsed with zod and transformed.  
  Only a subset of hubspot's full form capabilities are handled in the parse and transform steps, but the rationale is to blow up early and throw an error when an unhandled case is found rather than letting it slip through and creating more subtle bugs. If an error is encountered, the document's form is just set to `null` and no form will be rendered on the front-end.
- The transform tries to simplify some of the data shape and conditions for dependent (and in future, progressive) fields. The data shape is intended to be not overly hubspot-like, so we can declare forms inline using the same syntax if desired


## Capabilities

### Zod schemas generated from form shapes
[`common-lib/forms/formToZod.ts`](../../common-lib/forms/formToZod.ts) attempts to map our internal form representation onto a zod schema that can be used for form validation. As the schemas are generated at runtime there isn't any type inference.

Note: dependent fields aren't covered by zod validation currently, but a combination of the `required` flag and parsing the `renderWhen` condition should let us add refinements

### Dependent fields
> With dependent fields, you can display additional fields based on visitors' responses to a previous field. For example, if your business is a bakery, you can ask visitors if they like cake and, if so, ask what flavor of cake they like.

This is modelled in the Hubspot API response by way of each field having a `dependentFieldFilters[]` key, which in turn has field definitions and the conditions under which they should be shown.

Since Hubspot's API returns some questionably formatted data and many redundant fields, the transform pipeline flattens the parent and dependent fields, and adds some simpler JSON-encoded rendering logic. 

See [`evaluateCondition.ts`](../../common-lib/forms/evaluateCondition.ts) and related tests. Only a minimal subset of conditions have been added currently.

### Progressive fields
> Progressive fields allow you to hide fields that a visitor has already been
answered, and replace them with fields that have not been answered.

Progressive fields haven't been implemented yet, but by re-using the dependent field logic implementation shouldn't be too difficult.

The unknown currently is how to seed a form with data we have from previous submissions using the client side hubspot JS library (not `node-hubspot`, although if it comes to it we may have to implement an API endpoint that fetches the data for a specific user)

If we look at a progressive field as a field that depends on another field:
- The form is seeded with the data we already have for the user
- The depended-upon field has a `isProgressive` flag set and some render logic to be hidden when `field.isProgressive && formValues[field.name] !== null`
- The dependent field has a clause added in the transform like `{ field: "dependent_field_name", operator: "nonempty" }`