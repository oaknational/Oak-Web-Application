/**
 * There seems to be a TS bug where calling Omit discriminated union
 * will "flatten" the type into a regular union
 *
 * workaround copied from here:
 * https://github.com/microsoft/TypeScript/issues/31501
 */
export type OmitKeepDiscriminated<Type, K> = {
  [Property in keyof Type as Exclude<Property, K>]: Type[Property];
};
