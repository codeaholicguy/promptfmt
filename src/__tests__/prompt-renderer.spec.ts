import { renderComponent, renderComponents } from '../utils/prompt-renderer';
import { RoleComponent } from '../components/role.component';
import { GoalComponent } from '../components/goal.component';

describe('Prompt Renderer', () => {
  describe('renderComponent', () => {
    it('should render component with label', () => {
      const component = new RoleComponent('You are a helper', {
        label: 'Role',
      });
      const result = renderComponent(component, {});
      expect(result).toContain('Role');
      expect(result).toContain('You are a helper');
    });

    it('should render component without label when includeLabels is false', () => {
      const component = new RoleComponent('You are a helper');
      const result = renderComponent(component, {}, {
        includeLabels: false,
        separator: '\n\n',
        labelFormatter: () => '',
        skipEmpty: true,
      });
      expect(result).toBe('You are a helper');
    });

    it('should skip empty components when skipEmpty is true', () => {
      const component = new RoleComponent('   ');
      const result = renderComponent(component, {}, {
        skipEmpty: true,
        separator: '\n\n',
        includeLabels: true,
        labelFormatter: () => 'Role',
      });
      expect(result).toBe('');
    });

    it('should substitute parameters', () => {
      const component = new RoleComponent('Hello ${name}');
      const result = renderComponent(component, { name: 'John' });
      expect(result).toContain('Hello John');
    });
  });

  describe('renderComponents', () => {
    it('should render multiple components', () => {
      const components = [
        new RoleComponent('Role A'),
        new GoalComponent('Goal A'),
      ];
      const result = renderComponents(components, {});
      expect(result).toContain('Role A');
      expect(result).toContain('Goal A');
    });

    it('should use custom separator', () => {
      const components = [
        new RoleComponent('Role A'),
        new GoalComponent('Goal A'),
      ];
      const result = renderComponents(components, {}, { separator: '---' });
      expect(result).toContain('---');
    });

    it('should filter empty components', () => {
      const components = [
        new RoleComponent('Role A'),
        new RoleComponent('   '),
        new GoalComponent('Goal A'),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toContain('   ');
    });

    it('should clean up redundant whitespace in output', () => {
      const components = [
        new RoleComponent('Role with   multiple   spaces'),
        new GoalComponent('Goal with\t\t\ttabs'),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toContain('   ');
      expect(result).not.toContain('\t\t');
      expect(result).toContain('Role with multiple spaces');
      expect(result).toContain('Goal with tabs');
    });

    it('should collapse excessive newlines', () => {
      const components = [
        new RoleComponent('Role 1'),
        new GoalComponent('Goal 1'),
      ];
      const result = renderComponents(components, {});
      // Should not have 3+ consecutive newlines
      expect(result).not.toMatch(/\n{3,}/);
    });

    it('should remove trailing whitespace from lines', () => {
      const components = [
        new RoleComponent('Role with trailing   \t  '),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toMatch(/[ \t]+\n/);
      expect(result).toContain('Role with trailing');
    });

    it('should exclude components with null content', () => {
      // @ts-expect-error Testing edge case with null content
      const components = [
        new RoleComponent(null),
        new GoalComponent('Valid goal'),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toContain('null');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components with undefined content', () => {
      // @ts-expect-error Testing edge case with undefined content
      const components = [
        new RoleComponent(undefined),
        new GoalComponent('Valid goal'),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toContain('undefined');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components with empty string content', () => {
      const components = [
        new RoleComponent(''),
        new GoalComponent('Valid goal'),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toContain('Role');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components when function returns null', () => {
      const components = [
        new RoleComponent(() => null),
        new GoalComponent('Valid goal'),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toContain('null');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components when function returns undefined', () => {
      const components = [
        new RoleComponent(() => undefined),
        new GoalComponent('Valid goal'),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toContain('undefined');
      expect(result).toContain('Valid goal');
    });

    it('should exclude components when function returns empty string', () => {
      const components = [
        new RoleComponent(() => ''),
        new GoalComponent('Valid goal'),
      ];
      const result = renderComponents(components, {});
      expect(result).not.toContain('Role');
      expect(result).toContain('Valid goal');
    });
  });
});


