export enum AIProvider {
    ChatGPT = 'ChatGPT (OpenAI)',
    Gemini = 'Gemini (Google)',
    Claude = 'Claude (Anthropic)',
    Llama = 'Llama (Meta)',
    Mistral = 'Mistral AI',
    Grok = 'Grok (xAI)',
    Falcon = 'Falcon (TII)',
    Cohere = 'Cohere',
    AzureOpenAI = 'Azure OpenAI',
    AWSBedrock = 'AWS Bedrock',
    GoogleVertexAI = 'Google Vertex AI',
    CustomFineTuned = 'Custom Fine-Tuned Model',
}

export enum ExternalService {
    GitHub = 'GitHub',
    GitLab = 'GitLab',
    AzureDevOps = 'Azure DevOps',
    Bitbucket = 'Bitbucket',
    GitHubActions = 'GitHub Actions',
    Jenkins = 'Jenkins',
    GitLabCI = 'GitLab CI',
    AzurePipelines = 'Azure Pipelines',
    AWS = 'Amazon Web Services',
    Azure = 'Microsoft Azure',
    GCP = 'Google Cloud Platform',
    Snyk = 'Snyk',
    SonarQube = 'SonarQube',
    GitGuardian = 'GitGuardian',
    // ... Simplified for brevity, assume others exist if needed
}

export interface AIModelConfig {
    provider: AIProvider;
    modelName: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    costPerTokenInput?: number;
    costPerTokenOutput?: number;
    maxRetries?: number;
    timeoutMs?: number;
}

export interface MigrationSettings {
    aiConfig: AIModelConfig;
    enableAutoFormat: boolean;
    enableLintFix: boolean;
    enableSecurityScan: boolean;
    enablePerformanceOpt: boolean;
    enableDiffView: boolean;
    enableContextualAnalysis: boolean;
    targetVCSIntegration?: ExternalService;
    targetCIIntegration?: ExternalService;
    targetCloudPlatform?: ExternalService;
    codeReviewerAI?: AIProvider;
    costLimitUSD?: number;
    complexityThreshold?: number;
    migrationStrategy: 'direct' | 'refactor_then_migrate' | 'incremental';
    customPromptAppend?: string;
    postMigrationTesting?: boolean;
    generateDocumentation?: boolean;
    codeStyleGuide?: string;
}

export interface MigrationHistoryEntry {
    id: string;
    timestamp: Date;
    inputCode: string;
    outputCode: string;
    fromLang: string;
    toLang: string;
    settings: MigrationSettings;
    status: 'success' | 'failed' | 'partial';
    durationMs: number;
    costEstimateUSD?: number;
    feedback?: number;
    errorMessage?: string;
    diff?: string;
}

export interface SecurityScanResult {
    tool: ExternalService;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    vulnerability: string;
    line?: number;
    description: string;
    recommendation: string;
    cve?: string;
}

export interface PerformanceAnalysisResult {
    metric: string;
    value: number | string;
    unit?: string;
    threshold?: number;
    status: 'optimal' | 'warning' | 'critical';
    recommendation: string;
}

export interface CodeAnalysisReport {
    languageDetected: string;
    linesOfCode: number;
    commentLines: number;
    blankLines: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    readabilityScore: number;
    dependencies?: string[];
    potentialSecurityIssues?: SecurityScanResult[];
    performanceInsights?: PerformanceAnalysisResult[];
    codeSmells?: { description: string; line: number; severity: string }[];
    architecturalSuggestions?: string[];
}

export interface MigrationStreamEvent {
    type: 'progress' | 'output' | 'error' | 'status' | 'analysis_update' | 'cost_update';
    payload: string | number | CodeAnalysisReport;
    timestamp: Date;
}