import {ContentValue, ParameterMap} from '../types/parameter.types'
import {ComponentType} from '../types/component.types'
import {resolveContent} from './parameter-substitution'

/**
 * Filters out null, undefined, and empty string items from an array
 */
function filterValidArrayItems(
  items: (string | null | undefined)[],
): string[] {
  return items.filter(
    (item) => item !== null && item !== undefined && item !== '',
  ) as string[]
}

/**
 * Formats an array of strings based on component type
 */
function formatArrayContent(
  items: string[],
  componentType: ComponentType,
): string {
  // Filter out null/undefined/empty items
  const filtered = filterValidArrayItems(items)

  if (filtered.length === 0) {
    return ''
  }

  switch (componentType) {
    case ComponentType.STEPS:
      return filtered
        .map((step, index) => `Step ${index + 1}: ${step}`)
        .join('\n')

    case ComponentType.TASKS:
      return filtered
        .map((task, index) => `${index + 1}. ${task}`)
        .join('\n')

    case ComponentType.FEW_SHOTS:
      return filtered
        .map((example, index) => `Example ${index + 1}:\n${example}`)
        .join('\n\n')

    case ComponentType.GUARDRAILS:
    case ComponentType.CONSTRAINTS:
      return filtered.map((item) => `- ${item}`).join('\n')

    default:
      // For other component types, join array items with newlines
      return filtered.join('\n')
  }
}

/**
 * Resolves component content to a string, handling arrays, functions, and strings
 * This extends resolveContent to handle array content types
 * 
 * @param content - Content value that can be:
 *   - ContentValue (string, template string, or function returning string)
 *   - string[] (array of strings for array-based components)
 *   - Function returning string | string[] (dynamic array content)
 * @param params - Parameter map for substitution/evaluation
 * @param componentType - Optional component type for array formatting (steps, tasks, etc.)
 * @returns Resolved string content, or empty string if content is null/undefined/empty
 */
export function resolveComponentContent(
  content: ContentValue | string[] | ((params: ParameterMap) => string | string[]),
  params: ParameterMap,
  componentType?: ComponentType,
): string {
  // Handle null/undefined content
  if (content === null || content === undefined) {
    return ''
  }

  // Handle arrays
  if (Array.isArray(content)) {
    if (componentType) {
      return formatArrayContent(content, componentType)
    }
    // If no component type, filter and join with newlines
    const filtered = filterValidArrayItems(content)
    return filtered.length === 0 ? '' : filtered.join('\n')
  }

  // Handle functions that might return arrays
  if (typeof content === 'function') {
    const result = content(params)
    
    // Handle functions that return null/undefined
    if (result === null || result === undefined) {
      return ''
    }

    // Handle functions that return arrays
    if (Array.isArray(result)) {
      if (componentType) {
        return formatArrayContent(result, componentType)
      }
      const filtered = filterValidArrayItems(result)
      return filtered.length === 0 ? '' : filtered.join('\n')
    }

    // Function returned a string
    return result
  }

  // Handle strings (including template strings) - use resolveContent
  return resolveContent(content, params)
}

