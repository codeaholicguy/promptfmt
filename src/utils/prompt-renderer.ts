import {PromptComponent} from '../types/component.types'
import {ParameterMap} from '../types/parameter.types'
import {resolveContent} from './parameter-substitution'
import {cleanupOutput} from './output-cleanup'

/**
 * Rendering options for prompt formatting
 */
export interface RenderOptions {
  /**
   * Separator between components (default: '\n\n')
   */
  separator?: string
  /**
   * Whether to include component labels/headers (default: true)
   */
  includeLabels?: boolean
  /**
   * Custom formatter for component labels
   */
  labelFormatter?: (component: PromptComponent) => string
  /**
   * Whether to skip empty components (default: true)
   */
  skipEmpty?: boolean
}

/**
 * Default rendering options
 */
const DEFAULT_OPTIONS: Required<RenderOptions> = {
  separator: '\n\n',
  includeLabels: true,
  labelFormatter: (component) => {
    if (component.label) {
      return component.label
    }
    // Default label based on component type
    const typeLabels: Record<string, string> = {
      role: 'Role',
      goal: 'Goal',
      input: 'Input',
      output: 'Output',
      context: 'Context',
      persona: 'Persona',
      tone: 'Tone',
      'few-shots': 'Examples',
      guardrails: 'Guardrails',
      constraints: 'Constraints',
      tasks: 'Tasks',
      steps: 'Steps',
    }
    return typeLabels[component.type] || component.type.toUpperCase()
  },
  skipEmpty: true,
}

/**
 * Renders a single component to string
 */
export function renderComponent(
  component: PromptComponent,
  params: ParameterMap,
  options: Required<RenderOptions> = DEFAULT_OPTIONS,
): string {
  const content = resolveContent(component.content, params)

  if (options.skipEmpty && !content.trim()) {
    return ''
  }

  if (options.includeLabels) {
    const label = options.labelFormatter(component)
    return `${label}\n${content}`
  }

  return content
}

/**
 * Renders multiple components to a single prompt string
 */
export function renderComponents(
  components: PromptComponent[],
  params: ParameterMap = {},
  options: RenderOptions = {},
): string {
  const mergedOptions: Required<RenderOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
    labelFormatter: options.labelFormatter || DEFAULT_OPTIONS.labelFormatter,
  }

  const renderedSections = components
    .map((component) => renderComponent(component, params, mergedOptions))
    .filter((section) => section.length > 0)

  const output = renderedSections.join(mergedOptions.separator)
  return cleanupOutput(output)
}
