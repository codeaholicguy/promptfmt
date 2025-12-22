import {
  PromptComponent,
  ComponentOptions,
  ComponentType,
} from '../types/component.types'
import {ContentValue, ParameterMap} from '../types/parameter.types'
import {RoleComponent} from '../components/role.component'
import {GoalComponent} from '../components/goal.component'
import {InputComponent} from '../components/input.component'
import {OutputComponent} from '../components/output.component'
import {ContextComponent} from '../components/context.component'
import {PersonaComponent} from '../components/persona.component'
import {ToneComponent} from '../components/tone.component'
import {FewShotsComponent} from '../components/few-shots.component'
import {GuardrailsComponent} from '../components/guardrails.component'
import {ConstraintsComponent} from '../components/constraints.component'
import {TasksComponent} from '../components/tasks.component'
import {StepsComponent} from '../components/steps.component'
import {cleanupOutput} from '../utils/output-cleanup'

/**
 * PromptBuilder provides a fluent API for building prompts
 * Supports all component types with parameter substitution and conditional logic
 */
export class PromptBuilder {
  private components: PromptComponent[] = []
  private nextOrder: number = 0

  /**
   * Adds a role component
   */
  role(content: ContentValue, options?: ComponentOptions): this {
    this.addComponent(new RoleComponent(content, this.getOptions(options)))
    return this
  }

  /**
   * Adds a goal component
   */
  goal(content: ContentValue, options?: ComponentOptions): this {
    this.addComponent(new GoalComponent(content, this.getOptions(options)))
    return this
  }

  /**
   * Adds an input component
   * Can accept object/record for structured inputs
   */
  input(
    content: ContentValue | Record<string, ContentValue>,
    options?: ComponentOptions,
  ): this {
    let inputContent: ContentValue

    if (
      typeof content === 'object' &&
      !Array.isArray(content) &&
      content !== null
    ) {
      // Convert object to formatted string
      const entries = Object.entries(content).map(
        ([key, value]) =>
          `- ${key}: ${
            typeof value === 'string' ? value : JSON.stringify(value)
          }`,
      )
      inputContent = entries.join('\n')
    } else {
      inputContent = content as ContentValue
    }

    this.addComponent(
      new InputComponent(inputContent, this.getOptions(options)),
    )
    return this
  }

  /**
   * Adds an output component
   */
  output(content: ContentValue, options?: ComponentOptions): this {
    this.addComponent(new OutputComponent(content, this.getOptions(options)))
    return this
  }

  /**
   * Adds a context component
   */
  context(content: ContentValue, options?: ComponentOptions): this {
    this.addComponent(new ContextComponent(content, this.getOptions(options)))
    return this
  }

  /**
   * Adds a persona component
   */
  persona(content: ContentValue, options?: ComponentOptions): this {
    this.addComponent(new PersonaComponent(content, this.getOptions(options)))
    return this
  }

  /**
   * Adds a tone component
   */
  tone(content: ContentValue, options?: ComponentOptions): this {
    this.addComponent(new ToneComponent(content, this.getOptions(options)))
    return this
  }

  /**
   * Adds a few-shots component
   * Accepts either ContentValue, an array of strings, or a function that returns an array of strings.
   * Arrays will be formatted as numbered examples when the prompt is built.
   */
  fewShots(
    content:
      | ContentValue
      | string[]
      | ((params: ParameterMap) => string | string[]),
    options?: ComponentOptions,
  ): this {
    this.addComponent(
      new FewShotsComponent(content as ContentValue, this.getOptions(options)),
    )
    return this
  }

  /**
   * Adds a guardrails component
   * Accepts either ContentValue, an array of strings, or a function that returns an array of strings.
   * Arrays will be auto-prefixed with "-" when the prompt is built.
   */
  guardrails(
    content:
      | ContentValue
      | string[]
      | ((params: ParameterMap) => string | string[]),
    options?: ComponentOptions,
  ): this {
    this.addComponent(
      new GuardrailsComponent(
        content as ContentValue,
        this.getOptions(options),
      ),
    )
    return this
  }

  /**
   * Adds a constraints component
   * Accepts either ContentValue, an array of strings, or a function that returns an array of strings.
   * Arrays will be auto-prefixed with "-" when the prompt is built.
   */
  constraints(
    content:
      | ContentValue
      | string[]
      | ((params: ParameterMap) => string | string[]),
    options?: ComponentOptions,
  ): this {
    this.addComponent(
      new ConstraintsComponent(
        content as ContentValue,
        this.getOptions(options),
      ),
    )
    return this
  }

  /**
   * Adds a tasks component
   * Accepts either ContentValue, an array of strings, or a function that returns an array of strings.
   * Arrays will be auto-prefixed with "1.", "2.", etc. when the prompt is built.
   */
  tasks(
    content:
      | ContentValue
      | string[]
      | ((params: ParameterMap) => string | string[]),
    options?: ComponentOptions,
  ): this {
    this.addComponent(
      new TasksComponent(content as ContentValue, this.getOptions(options)),
    )
    return this
  }

  /**
   * Adds a steps component
   * Accepts either ContentValue, an array of strings, or a function that returns an array of strings.
   * Arrays will be auto-prefixed with "Step 1:", "Step 2:", etc. when the prompt is built.
   */
  steps(
    content:
      | ContentValue
      | string[]
      | ((params: ParameterMap) => string | string[]),
    options?: ComponentOptions,
  ): this {
    // Store content as-is - array handling happens during build/resolve
    // This allows functions to return arrays which will be handled in resolveContent
    this.addComponent(
      new StepsComponent(content as ContentValue, this.getOptions(options)),
    )
    return this
  }

  /**
   * Adds a custom component directly
   */
  addComponent(component: PromptComponent): this {
    this.components.push(component)
    return this
  }

  /**
   * Adds multiple components at once
   */
  addComponents(components: PromptComponent[]): this {
    this.components.push(...components)
    return this
  }

  /**
   * Gets all components (useful for inspection or further processing)
   */
  getComponents(): PromptComponent[] {
    return [...this.components]
  }

  /**
   * Clears all components
   */
  clear(): this {
    this.components = []
    this.nextOrder = 0
    return this
  }

  /**
   * Builds the final prompt string
   * Filters components by conditions and resolves all content with parameters
   */
  build(params: ParameterMap = {}): string {
    // Filter components by conditions
    const activeComponents = this.filterComponentsByCondition(params)

    // Sort components by order
    const sortedComponents = this.sortComponents(activeComponents)

    // Render components to string
    return this.renderComponents(sortedComponents, params)
  }

  /**
   * Filters components based on their conditions
   */
  private filterComponentsByCondition(params: ParameterMap): PromptComponent[] {
    const result: PromptComponent[] = []

    for (const component of this.components) {
      if (component.condition) {
        // Evaluate condition
        const conditionResult = component.condition.if(params)

        if (conditionResult) {
          // Condition is true, include 'then' components
          const thenComponents = Array.isArray(component.condition.then)
            ? component.condition.then
            : [component.condition.then]
          result.push(...thenComponents)
        } else if (component.condition.else !== undefined) {
          // Condition is false, include 'else' components if defined
          const elseComponents = Array.isArray(component.condition.else)
            ? component.condition.else
            : [component.condition.else]
          result.push(...elseComponents)
        }
        // If condition is false and no else clause, skip component
      } else {
        // No condition, always include
        result.push(component)
      }
    }

    return result
  }

  /**
   * Sorts components by order (lower numbers first)
   * Components without order come after ordered ones, maintaining insertion order
   */
  private sortComponents(components: PromptComponent[]): PromptComponent[] {
    return [...components].sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
  }

  /**
   * Renders components to final prompt string
   */
  private renderComponents(
    components: PromptComponent[],
    params: ParameterMap,
  ): string {
    const sections: string[] = []

    for (const component of components) {
      const content = this.resolveContent(
        component.content,
        params,
        component.type,
      )

      if (!content.trim()) {
        continue // Skip empty components
      }

      // Format component with label if provided
      if (component.label) {
        sections.push(`${component.label}\n${content}`)
      } else {
        sections.push(content)
      }
    }

    const output = sections.join('\n\n')
    return cleanupOutput(output)
  }

  /**
   * Resolves content value to string
   * Handles special case for steps component where arrays are auto-prefixed
   */
  private resolveContent(
    content:
      | ContentValue
      | string[]
      | ((params: ParameterMap) => string | string[]),
    params: ParameterMap,
    componentType?: string,
  ): string {
    let resolved: string | string[]

    if (Array.isArray(content)) {
      // Content is directly an array (for steps)
      resolved = content
    } else if (typeof content === 'function') {
      // If content is a function, call it with params
      resolved = content(params)
    } else {
      // If content is a string (including template strings), substitute parameters
      resolved = this.substituteParameters(content, params)
    }

    // Special handling for components that support arrays: format with appropriate prefixes
    if (Array.isArray(resolved)) {
      switch (componentType) {
        case ComponentType.STEPS:
          return resolved
            .map((step, index) => `Step ${index + 1}: ${step}`)
            .join('\n')

        case ComponentType.TASKS:
          return resolved
            .map((task, index) => `${index + 1}. ${task}`)
            .join('\n')

        case ComponentType.FEW_SHOTS:
          return resolved
            .map((example, index) => `Example ${index + 1}:\n${example}`)
            .join('\n\n')

        case ComponentType.GUARDRAILS:
        case ComponentType.CONSTRAINTS:
          return resolved.map((item) => `- ${item}`).join('\n')

        default:
          // For other component types, join array items with newlines
          return resolved.join('\n')
      }
    }

    return String(resolved)
  }

  /**
   * Substitutes parameters in template strings
   */
  private substituteParameters(template: string, params: ParameterMap): string {
    return template.replace(/\$\{([^}]+)\}/g, (match, paramName) => {
      const trimmedParamName = paramName.trim()
      const value = params[trimmedParamName]

      if (value === undefined || value === null) {
        return match // Keep placeholder if param not found
      }

      return String(value)
    })
  }

  /**
   * Gets options with default order if not specified
   */
  private getOptions(options?: ComponentOptions): ComponentOptions {
    if (!options) {
      return {order: this.nextOrder++}
    }

    if (options.order === undefined) {
      return {...options, order: this.nextOrder++}
    }

    return options
  }
}
