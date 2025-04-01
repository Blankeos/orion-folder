// /* eslint-disable */
// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

//// Automatically generated by Vike (routegen).
//// - Used for typesafe routing.
//// - DO NOT make any changes.
//// - Make sure to exclude from linter/formatter.

export { pageRoutes, getRoute, useParams };
export type { PageRoute, UseParamsResult };

const pageRoutes = [
  "/"
] as const;

type PageRoute = typeof pageRoutes[number];

/* For regular routes with named parameters. But it has a minor issue, it gets "" as a property, so this is prefixed with '_' */
type _ExtractNamedParams<T extends string> = T extends `${string}@${infer Param}/${infer Rest}`
? { [K in Param | keyof ExtractNamedParams<Rest>]: string }
: T extends `${string}@${infer Param}`
? { [K in Param]: string }
: {};

/** Minor utility to prevent typescript from wrapping types. */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/* For regular routes with named parameters */
type ExtractNamedParams<T extends string> = Prettify<Omit<_ExtractNamedParams<T>, "">>;

/* Helper to determine if a route ends with a catch-all segment */
type EndsWithCatchall<T extends string> = T extends `${string}/@` ? true : false;

/* Conditional type helper for determining if a route is a catchall/splat route */
type IsCatchallRoute<T extends string> = EndsWithCatchall<T>;

/* Return type for UseParams */
type UseParamsResult<T extends PageRoute> =
IsCatchallRoute<T> extends true
? ExtractNamedParams<T> & { '@': string[], '_@': string }
: ExtractNamedParams<T>;

/* Conditional type helper for determining if a route has parameters */
type HasParams<T extends string> =
IsCatchallRoute<T> extends true
? true
: T extends `${string}@${string}`
? true
: false;

/* Type for the options of the getRoute function. */
type GetRouteOptions<T extends PageRoute> = HasParams<T> extends true
? IsCatchallRoute<T> extends true
? {
params: ExtractNamedParams<T> & { '@': string[] | string };
search?: Record<string, string>;
}
: {
params: ExtractNamedParams<T>;
search?: Record<string, string>;
}
: {
params?: never;
search?: Record<string, string>;
};

/* Typesafe helper to generate a route URL based on Vike pages folder. */
function getRoute<T extends PageRoute>(
route: T,
...args: HasParams<T> extends true
? [options: GetRouteOptions<T>]
: [options?: GetRouteOptions<T>]
): string {
const options = args[0] || {};

// Handle both regular named parameters and catchall routes
let result: string = route;

if (options.params) {
// Handle named parameters first
const params = { ...options.params };
Object.entries(params).forEach(([key, value]) => {
if (key !== '@') {
result = result.replace(`@${key}`, String(value));
}
});

// Then handle catchall if present
if (route.endsWith('/@') && '@' in params) {
const catchallValue = params['@'];
// Remove the trailing /@ from the result
result = result.substring(0, result.length - 2);

if (Array.isArray(catchallValue)) {
// If array, join with slashes
result += `/${catchallValue.join('/')}`;
} else if (typeof catchallValue === 'string') {
// If string, add directly (with leading slash if needed)
const prefix = catchallValue.startsWith('/') ? '' : '/';
result += `${prefix}${catchallValue}`;
}
}
}

if (options.search) {
const searchParams = new URLSearchParams(options.search);
result += `?${searchParams.toString()}`;
}

return result;
}

import { usePageContext } from 'vike-solid/usePageContext'
function useParams<T extends PageRoute>(params: { from: T }): UseParamsResult<T> {
const pageContext = usePageContext();
const routeParams = pageContext.routeParams as Record<string, string>;

// Check if this is a catch-all route
if (params.from.endsWith("/@") && routeParams && "*" in routeParams) {
const catchAllPath = routeParams["*"] as string;
const segments = catchAllPath.split("/").filter(Boolean);

// Extract named parameters from the route
const namedParams: Record<string, string> = {};
const routeParts = params.from.split("/");
const urlParts = pageContext.urlPathname.split("/");

for (let i = 0; i < routeParts.length - 1; i++) {
const routePart = routeParts[i];
if (routePart.startsWith("@")) {
const paramName = routePart.slice(1);
namedParams[paramName] = urlParts[i];
}
}

// Combine named parameters with catch-all segments
return {
...namedParams,
"@": segments,
"_@": catchAllPath.startsWith("/") ? catchAllPath : `/${catchAllPath}`,
} as unknown as UseParamsResult<T>;
}

// Handle regular dynamic routes without catch-all
return routeParams as UseParamsResult<T>;
}