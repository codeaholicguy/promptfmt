import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Role component - defines the AI's role/identity
 */
export class RoleComponent extends BaseComponent {
  constructor(
    content: ContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.ROLE, content, options);
  }
}


