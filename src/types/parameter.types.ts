/**
 * Parameter map for runtime substitution
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParameterMap = Record<string, any>;

/**
 * Template string that can contain parameter placeholders
 * Example: "Hello ${name}, you are ${age} years old"
 */
export type TemplateString = string;

/**
 * Content that can be either a static string, template string, or a function
 * that generates content based on parameters
 */
export type ContentValue =
  | string
  | TemplateString
  | ((params: ParameterMap) => string);


