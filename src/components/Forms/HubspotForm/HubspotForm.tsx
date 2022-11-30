import { FC } from "react";

import { FormDefinition } from "../../../common-lib/forms/FormDefinition";
import DynamicForm from "../DynamicForm";

import useHubspotForm from "./useHubspotForm";

export type HubspotFormProps = {
  form: FormDefinition;
};

const HubspotForm: FC<HubspotFormProps> = ({ form }) => {
  const { onSubmit } = useHubspotForm({ formId: form.formId });

  return <DynamicForm form={form} onSubmit={onSubmit} />;
};

export default HubspotForm;
