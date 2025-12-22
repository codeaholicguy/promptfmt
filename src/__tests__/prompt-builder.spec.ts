import { PromptBuilder } from '../builders/prompt-builder';
import { createCondition } from '../utils/conditional-evaluator';
import { RoleComponent } from '../components/role.component';
import { GoalComponent } from '../components/goal.component';

describe('PromptBuilder', () => {
  let builder: PromptBuilder;

  beforeEach(() => {
    builder = new PromptBuilder();
  });

  describe('Component Addition', () => {
    it('should add role component', () => {
      builder.role('You are a helpful assistant');
      const components = builder.getComponents();
      expect(components).toHaveLength(1);
      expect(components[0].type).toBe('role');
    });

    it('should add goal component', () => {
      builder.goal('Help the user');
      const components = builder.getComponents();
      expect(components).toHaveLength(1);
      expect(components[0].type).toBe('goal');
    });

    it('should add input component', () => {
      builder.input('User question: ${question}');
      const components = builder.getComponents();
      expect(components).toHaveLength(1);
      expect(components[0].type).toBe('input');
    });

    it('should add input component with object', () => {
      builder.input({
        name: '${userName}',
        age: '${age}',
      });
      const components = builder.getComponents();
      expect(components).toHaveLength(1);
    });

    it('should chain multiple components', () => {
      builder
        .role('You are a helper')
        .goal('Help users')
        .input('Question: ${q}');

      const components = builder.getComponents();
      expect(components).toHaveLength(3);
    });
  });

  describe('Parameter Substitution', () => {
    it('should substitute parameters in template strings', () => {
      builder.role('Hello ${name}');
      const result = builder.build({ name: 'John' });
      expect(result).toContain('Hello John');
    });

    it('should handle multiple parameters', () => {
      builder.goal('Help ${userName} who is ${age} years old');
      const result = builder.build({ userName: 'John', age: 25 });
      expect(result).toContain('Help John who is 25 years old');
    });

    it('should handle function content', () => {
      builder.role((params) => `Hello ${params.name}`);
      const result = builder.build({ name: 'John' });
      expect(result).toContain('Hello John');
    });
  });

  describe('Conditional Logic', () => {
    it('should include component when condition is true', () => {
      builder.role('Default Role');
      builder.goal('Goal A', {
        condition: createCondition(
          (params) => params.includeGoal === true,
          new GoalComponent('Goal A')
        ),
      });

      const result = builder.build({ includeGoal: true });
      expect(result).toContain('Goal A');
    });

    it('should exclude component when condition is false', () => {
      builder.role('Default Role');
      builder.goal('Goal A', {
        condition: createCondition(
          (params) => params.includeGoal === true,
          new GoalComponent('Goal A')
        ),
      });

      const result = builder.build({ includeGoal: false });
      expect(result).not.toContain('Goal A');
    });

    it('should include else component when condition is false', () => {
      builder.goal('Goal A', {
        condition: createCondition(
          (params) => params.age > 18,
          new GoalComponent('Adult Goal'),
          new GoalComponent('Child Goal')
        ),
      });

      const result = builder.build({ age: 15 });
      expect(result).toContain('Child Goal');
      expect(result).not.toContain('Adult Goal');
    });
  });

  describe('Component Ordering', () => {
    it('should respect explicit order', () => {
      builder.goal('Goal', { order: 2 });
      builder.role('Role', { order: 1 });
      builder.input('Input', { order: 3 });

      const result = builder.build();
      const lines = result.split('\n\n');
      expect(lines[0]).toContain('Role');
      expect(lines[1]).toContain('Goal');
      expect(lines[2]).toContain('Input');
    });

    it('should maintain insertion order when no order specified', () => {
      builder.role('Role');
      builder.goal('Goal');
      builder.input('Input');

      const result = builder.build();
      const lines = result.split('\n\n');
      expect(lines[0]).toContain('Role');
      expect(lines[1]).toContain('Goal');
      expect(lines[2]).toContain('Input');
    });
  });

  describe('Build', () => {
    it('should build complete prompt', () => {
      builder
        .role('You are a helpful assistant')
        .goal('Answer questions')
        .input('Question: ${question}');

      const result = builder.build({ question: 'What is AI?' });
      expect(result).toContain('You are a helpful assistant');
      expect(result).toContain('Answer questions');
      expect(result).toContain('What is AI?');
    });

    it('should handle empty parameters', () => {
      builder.role('Hello ${name}');
      const result = builder.build({});
      expect(result).toContain('Hello ${name}');
    });

    it('should clean up redundant whitespace in output', () => {
      builder
        .role('You are a helper   ')
        .goal('Help users    with tasks');

      const result = builder.build();
      expect(result).not.toContain('   ');
      expect(result).toContain('You are a helper');
      expect(result).toContain('Help users with tasks');
    });

    it('should collapse excessive newlines', () => {
      builder
        .role('Role 1')
        .goal('Goal 1');

      const result = builder.build();
      // Should not have 3+ consecutive newlines
      expect(result).not.toMatch(/\n{3,}/);
    });

    it('should remove trailing whitespace from lines', () => {
      builder.role('Role with trailing spaces   \t  ');

      const result = builder.build();
      expect(result).not.toMatch(/[ \t]+\n/);
      expect(result).toContain('Role with trailing spaces');
    });

    it('should exclude components with null content', () => {
      // @ts-expect-error Testing edge case with null content
      builder.role(null);
      builder.goal('Valid goal');

      const result = builder.build();
      expect(result).not.toContain('null');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components with undefined content', () => {
      // @ts-expect-error Testing edge case with undefined content
      builder.role(undefined);
      builder.goal('Valid goal');

      const result = builder.build();
      expect(result).not.toContain('undefined');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components with empty string content', () => {
      builder.role('');
      builder.goal('Valid goal');

      const result = builder.build();
      expect(result).not.toContain('Role');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components when function returns null', () => {
      builder.role(() => null);
      builder.goal('Valid goal');

      const result = builder.build();
      expect(result).not.toContain('null');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components when function returns undefined', () => {
      builder.role(() => undefined);
      builder.goal('Valid goal');

      const result = builder.build();
      expect(result).not.toContain('undefined');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components when function returns empty string', () => {
      builder.role(() => '');
      builder.goal('Valid goal');

      const result = builder.build();
      expect(result).not.toContain('Role');
      expect(result).toContain('Valid goal');
    });

    it('should exclude array components with empty arrays', () => {
      builder.steps([]);
      builder.goal('Valid goal');

      const result = builder.build();
      expect(result).not.toContain('Step');
      expect(result).toContain('Valid goal');
    });

    it('should exclude array components with null/undefined items', () => {
      // @ts-expect-error Testing edge case
      builder.steps([null, undefined, '']);
      builder.goal('Valid goal');

      const result = builder.build();
      expect(result).not.toContain('Step');
      expect(result).toContain('Valid goal');
    });

    it('should filter out null/undefined items from arrays but keep valid ones', () => {
      // @ts-expect-error Testing edge case
      builder.steps(['Step 1', null, 'Step 2', undefined, 'Step 3']);
      const result = builder.build();
      expect(result).toContain('Step 1');
      expect(result).toContain('Step 2');
      expect(result).toContain('Step 3');
      expect(result).not.toContain('null');
      expect(result).not.toContain('undefined');
    });
  });

  describe('Clear', () => {
    it('should clear all components', () => {
      builder.role('Role').goal('Goal');
      expect(builder.getComponents()).toHaveLength(2);

      builder.clear();
      expect(builder.getComponents()).toHaveLength(0);
    });
  });

  describe('Custom Components', () => {
    it('should allow adding custom components', () => {
      const customComponent = new RoleComponent('Custom Role');
      builder.addComponent(customComponent);
      expect(builder.getComponents()).toHaveLength(1);
    });

    it('should allow adding multiple components', () => {
      builder.addComponents([
        new RoleComponent('Role 1'),
        new GoalComponent('Goal 1'),
      ]);
      expect(builder.getComponents()).toHaveLength(2);
    });
  });
});


