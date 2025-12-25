import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ArrayContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Guardrails component - defines safety/behavior boundaries
 */
export class GuardrailsComponent extends BaseComponent {
  constructor(
    content: ArrayContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.GUARDRAILS, content, options);
  }
}


