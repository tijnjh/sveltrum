import * as v from "valibot";

export function Collection<T extends v.GenericSchema>(T: T) {
  return v.strictObject({
    collection: v.array(T),
    next_href: v.nullish(v.string()),
    query_urn: v.nullish(v.string()),
    total_results: v.optional(v.number()),
    variant: v.optional(v.string()),
  });
}
export type Collection<T> = v.InferOutput<
  ReturnType<typeof Collection<v.GenericSchema<T>>>
>;
