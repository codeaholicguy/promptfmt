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
  });
});


