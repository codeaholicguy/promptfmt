import {
  evaluateCondition,
  filterComponentsByCondition,
  createCondition,
} from '../utils/conditional-evaluator';
import { Condition } from '../types/conditional.types';
import { PromptComponent } from '../types/component.types';
import { RoleComponent } from '../components/role.component';
import { GoalComponent } from '../components/goal.component';

describe('Conditional Logic', () => {
  describe('evaluateCondition', () => {
    it('should return then components when condition is true', () => {
      const condition: Condition = {
        if: () => true,
        then: new RoleComponent('Role A'),
      };

      const result = evaluateCondition(condition, {});
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Role A');
    });

    it('should return else components when condition is false', () => {
      const condition: Condition = {
        if: () => false,
        then: new RoleComponent('Role A'),
        else: new RoleComponent('Role B'),
      };

      const result = evaluateCondition(condition, {});
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Role B');
    });

    it('should return empty array when condition false and no else', () => {
      const condition: Condition = {
        if: () => false,
        then: new RoleComponent('Role A'),
      };

      const result = evaluateCondition(condition, {});
      expect(result).toEqual([]);
    });

    it('should handle array of components in then', () => {
      const condition: Condition = {
        if: () => true,
        then: [
          new RoleComponent('Role A'),
          new GoalComponent('Goal A'),
        ],
      };

      const result = evaluateCondition(condition, {});
      expect(result).toHaveLength(2);
    });

    it('should evaluate condition with parameters', () => {
      const condition: Condition = {
        if: (params) => params.age > 18,
        then: new RoleComponent('Adult Role'),
        else: new RoleComponent('Child Role'),
      };

      expect(evaluateCondition(condition, { age: 25 })[0].content).toBe(
        'Adult Role'
      );
      expect(evaluateCondition(condition, { age: 15 })[0].content).toBe(
        'Child Role'
      );
    });
  });

  describe('filterComponentsByCondition', () => {
    it('should include components without conditions', () => {
      const components: PromptComponent[] = [
        new RoleComponent('Role A'),
        new GoalComponent('Goal A'),
      ];

      const result = filterComponentsByCondition(components, {});
      expect(result).toHaveLength(2);
    });

    it('should filter components based on conditions', () => {
      const components: PromptComponent[] = [
        new RoleComponent('Role A'),
        new GoalComponent('Goal A', {
          condition: {
            if: (params) => params.includeGoal === true,
            then: new GoalComponent('Goal A'),
          },
        }),
      ];

      const result1 = filterComponentsByCondition(components, {
        includeGoal: true,
      });
      expect(result1).toHaveLength(2);

      const result2 = filterComponentsByCondition(components, {
        includeGoal: false,
      });
      expect(result2).toHaveLength(1);
    });
  });

  describe('createCondition', () => {
    it('should create a condition with then component', () => {
      const condition = createCondition(
        () => true,
        new RoleComponent('Role A')
      );

      expect(condition.if({})).toBe(true);
      expect(condition.then).toBeInstanceOf(RoleComponent);
    });

    it('should create a condition with else component', () => {
      const condition = createCondition(
        () => false,
        new RoleComponent('Role A'),
        new GoalComponent('Goal A')
      );

      expect(condition.else).toBeInstanceOf(GoalComponent);
    });
  });
});


