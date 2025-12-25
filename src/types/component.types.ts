import { ContentValue, ArrayContentValue } from './parameter.types';
import { Condition } from './conditional.types';

/**
 * Component types available in the prompt system
 */
export enum ComponentType {
  ROLE = 'role',
  GOAL = 'goal',
  INPUT = 'input',
  OUTPUT = 'output',
  CONTEXT = 'context',
  PERSONA = 'persona',
  TONE = 'tone',
  FEW_SHOTS = 'few-shots',
  GUARDRAILS = 'guardrails',
  CONSTRAINTS = 'constraints',
  TASKS = 'tasks',
  STEPS = 'steps',
}

/**
 * Base prompt component interface
 */
export interface PromptComponent {
  /**
   * Type of component
   */
  type: ComponentType;
  /**
   * Content of the component - can be static, template string, function, or array
   * (arrays are supported for array-based components like few-shots, guardrails, etc.)
   */
  content: ContentValue | ArrayContentValue;
  /**
   * Optional condition for conditional inclusion
   */
  condition?: Condition;
  /**
   * Optional order for component sequencing (lower numbers appear first)
   * If not specified, components appear in insertion order
   */
  order?: number;
  /**
   * Optional label/header for the component section
   */
  label?: string;
}

/**
 * Options for adding components
 */
export interface ComponentOptions {
  /**
   * Optional condition for conditional inclusion
   */
  condition?: Condition;
  /**
   * Optional order for component sequencing (lower numbers appear first)
   * If not specified, components appear in insertion order
   */
  order?: number;
  /**
   * Optional label/header for the component section
   */
  label?: string;
}
