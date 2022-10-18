export interface HubspotFormDefinition {
  portalId: number;
  guid: string;
  name: string;
  action: string;
  method: string;
  cssClass: string;
  redirect: string;
  submitText: string;
  followUpId: string;
  notifyRecipients: string;
  leadNurturingCampaignId: string;
  formFieldGroups: HubspotFormFieldGroup[];
  createdAt: number;
  updatedAt: number;
  performableHtml: string;
  migratedFrom: string;
  ignoreCurrentValues: boolean;
  metaData: Array<{
    name: string;
    value: string;
  }>;
  deletable: boolean;
  inlineMessage: string;
  tmsId: string;
  captchaEnabled: boolean;
  campaignGuid: string;
  cloneable: boolean;
  editable: boolean;
  formType: string;
  deletedAt: number;
  themeName: string;
  parentId: number;
  style: string;
  isPublished: boolean;
  publishAt: number;
  unpublishAt: number;
  publishedAt: number;
  kickbackEmailWorkflowId: number;
  kickbackEmailsJson: string;
  customUid: string;
  createMarketableContact: boolean;
  editVersion: number;
  thankYouMessageJson: string;
  themeColor: string;
  alwaysCreateNewCompany: boolean;
  internalUpdatedAt: number;
  businessUnitId: number;
  portableKey: string;
  paymentSessionTemplateIds: any[];
  selectedExternalOptions: any[];
}

export interface HubspotFormFieldGroup {
  fields: HubspotFormField[];
  default: boolean;
  isSmartGroup: boolean;
  richText: {
    content: string;
    type: string;
  };
  isPageBreak: boolean;
}

export interface HubspotFormField {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  description: string;
  groupName: string;
  displayOrder: number;
  required: boolean;
  selectedOptions: any[];
  options: HubspotFormOption[];
  validation: HubspotFormValidation;
  enabled: boolean;
  hidden: boolean;
  defaultValue: string;
  isSmartField: boolean;
  unselectedLabel: string;
  placeholder: string;
  dependentFieldFilters: HubspotFormDependentFieldFilter[];
  labelHidden: boolean;
  propertyObjectType: string;
  metaData: any[];
  objectTypeId: string;
}

export interface HubspotFormOption {
  label: string;
  value: string;
  displayOrder: number;
  doubleData: number;
  hidden: boolean;
  description: string;
  readOnly: boolean;
}

export interface HubspotFormValidation {
  name: string;
  message: string;
  data: string;
  useDefaultBlockList: boolean;
  blockedEmailAddresses: any[];
}

export interface HubspotFormDependentFieldFilter {
  filters: HubspotFormFilter[];
  dependentFormField: HubspotFormDependentFormField;
  formFieldAction: string;
}

export interface HubspotFormFilter {
  operator: string;
  strValue: string;
  boolValue: boolean;
  numberValue: number;
  strValues: any[];
  numberValues: any[];
}

export interface HubspotFormDependentFormField {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  description: string;
  groupName: string;
  displayOrder: number;
  required: boolean;
  selectedOptions: any[];
  options: any[];
  validation: HubspotFormValidation;
  enabled: boolean;
  hidden: boolean;
  defaultValue: string;
  isSmartField: boolean;
  unselectedLabel: string;
  placeholder: string;
  dependentFieldFilters: any[];
  labelHidden: boolean;
  propertyObjectType: string;
  metaData: any[];
  objectTypeId: string;
}
