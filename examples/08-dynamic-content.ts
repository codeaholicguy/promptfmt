/**
 * Example 8: Dynamic Content with Functions
 * 
 * This example demonstrates using functions for dynamic content
 * generation based on parameters.
 */

import { PromptBuilder } from '../dist';

const prompt = new PromptBuilder()
  .role((params) => {
    if (params.userLevel === 'beginner') {
      return 'You are a patient teacher who explains concepts simply';
    } else if (params.userLevel === 'intermediate') {
      return 'You are a knowledgeable guide who provides detailed explanations';
    } else {
      return 'You are an expert consultant who provides advanced insights';
    }
  })
  .goal((params) => {
    return `Help ${params.userName} learn ${params.topic} at ${params.userLevel} level`;
  })
  .context((params) => {
    const experience = params.experienceYears || 0;
    const background = params.background || 'general';
    
    return `User Profile:
- Name: ${params.userName}
- Experience: ${experience} years
- Background: ${background}
- Learning Style: ${params.learningStyle || 'visual'}`
  })
  .input((params) => {
    if (params.userLevel === 'beginner') {
      return `Question: ${params.question}\n\nPlease explain in simple terms.`;
    } else {
      return `Question: ${params.question}\n\nProvide detailed technical explanation.`;
    }
  })
  .tasks((params) => {
    if (params.userLevel === 'beginner') {
      return [
        'Explain the concept in simple terms',
        'Provide a basic example',
        'Relate it to something familiar'
      ];
    } else {
      return [
        'Provide detailed technical explanation',
        'Show advanced use cases',
        'Discuss edge cases and best practices'
      ];
    }
  })
  .steps((params) => {
    if (params.userLevel === 'beginner') {
      return [
        'Start with the basics',
        'Build up complexity gradually',
        'Reinforce with examples'
      ];
    }
    return [
      'Dive into technical details',
      'Show real-world applications',
      'Discuss trade-offs and alternatives'
    ];
  })
  .fewShots((params) => {
    if (params.userLevel === 'beginner') {
      return [
        `Question: What is ${params.topic}?\nAnswer: ${params.topic} is a simple way to...`,
        `Question: Why use ${params.topic}?\nAnswer: It helps you...`
      ];
    }
    return [
      `Question: Advanced ${params.topic} patterns?\nAnswer: Here are some advanced patterns...`,
      `Question: ${params.topic} best practices?\nAnswer: Key best practices include...`
    ];
  })
  .constraints((params) => {
    const constraints = [
      `Provide explanation appropriate for ${params.userLevel} level`
    ];
    if (params.userLevel === 'beginner') {
      constraints.push('Use simple language');
      constraints.push('Avoid jargon');
      constraints.push('Include visual examples');
    } else {
      constraints.push('Include technical details');
      constraints.push('Discuss advanced concepts');
    }
    return constraints;
  })
  .output((params) => {
    const length = params.userLevel === 'beginner' ? '3-5' : '5-10';
    return `Provide a ${length} sentence explanation with examples.`;
  })
  .build({
    userName: 'Alice',
    userLevel: 'beginner',
    topic: 'TypeScript',
    question: 'What are generics?',
    experienceYears: 1,
    background: 'JavaScript',
    learningStyle: 'visual'
  });

console.log('=== Dynamic Content Example (Beginner) ===');
console.log(prompt);
console.log('\n');

// Example with advanced user
const prompt2 = new PromptBuilder()
  .role((params) => {
    if (params.userLevel === 'beginner') {
      return 'You are a patient teacher';
    } else {
      return 'You are an expert consultant';
    }
  })
  .goal((params) => `Help ${params.userName} learn ${params.topic}`)
  .build({
    userName: 'Bob',
    userLevel: 'advanced',
    topic: 'Advanced TypeScript Patterns'
  });

console.log('=== Dynamic Content Example (Advanced) ===');
console.log(prompt2);
console.log('\n');

