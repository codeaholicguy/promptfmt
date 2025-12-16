import {
  substitute,
  resolveContent,
  extractParameters,
  validateParameters,
} from '../utils/parameter-substitution';

describe('Parameter Substitution', () => {
  describe('substitute', () => {
    it('should substitute single parameter', () => {
      const result = substitute('Hello ${name}', { name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('should substitute multiple parameters', () => {
      const result = substitute('Hello ${name}, age ${age}', {
        name: 'John',
        age: 25,
      });
      expect(result).toBe('Hello John, age 25');
    });

    it('should handle missing parameters by keeping placeholder', () => {
      const result = substitute('Hello ${name}', {});
      expect(result).toBe('Hello ${name}');
    });

    it('should handle null/undefined values by keeping placeholder', () => {
      // null/undefined values keep the placeholder (allows for optional parameters)
      expect(substitute('Value: ${val}', { val: null })).toBe('Value: ${val}');
      expect(substitute('Value: ${val}', { val: undefined })).toBe(
        'Value: ${val}'
      );
    });

    it('should convert non-string values to strings', () => {
      expect(substitute('Age: ${age}', { age: 25 })).toBe('Age: 25');
      expect(substitute('Active: ${active}', { active: true })).toBe(
        'Active: true'
      );
    });

    it('should handle whitespace in parameter names', () => {
      const result = substitute('Hello ${ name }', { name: 'John' });
      expect(result).toBe('Hello John');
    });
  });

  describe('resolveContent', () => {
    it('should resolve string content', () => {
      const result = resolveContent('Hello World', {});
      expect(result).toBe('Hello World');
    });

    it('should resolve template string content', () => {
      const result = resolveContent('Hello ${name}', { name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('should resolve function content', () => {
      const result = resolveContent(
        (params) => `Hello ${params.name}`,
        { name: 'John' }
      );
      expect(result).toBe('Hello John');
    });
  });

  describe('extractParameters', () => {
    it('should extract single parameter', () => {
      const result = extractParameters('Hello ${name}');
      expect(result).toEqual(['name']);
    });

    it('should extract multiple parameters', () => {
      const result = extractParameters('Hello ${name}, age ${age}');
      expect(result).toEqual(['name', 'age']);
    });

    it('should handle duplicate parameters', () => {
      const result = extractParameters('${name} and ${name}');
      expect(result).toEqual(['name']);
    });

    it('should return empty array for no parameters', () => {
      const result = extractParameters('Hello World');
      expect(result).toEqual([]);
    });
  });

  describe('validateParameters', () => {
    it('should return empty array when all parameters present', () => {
      const result = validateParameters('Hello ${name}', { name: 'John' });
      expect(result).toEqual([]);
    });

    it('should return missing parameters when not strict', () => {
      const result = validateParameters('Hello ${name}', {}, false);
      expect(result).toEqual(['name']);
    });

    it('should throw error when strict and parameters missing', () => {
      expect(() => {
        validateParameters('Hello ${name}', {}, true);
      }).toThrow('Missing required parameters: name');
    });

    it('should handle multiple missing parameters', () => {
      const result = validateParameters(
        'Hello ${name}, age ${age}',
        {},
        false
      );
      expect(result).toEqual(['name', 'age']);
    });
  });
});

