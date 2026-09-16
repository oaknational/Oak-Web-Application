import { z } from "zod";

export const teachWithOakShortReadTypesSchema = z.union([
  z.literal("explanation"),
  z.literal("feedback"),
  z.literal("practice"),
  z.literal("check-for-understanding"),
]);

export type TeachWithOakShortReadTypes = z.infer<
  typeof teachWithOakShortReadTypesSchema
>;

export const teachWithOakShortReadsExistenceSchema = z.object({
  resources: z.array(
    z.object({
      type: teachWithOakShortReadTypesSchema,
      exists: z.boolean(),
      fileSize: z.string().optional(),
    }),
  ),
});

export type TeachWithOakShortReadsDownloads = z.infer<
  typeof teachWithOakShortReadsExistenceSchema
>["resources"];
