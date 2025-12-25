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

/**
 * Content that supports arrays in addition to standard ContentValue types.
 * Used for components that can accept arrays of strings (few-shots, guardrails,
 * constraints, tasks, steps).
 * 
 * Functions can return null/undefined for conditional content, or PromptComponent
 * instances for nested component structures. The component return type is checked
 * at runtime via isPromptComponent(), so we use a flexible object type here to
 * avoid circular dependencies with component.types.ts.
 */
export type ArrayContentValue =
  | ContentValue
  | string[]
  | ((params: ParameterMap) => string | string[] | null | undefined | { type: string; content: unknown; condition?: unknown; order?: number; label?: string });


