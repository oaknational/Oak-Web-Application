import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "../../Input";
import { P } from "../../Typography";
import Button from "../../Button";
import OakError from "../../../errors/OakError";
import DropdownSelect from "../../DropdownSelect";
import {
  UserRole,
  USER_ROLES,
} from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
import errorReporter from "../../../common-lib/error-reporter";
import {
  FormDefinition,
  FormField
} from "../../../node-lib/hubspot-forms/FormDefinition";

const reportError = errorReporter("HubspotForm.tsx");

export type NewsletterFormProps = {
  form: FormDefinition;
};

const FormFieldComp: FC<{ field: FormField }> = ({ field }) => {
  return <input type="text" />;
};

const formContext = {};

const evaluateCondition = () => false;

const hideThingyFields = (field: FormField) => {
  if (field.renderWhen?.length > 0) {
    const shouldRender = field.renderWhen?.every((condition) => {
      return evaluateCondition(condition, formContext);
    });
    return shouldRender
  }

  return true;
};

const HubspotForm: FC<NewsletterFormProps> = ({ form }) => {
  return (
    <form>
      {form.fields.filter(hideThingyFields).map((field) => {
        return <FormFieldComp field={field} />;
      })}
    </form>
  );
};

export default HubspotForm;
