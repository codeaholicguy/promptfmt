import { ParameterMap } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';
import { PromptComponent } from '../types/component.types';

/**
 * Evaluates a condition and returns the appropriate component(s)
 * 
 * @param condition - Condition to evaluate
 * @param params - Parameter map for condition evaluation
 * @returns Array of components to include based on condition result
 */
export function evaluateCondition(
  condition: Condition,
  params: ParameterMap
): PromptComponent[] {
  const conditionResult = condition.if(params);
  
  if (conditionResult) {
    // Condition is true, return 'then' components
    return Array.isArray(condition.then) ? condition.then : [condition.then];
  } else if (condition.else !== undefined) {
    // Condition is false and 'else' is defined, return 'else' components
    return Array.isArray(condition.else) ? condition.else : [condition.else];
  }
  
  // Condition is false and no 'else' clause, return empty array
  return [];
}

/**
 * Filters components based on their conditions
 * Components without conditions are always included
 * 
 * @param components - Array of components to filter
 * @param params - Parameter map for condition evaluation
 * @returns Filtered array of components that should be included
 */
export function filterComponentsByCondition(
  components: PromptComponent[],
  params: ParameterMap
): PromptComponent[] {
  const result: PromptComponent[] = [];
  
  for (const component of components) {
    if (component.condition) {
      // Component has a condition, evaluate it
      const conditionalComponents = evaluateCondition(component.condition, params);
      result.push(...conditionalComponents);
    } else {
      // Component has no condition, always include it
      result.push(component);
    }
  }
  
  return result;
}

/**
 * Helper function to create a condition
 * 
 * @param conditionFn - Function that evaluates to boolean
 * @param thenComponent - Component(s) to include if condition is true
 * @param elseComponent - Optional component(s) to include if condition is false
 * @returns Condition object
 */
export function createCondition(
  conditionFn: (params: ParameterMap) => boolean,
  thenComponent: PromptComponent | PromptComponent[],
  elseComponent?: PromptComponent | PromptComponent[]
): Condition {
  return {
    if: conditionFn,
    then: thenComponent,
    else: elseComponent,
  };
}


