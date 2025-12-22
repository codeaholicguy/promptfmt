import { cleanupOutput } from '../utils/output-cleanup';

describe('cleanupOutput', () => {
  describe('Basic functionality', () => {
    it('should return empty string for empty input', () => {
      expect(cleanupOutput('')).toBe('');
    });

    it('should return empty string for whitespace-only input', () => {
      expect(cleanupOutput('   ')).toBe('');
      expect(cleanupOutput('\n\n\n')).toBe('');
      expect(cleanupOutput(' \t \n \t ')).toBe('');
    });

    it('should preserve single spaces between words', () => {
      const input = 'Hello world test';
      expect(cleanupOutput(input)).toBe('Hello world test');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(cleanupOutput('  hello  ')).toBe('hello');
      expect(cleanupOutput('\nhello\n')).toBe('hello');
      expect(cleanupOutput('\t\thello\t\t')).toBe('hello');
    });
  });

  describe('Trailing whitespace removal', () => {
    it('should remove trailing spaces from each line', () => {
      const input = 'Line 1   \nLine 2\t\t\nLine 3';
      const expected = 'Line 1\nLine 2\nLine 3';
      expect(cleanupOutput(input)).toBe(expected);
    });

    it('should remove trailing tabs from each line', () => {
      const input = 'Line 1\t\t\nLine 2\t';
      const expected = 'Line 1\nLine 2';
      expect(cleanupOutput(input)).toBe(expected);
    });

    it('should remove mixed trailing whitespace', () => {
      const input = 'Line 1 \t \nLine 2\t \t';
      const expected = 'Line 1\nLine 2';
      expect(cleanupOutput(input)).toBe(expected);
    });
  });

  describe('Multiple consecutive newlines', () => {
    it('should collapse 3+ newlines to 2 newlines', () => {
      const input = 'Line 1\n\n\nLine 2';
      const expected = 'Line 1\n\nLine 2';
      expect(cleanupOutput(input)).toBe(expected);
    });

    it('should collapse 4+ newlines to 2 newlines', () => {
      const input = 'Line 1\n\n\n\nLine 2';
      const expected = 'Line 1\n\nLine 2';
      expect(cleanupOutput(input)).toBe(expected);
    });

    it('should preserve exactly 2 newlines', () => {
      const input = 'Line 1\n\nLine 2';
      expect(cleanupOutput(input)).toBe(input);
    });

    it('should handle multiple sections with excessive newlines', () => {
      const input = 'Section 1\n\n\n\nSection 2\n\n\n\nSection 3';
      const expected = 'Section 1\n\nSection 2\n\nSection 3';
      expect(cleanupOutput(input)).toBe(expected);
    });
  });

  describe('Multiple consecutive spaces/tabs', () => {
    it('should collapse multiple spaces to single space', () => {
      const input = 'Hello    world';
      expect(cleanupOutput(input)).toBe('Hello world');
    });

    it('should collapse multiple tabs to single space', () => {
      const input = 'Hello\t\t\tworld';
      expect(cleanupOutput(input)).toBe('Hello world');
    });

    it('should collapse mixed spaces and tabs to single space', () => {
      const input = 'Hello \t \t world';
      expect(cleanupOutput(input)).toBe('Hello world');
    });

    it('should handle spaces within lines but preserve newlines', () => {
      const input = 'Line 1    with    spaces\nLine 2\t\twith\ttabs';
      // Tabs are collapsed to spaces along with spaces
      const expected = 'Line 1 with spaces\nLine 2 with tabs';
      expect(cleanupOutput(input)).toBe(expected);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle all cleanup operations together', () => {
      const input = '  Line 1    \n\n\n  Line 2\t\t  \n\n\n\nLine 3   with    spaces  ';
      // Leading whitespace on lines is preserved (only trimmed from start/end of entire string)
      // Tabs become spaces, multiple spaces collapse
      const result = cleanupOutput(input);
      expect(result).toContain('Line 1');
      expect(result).toContain('Line 2');
      expect(result).toContain('Line 3 with spaces');
      expect(result).not.toMatch(/\n{3,}/); // No excessive newlines
      expect(result).not.toMatch(/[ ]{2,}/); // No multiple spaces
      expect(result).not.toMatch(/\t/); // No tabs
    });

    it('should handle prompt-like content', () => {
      const input = `Role
You are a helper


Goal
Help users    with tasks


Input
Question: ${'${question}'}`;
      const expected = `Role
You are a helper

Goal
Help users with tasks

Input
Question: ${'${question}'}`;
      expect(cleanupOutput(input)).toBe(expected);
    });

    it('should preserve intentional formatting', () => {
      const input = 'Step 1: Do this\nStep 2: Do that\n\nNote: Important info';
      expect(cleanupOutput(input)).toBe(input);
    });
  });

  describe('Edge cases', () => {
    it('should handle single character', () => {
      expect(cleanupOutput('a')).toBe('a');
    });

    it('should handle single newline', () => {
      expect(cleanupOutput('a\nb')).toBe('a\nb');
    });

    it('should handle only newlines', () => {
      expect(cleanupOutput('\n\n')).toBe('');
      expect(cleanupOutput('\n\n\n')).toBe('');
    });

    it('should handle strings with only spaces', () => {
      expect(cleanupOutput('   ')).toBe('');
    });

    it('should handle strings with only tabs', () => {
      expect(cleanupOutput('\t\t\t')).toBe('');
    });

    it('should handle empty lines with whitespace', () => {
      const input = 'Line 1\n   \nLine 2';
      const expected = 'Line 1\n\nLine 2';
      expect(cleanupOutput(input)).toBe(expected);
    });

    it('should handle very long strings', () => {
      const longLine = 'a'.repeat(1000) + '    ' + 'b'.repeat(1000);
      const result = cleanupOutput(longLine);
      expect(result).toBe('a'.repeat(1000) + ' ' + 'b'.repeat(1000));
    });
  });

  describe('Null/undefined handling', () => {
    it('should return empty string for null input', () => {
      // @ts-expect-error Testing edge case
      expect(cleanupOutput(null)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      // @ts-expect-error Testing edge case
      expect(cleanupOutput(undefined)).toBe('');
    });
  });
});

