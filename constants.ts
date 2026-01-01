import { AIModelConfig, AIProvider, MigrationSettings } from './types';

export const languages = [
    'SASS', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Go', 'React', 'Vue', 'Angular', 'Tailwind CSS',
    'Java', 'C#', 'C++', 'Rust', 'PHP', 'Ruby', 'Kotlin', 'Swift', 'Objective-C', 'SQL', 'NoSQL',
    'HTML', 'XML', 'JSON', 'YAML', 'Markdown', 'Bash', 'PowerShell', 'Docker Compose', 'Kubernetes YAML',
    'Terraform', 'Ansible', 'R', 'MATLAB', 'Perl', 'Scala', 'Dart', 'Elixir', 'F#', 'Haskell', 'Lua',
    'Solidity', 'GraphQL', 'gRPC', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'AWS CloudFormation',
    'Serverless Framework', 'Next.js', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Spring Boot'
];

export const exampleCodeSnippets: { [key: string]: string } = {
    'SASS': `// SASS Example
$primary-color: #333;
$font-stack: 'Roboto', sans-serif;

body {
  color: $primary-color;
  font-family: $font-stack;
  margin: 0;
  padding: 0;

  @media screen and (max-width: 768px) {
    font-size: 0.9em;
  }
}

.button {
  background-color: lighten($primary-color, 20%);
  padding: 10px 15px;
  border-radius: 5px;
  &:hover {
    background-color: darken($primary-color, 10%);
    cursor: pointer;
  }
}`,
    'JavaScript': `// JavaScript Example (ES5 to ES6+ refactoring)
var old_function = function(name, age) {
    console.log("Hello, my name is " + name + " and I am " + age + " years old.");
    var result = { name: name, age: age };
    return result;
};

var data = [1, 2, 3];
var mapped_data = data.map(function(item) {
    return item * 2;
});`,
    'Python': `## Python Example
from typing import List, Dict, Any

class Product:
    def __init__(self, name: str, price: float):
        self.name = name
        self.price = price

    def get_display_price(self) -> str:
        return f"\${self.price:.2f}"

if __name__ == "__main__":
    p = Product("Laptop", 1200.50)
    print(p.get_display_price())
`
};

export const defaultAIConfig: AIModelConfig = {
    provider: AIProvider.Gemini,
    modelName: 'gemini-3-flash-preview',
    temperature: 0.7,
    maxTokens: 4096,
    topP: 0.95,
    costPerTokenInput: 0.0001, 
    costPerTokenOutput: 0.0004,
    maxRetries: 3,
    timeoutMs: 60000,
};

export const defaultMigrationSettings: MigrationSettings = {
    aiConfig: defaultAIConfig,
    enableAutoFormat: true,
    enableLintFix: true,
    enableSecurityScan: false,
    enablePerformanceOpt: false,
    enableDiffView: true,
    enableContextualAnalysis: false,
    migrationStrategy: 'direct',
    postMigrationTesting: false,
    generateDocumentation: false,
    codeStyleGuide: 'Airbnb',
};