/**
 * Centralized TanStack Query keys so the list query and the mutations that
 * invalidate it never drift apart. `all` is a partial-match key (invalidation);
 * `list()` is the exact key for the products list query.
 */
export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
};
