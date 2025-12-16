/**
 * Example 5: Complex Example - Code Review Assistant
 * 
 * This example demonstrates a sophisticated code review assistant that adapts
 * based on programming language, code complexity, reviewer expertise level,
 * and review focus areas. It showcases conditional logic, parameter substitution,
 * and dynamic content generation.
 */

import { PromptBuilder, createCondition, PersonaComponent, ToneComponent } from '../dist';

interface CodeReviewContext {
  language: string;
  framework?: string;
  codeComplexity: 'simple' | 'moderate' | 'complex';
  reviewerLevel: 'junior' | 'mid' | 'senior' | 'expert';
  focusAreas?: string[];
  codeSnippet: string;
  fileName: string;
  authorName: string;
}

function buildCodeReviewPrompt(context: CodeReviewContext) {
  const {
    language,
    framework,
    codeComplexity,
    reviewerLevel,
    focusAreas = [],
    codeSnippet,
    fileName,
    authorName,
  } = context;

  // Determine review depth based on complexity and reviewer level
  const isDeepReview = codeComplexity === 'complex' || reviewerLevel === 'senior' || reviewerLevel === 'expert';
  const isBeginnerFriendly = reviewerLevel === 'junior';

  // Build focus areas string
  const focusAreasStr = focusAreas.length > 0 
    ? focusAreas.join(', ')
    : 'code quality, best practices, performance, security, maintainability';

  const builder = new PromptBuilder()
    .role('You are an expert code reviewer with deep knowledge of software engineering best practices')
    .goal(`Provide a comprehensive code review for ${authorName}'s code in ${fileName}`)
    
    // Persona based on reviewer level
    .persona('Mentor', {
      condition: createCondition(
        (params) => params.reviewerLevel === 'junior' || params.reviewerLevel === 'mid',
        new PersonaComponent(`You are a supportive mentor. Explain concepts clearly, provide learning opportunities, and be encouraging while pointing out areas for improvement.`)
      )
    })
    .persona('Expert Consultant', {
      condition: createCondition(
        (params) => params.reviewerLevel === 'senior' || params.reviewerLevel === 'expert',
        new PersonaComponent(`You are an expert consultant. Provide deep technical insights, architectural considerations, and advanced optimization suggestions. Be direct but respectful.`)
      )
    })
    
    // Tone based on complexity and reviewer level
    .tone('Educational and Encouraging', {
      condition: createCondition(
        (params) => params.isBeginnerFriendly === true,
        new ToneComponent('Use clear, educational language. Explain the "why" behind suggestions. Be encouraging and supportive.')
      )
    })
    .tone('Professional and Direct', {
      condition: createCondition(
        (params) => params.isBeginnerFriendly === false,
        new ToneComponent('Use professional, concise language. Focus on actionable feedback without over-explaining basics.')
      )
    })
    
    // Context about the codebase
    .context(`Code Review Context:
- Programming Language: ${language}
${framework ? `- Framework: ${framework}` : ''}
- Code Complexity: ${codeComplexity}
- Reviewer Level: ${reviewerLevel}
- File: ${fileName}
- Author: ${authorName}
- Review Date: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`)
    
    // Input - the code to review
    .input(`Code to Review:
\`\`\`${language}
${codeSnippet}
\`\`\`

Focus Areas: ${focusAreasStr}`)
    
    // Tasks based on review depth - using array for auto-prefixing
    .tasks((params) => {
      if (params.isDeepReview) {
        return [
          'Analyze code structure and architecture',
          'Review code quality and best practices',
          'Check for performance bottlenecks',
          'Identify security vulnerabilities',
          'Assess maintainability and readability',
          'Review error handling and edge cases',
          'Check test coverage considerations',
          'Provide specific improvement suggestions with code examples'
        ];
      } else {
        return [
          'Review code quality and best practices',
          'Check for common issues and bugs',
          'Assess readability and maintainability',
          'Provide improvement suggestions'
        ];
      }
    })
    
    // Steps for the review process - using array for auto-prefixing
    .steps((params) => {
      if (params.isDeepReview) {
        return [
          'High-level architecture review',
          'Line-by-line code analysis',
          'Performance and optimization review',
          'Security audit',
          'Best practices compliance check',
          'Documentation and comments review',
          'Compile comprehensive feedback'
        ];
      } else {
        return [
          'Quick code scan for obvious issues',
          'Best practices check',
          'Provide feedback'
        ];
      }
    })
    
    // Guardrails specific to code review - using array for auto-prefixing
    .guardrails([
      'Be constructive and respectful at all times',
      'Focus on the code, not the person',
      'Provide actionable feedback, not just criticism',
      'Consider the context and constraints of the project',
      "Don't suggest changes that would break existing functionality without discussion",
      'Respect the author\'s coding style while suggesting improvements',
      'If unsure about a suggestion, mark it as "consider" rather than "must change"'
    ])
    
    // Constraints based on reviewer level - using array for auto-prefixing
    .constraints((params) => {
      const constraints = [
        `Review should be appropriate for ${params.reviewerLevel} level reviewer`,
        `Focus on ${params.focusAreasStr}`,
      ];
      
      if (params.isBeginnerFriendly) {
        constraints.push('Explain technical terms when used');
        constraints.push('Provide examples for complex suggestions');
      }
      
      if (params.isDeepReview) {
        constraints.push('Include architectural considerations');
        constraints.push('Provide performance metrics if applicable');
      }
      
      return constraints;
    })
    
    // Output format
    .output((params) => {
      const sections = [
        '## Summary',
        'Provide a brief overview (2-3 sentences)',
        '',
        '## Strengths',
        'List what the code does well',
        '',
        '## Areas for Improvement',
        'Organize by priority (Critical, High, Medium, Low)',
        '',
        '## Specific Suggestions',
        'For each suggestion, include:',
        '- The issue or improvement',
        '- Why it matters',
        '- Suggested code change (if applicable)',
        '',
        '## Questions',
        'Any questions or clarifications needed',
      ];
      
      if (params.isDeepReview) {
        sections.push('', '## Architecture Notes', 'High-level considerations and patterns');
        sections.push('', '## Performance Considerations', 'Any performance-related observations');
      }
      
      return sections.join('\n');
    });

  return builder.build({
    reviewerLevel,
    isBeginnerFriendly,
    isDeepReview,
    language,
    framework: framework || '',
    codeComplexity,
    focusAreasStr,
  });
}

// Example 1: Simple code review for junior developer
const prompt1 = buildCodeReviewPrompt({
  language: 'TypeScript',
  framework: 'React',
  codeComplexity: 'simple',
  reviewerLevel: 'junior',
  focusAreas: ['readability', 'best practices'],
  codeSnippet: `function add(a: number, b: number) {
  return a + b;
}`,
  fileName: 'utils.ts',
  authorName: 'Alice',
});

console.log('=== Complex Example: Code Review Assistant (Junior Reviewer) ===');
console.log(prompt1);
console.log('\n');

// Example 2: Complex code review for senior developer
const prompt2 = buildCodeReviewPrompt({
  language: 'TypeScript',
  framework: 'NestJS',
  codeComplexity: 'complex',
  reviewerLevel: 'senior',
  focusAreas: ['performance', 'security', 'architecture'],
  codeSnippet: `@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

  async findUserById(id: string): Promise<User> {
    const cached = await this.cacheService.get(\`user:\${id}\`);
    if (cached) return cached;
    
    const user = await this.userRepository.findOne({ where: { id } });
    await this.cacheService.set(\`user:\${id}\`, user, 3600);
    return user;
  }
}`,
  fileName: 'user.service.ts',
  authorName: 'Bob',
});

console.log('=== Complex Example: Code Review Assistant (Senior Reviewer) ===');
console.log(prompt2);
console.log('\n');

// Example 3: Moderate complexity for mid-level developer
const prompt3 = buildCodeReviewPrompt({
  language: 'Python',
  codeComplexity: 'moderate',
  reviewerLevel: 'mid',
  focusAreas: ['error handling', 'code quality'],
  codeSnippet: `def process_data(data: list) -> dict:
    result = {}
    for item in data:
        key = item.get('id')
        value = item.get('value')
        result[key] = value * 2
    return result`,
  fileName: 'data_processor.py',
  authorName: 'Charlie',
});

console.log('=== Complex Example: Code Review Assistant (Mid-Level Reviewer) ===');
console.log(prompt3);
console.log('\n');
