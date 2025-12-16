import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Context component - provides background information
 */
export class ContextComponent extends BaseComponent {
  constructor(
    content: ContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.CONTEXT, content, options);
  }
}


