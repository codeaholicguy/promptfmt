import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Output component - defines expected output format/requirements
 */
export class OutputComponent extends BaseComponent {
  constructor(
    content: ContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.OUTPUT, content, options);
  }
}


