import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ArrayContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Few-shots component - provides example inputs/outputs
 */
export class FewShotsComponent extends BaseComponent {
  constructor(
    content: ArrayContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.FEW_SHOTS, content, options);
  }
}


