import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Tone component - defines communication style
 */
export class ToneComponent extends BaseComponent {
  constructor(
    content: ContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.TONE, content, options);
  }
}


