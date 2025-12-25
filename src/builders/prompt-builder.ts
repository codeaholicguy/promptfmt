import {
  PromptComponent,
  ComponentOptions,
} from '../types/component.types'
import {ContentValue, ArrayContentValue, ParameterMap} from '../types/parameter.types'
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
import {renderComponents as renderComponentsUtil, RenderOptions} from '../utils/prompt-renderer'

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
    content: ArrayContentValue,
    options?: ComponentOptions,
  ): this {
    this.addComponent(
      new FewShotsComponent(content, this.getOptions(options)),
    )
    return this
  }

  /**
   * Adds a guardrails component
   * Accepts either ContentValue, an array of strings, or a function that returns an array of strings.
   * Arrays will be auto-prefixed with "-" when the prompt is built.
   */
  guardrails(
    content: ArrayContentValue,
    options?: ComponentOptions,
  ): this {
    this.addComponent(
      new GuardrailsComponent(
        content,
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
    content: ArrayContentValue,
    options?: ComponentOptions,
  ): this {
    this.addComponent(
      new ConstraintsComponent(
        content,
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
    content: ArrayContentValue,
    options?: ComponentOptions,
  ): this {
    this.addComponent(
      new TasksComponent(content, this.getOptions(options)),
    )
    return this
  }

  /**
   * Adds a steps component
   * Accepts either ContentValue, an array of strings, or a function that returns an array of strings.
   * Arrays will be auto-prefixed with "Step 1:", "Step 2:", etc. when the prompt is built.
   */
  steps(
    content: ArrayContentValue,
    options?: ComponentOptions,
  ): this {
    // Store content as-is - array handling happens during build/render
    // Arrays and functions returning arrays are handled by resolveComponentContent
    this.addComponent(
      new StepsComponent(content, this.getOptions(options)),
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
   * Uses utility function but with custom options to match PromptBuilder behavior:
   * - Only includes labels if explicitly set on component (no default labels)
   * - Uses '\n\n' as separator
   */
  private renderComponents(
    components: PromptComponent[],
    params: ParameterMap,
  ): string {
    const options: RenderOptions = {
      separator: '\n\n',
      includeLabels: true,
      // Only include label if component.label is explicitly set
      // Return empty string if no label, which will be filtered out
      labelFormatter: (component) => component.label || '',
      skipEmpty: true,
    }

    return renderComponentsUtil(components, params, options)
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