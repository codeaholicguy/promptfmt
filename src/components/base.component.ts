import { PromptComponent, ComponentType } from '../types/component.types';
import { ContentValue, ArrayContentValue } from '../types/parameter.types';
import { Condition } from '../types/conditional.types';

/**
 * Base component class that provides common functionality
 * All specific component types extend or use this pattern
 */
export class BaseComponent implements PromptComponent {
  public readonly type: ComponentType;
  public content: ContentValue | ArrayContentValue;
  public condition?: Condition;
  public order?: number;
  public label?: string;

  constructor(
    type: ComponentType,
    content: ContentValue | ArrayContentValue,
    options?: {
      condition?: Condition;
      order?: number;
      label?: string;
    }
  ) {
    this.type = type;
    this.content = content;
    this.condition = options?.condition;
    this.order = options?.order;
    this.label = options?.label;
  }

  /**
   * Creates a copy of this component with updated properties
   */
  clone(updates: Partial<PromptComponent>): BaseComponent {
    return new BaseComponent(this.type, this.content, {
      condition: updates.condition ?? this.condition,
      order: updates.order ?? this.order,
      label: updates.label ?? this.label,
    });
  }
}


