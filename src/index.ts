// Main builder
export { PromptBuilder } from './builders/prompt-builder';

// Component types
export { ComponentType } from './types/component.types';
export type { PromptComponent } from './types/component.types';

// Component classes
export { RoleComponent } from './components/role.component';
export { GoalComponent } from './components/goal.component';
export { InputComponent } from './components/input.component';
export { OutputComponent } from './components/output.component';
export { ContextComponent } from './components/context.component';
export { PersonaComponent } from './components/persona.component';
export { ToneComponent } from './components/tone.component';
export { FewShotsComponent } from './components/few-shots.component';
export { GuardrailsComponent } from './components/guardrails.component';
export { ConstraintsComponent } from './components/constraints.component';
export { TasksComponent } from './components/tasks.component';
export { StepsComponent } from './components/steps.component';
export { BaseComponent } from './components/base.component';

// Types
export type { ParameterMap, ContentValue, TemplateString } from './types/parameter.types';
export type { Condition, ConditionFunction } from './types/conditional.types';

// Utilities
export {
  substitute,
  resolveContent,
  extractParameters,
  validateParameters,
} from './utils/parameter-substitution';

export {
  evaluateCondition,
  filterComponentsByCondition,
  createCondition,
} from './utils/conditional-evaluator';

export {
  renderComponent,
  renderComponents,
} from './utils/prompt-renderer';

export type { RenderOptions } from './utils/prompt-renderer';


