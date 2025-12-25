import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ArrayContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Constraints component - defines limitations/rules
 */
export class ConstraintsComponent extends BaseComponent {
  constructor(
    content: ArrayContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.CONSTRAINTS, content, options);
  }
}


