import { BaseComponent } from './base.component';
import { ComponentType } from '../types/component.types';
import { ArrayContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Tasks component - defines list of tasks to perform
 */
export class TasksComponent extends BaseComponent {
  constructor(
    content: ArrayContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    super(ComponentType.TASKS, content, options);
  }
}


