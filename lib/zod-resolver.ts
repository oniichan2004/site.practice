import { zodResolver } from "@hookform/resolvers/zod";

import type { FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";

/**
 * Thin wrapper around `zodResolver` that returns a correctly-typed
 * `Resolver<T>` inferred from the schema's output.
 *
 * Why the cast: zod v4.4 and @hookform/resolvers v5 disagree on a type-only
 * version literal baked into the resolver's bundled `.d.ts`
 * (`_zod.version.minor`: 4 vs 0), so handing a v4 schema straight to
 * `zodResolver` fails `tsc` even though it works at runtime. Containing the one
 * escape hatch here keeps every form's call site clean and `any`-free.
 * Remove once @hookform/resolvers ships types that track zod 4.4.
 */
export function zodFormResolver<T extends FieldValues>(
  schema: z.ZodType<T>,
): Resolver<T> {
  return zodResolver(schema as never) as unknown as Resolver<T>;
}
