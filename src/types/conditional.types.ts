import { ParameterMap } from './parameter.types';
import { PromptComponent } from './component.types';

/**
 * Condition function that evaluates to a boolean based on parameters
 */
export type ConditionFunction = (params: ParameterMap) => boolean;

/**
 * Conditional logic structure
 * Supports if/then/else branching for components
 */
export interface Condition {
  /**
   * Condition function that evaluates to boolean
   */
  if: ConditionFunction;
  /**
   * Component(s) to include if condition is true
   */
  then: PromptComponent | PromptComponent[];
  /**
   * Optional component(s) to include if condition is false
   */
  else?: PromptComponent | PromptComponent[];
}


