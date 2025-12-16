import { ParameterMap, ContentValue } from '../types/parameter.types';

/**
 * Regular expression to match parameter placeholders in template strings
 * Matches ${paramName} format
 */
const PARAM_PLACEHOLDER_REGEX = /\$\{([^}]+)\}/g;

/**
 * Substitutes parameters in a template string
 * 
 * @param template - Template string with ${paramName} placeholders
 * @param params - Parameter map with values to substitute
 * @returns String with parameters substituted
 * 
 * @example
 * substitute('Hello ${name}', { name: 'John' }) // 'Hello John'
 * substitute('Age: ${age}', { age: 25 }) // 'Age: 25'
 */
export function substitute(template: string, params: ParameterMap): string {
  return template.replace(PARAM_PLACEHOLDER_REGEX, (match, paramName) => {
    const trimmedParamName = paramName.trim();
    const value = params[trimmedParamName];
    
    if (value === undefined || value === null) {
      // If parameter is missing, return the placeholder as-is
      // This allows for optional parameters
      return match;
    }
    
    return String(value);
  });
}

/**
 * Resolves content value to a string by handling different content types
 * 
 * @param content - Content value (string, template string, or function)
 * @param params - Parameter map for substitution/evaluation
 * @returns Resolved string content
 */
export function resolveContent(
  content: ContentValue,
  params: ParameterMap = {}
): string {
  if (typeof content === 'function') {
    // If content is a function, call it with params
    return content(params);
  }
  
  // If content is a string (including template strings), substitute parameters
  return substitute(content, params);
}

/**
 * Extracts parameter names from a template string
 * Useful for validation or documentation
 * 
 * @param template - Template string to analyze
 * @returns Array of parameter names found in the template
 * 
 * @example
 * extractParameters('Hello ${name}, age ${age}') // ['name', 'age']
 */
export function extractParameters(template: string): string[] {
  const params: string[] = [];
  let match: RegExpExecArray | null;
  
  // Reset regex lastIndex
  PARAM_PLACEHOLDER_REGEX.lastIndex = 0;
  
  while ((match = PARAM_PLACEHOLDER_REGEX.exec(template)) !== null) {
    const paramName = match[1].trim();
    if (!params.includes(paramName)) {
      params.push(paramName);
    }
  }
  
  return params;
}

/**
 * Validates that all required parameters are present in the parameter map
 * 
 * @param template - Template string to validate
 * @param params - Parameter map to check
 * @param strict - If true, throws error on missing params. If false, returns missing param names
 * @returns Array of missing parameter names (if strict=false)
 * @throws Error if strict=true and parameters are missing
 */
export function validateParameters(
  template: string,
  params: ParameterMap,
  strict: boolean = false
): string[] {
  const requiredParams = extractParameters(template);
  const missingParams = requiredParams.filter(
    (param) => !(param in params) || params[param] === undefined
  );
  
  if (strict && missingParams.length > 0) {
    throw new Error(
      `Missing required parameters: ${missingParams.join(', ')}`
    );
  }
  
  return missingParams;
}


