import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ArrayContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Steps component - defines sequential steps to follow
 */
export class StepsComponent extends BaseComponent {
  constructor(
    content: ArrayContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.STEPS, content, options);
  }
}


