/**
 * Test file for Example 1: Basic Usage
 * 
 * This demonstrates how to test prompts built with promptfmt
 */

import { PromptBuilder } from '../../src/builders/prompt-builder';

describe('Example 1: Basic Usage', () => {
  it('should build a basic prompt with all components', () => {
    const builder = new PromptBuilder()
      .role('You are a helpful assistant')
      .goal('Answer user questions clearly and concisely')
      .input('User question: ${question}')
      .steps([
        'Understand the question',
        'Provide a clear answer',
        'Include relevant examples if needed'
      ])
      .constraints([
        'Keep response concise (2-3 sentences)',
        'Use simple language',
        'Be accurate and helpful'
      ])
      .output('Provide a clear answer in 2-3 sentences');

    const prompt = builder.build({
      question: 'What is TypeScript?'
    });

    // Test that all components are present
    expect(prompt).toContain('You are a helpful assistant');
    expect(prompt).toContain('Answer user questions clearly and concisely');
    expect(prompt).toContain('User question: What is TypeScript?');
    expect(prompt).toContain('Step 1: Understand the question');
    expect(prompt).toContain('Step 2: Provide a clear answer');
    expect(prompt).toContain('Step 3: Include relevant examples if needed');
    expect(prompt).toContain('- Keep response concise (2-3 sentences)');
    expect(prompt).toContain('- Use simple language');
    expect(prompt).toContain('- Be accurate and helpful');
    expect(prompt).toContain('Provide a clear answer in 2-3 sentences');
  });

  it('should handle parameter substitution correctly', () => {
    const builder = new PromptBuilder()
      .role('You are a helpful assistant')
      .input('User question: ${question}');

    const prompt1 = builder.build({ question: 'What is TypeScript?' });
    expect(prompt1).toContain('User question: What is TypeScript?');

    const prompt2 = builder.build({ question: 'How does React work?' });
    expect(prompt2).toContain('User question: How does React work?');
  });

  it('should format arrays correctly for steps', () => {
    const builder = new PromptBuilder()
      .steps([
        'First step',
        'Second step',
        'Third step'
      ]);

    const prompt = builder.build();
    
    expect(prompt).toContain('Step 1: First step');
    expect(prompt).toContain('Step 2: Second step');
    expect(prompt).toContain('Step 3: Third step');
  });

  it('should format arrays correctly for constraints', () => {
    const builder = new PromptBuilder()
      .constraints([
        'Constraint 1',
        'Constraint 2',
        'Constraint 3'
      ]);

    const prompt = builder.build();
    
    expect(prompt).toContain('- Constraint 1');
    expect(prompt).toContain('- Constraint 2');
    expect(prompt).toContain('- Constraint 3');
  });

  it('should maintain component order', () => {
    const builder = new PromptBuilder()
      .role('Role')
      .goal('Goal')
      .input('Input')
      .output('Output');

    const prompt = builder.build();
    const lines = prompt.split('\n\n');
    
    // Check that components appear in the order they were added
    expect(lines[0]).toContain('Role');
    expect(lines[1]).toContain('Goal');
    expect(lines[2]).toContain('Input');
    expect(lines[3]).toContain('Output');
  });

  it('should handle empty parameters gracefully', () => {
    const builder = new PromptBuilder()
      .input('User question: ${question}');

    const prompt = builder.build({});
    
    // Should keep placeholder if parameter is missing
    expect(prompt).toContain('User question: ${question}');
  });
});


