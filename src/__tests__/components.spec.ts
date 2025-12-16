import { ComponentType } from '../types/component.types';
import { RoleComponent } from '../components/role.component';
import { GoalComponent } from '../components/goal.component';
import { InputComponent } from '../components/input.component';
import { OutputComponent } from '../components/output.component';
import { ContextComponent } from '../components/context.component';
import { PersonaComponent } from '../components/persona.component';
import { ToneComponent } from '../components/tone.component';
import { FewShotsComponent } from '../components/few-shots.component';
import { GuardrailsComponent } from '../components/guardrails.component';
import { ConstraintsComponent } from '../components/constraints.component';
import { TasksComponent } from '../components/tasks.component';
import { StepsComponent } from '../components/steps.component';

describe('Component Classes', () => {
  describe('RoleComponent', () => {
    it('should create with correct type', () => {
      const component = new RoleComponent('You are a helper');
      expect(component.type).toBe(ComponentType.ROLE);
      expect(component.content).toBe('You are a helper');
    });
  });

  describe('GoalComponent', () => {
    it('should create with correct type', () => {
      const component = new GoalComponent('Help users');
      expect(component.type).toBe(ComponentType.GOAL);
    });
  });

  describe('InputComponent', () => {
    it('should create with correct type', () => {
      const component = new InputComponent('Input: ${value}');
      expect(component.type).toBe(ComponentType.INPUT);
    });
  });

  describe('OutputComponent', () => {
    it('should create with correct type', () => {
      const component = new OutputComponent('Output format');
      expect(component.type).toBe(ComponentType.OUTPUT);
    });
  });

  describe('ContextComponent', () => {
    it('should create with correct type', () => {
      const component = new ContextComponent('Background info');
      expect(component.type).toBe(ComponentType.CONTEXT);
    });
  });

  describe('PersonaComponent', () => {
    it('should create with correct type', () => {
      const component = new PersonaComponent('Persona description');
      expect(component.type).toBe(ComponentType.PERSONA);
    });
  });

  describe('ToneComponent', () => {
    it('should create with correct type', () => {
      const component = new ToneComponent('Friendly tone');
      expect(component.type).toBe(ComponentType.TONE);
    });
  });

  describe('FewShotsComponent', () => {
    it('should create with correct type', () => {
      const component = new FewShotsComponent('Example 1');
      expect(component.type).toBe(ComponentType.FEW_SHOTS);
    });
  });

  describe('GuardrailsComponent', () => {
    it('should create with correct type', () => {
      const component = new GuardrailsComponent('Safety rules');
      expect(component.type).toBe(ComponentType.GUARDRAILS);
    });
  });

  describe('ConstraintsComponent', () => {
    it('should create with correct type', () => {
      const component = new ConstraintsComponent('Constraints');
      expect(component.type).toBe(ComponentType.CONSTRAINTS);
    });
  });

  describe('TasksComponent', () => {
    it('should create with correct type', () => {
      const component = new TasksComponent('Task list');
      expect(component.type).toBe(ComponentType.TASKS);
    });
  });

  describe('StepsComponent', () => {
    it('should create with correct type', () => {
      const component = new StepsComponent('Step 1, Step 2');
      expect(component.type).toBe(ComponentType.STEPS);
    });
  });

  describe('Component Options', () => {
    it('should accept order option', () => {
      const component = new RoleComponent('Role', { order: 5 });
      expect(component.order).toBe(5);
    });

    it('should accept label option', () => {
      const component = new RoleComponent('Role', { label: 'Custom Label' });
      expect(component.label).toBe('Custom Label');
    });

    it('should accept condition option', () => {
      const condition = {
        if: () => true,
        then: new RoleComponent('Role'),
      };
      const component = new RoleComponent('Role', { condition });
      expect(component.condition).toBe(condition);
    });
  });
});


