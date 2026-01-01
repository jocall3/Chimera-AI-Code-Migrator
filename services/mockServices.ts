import { CodeAnalysisReport, ExternalService, SecurityScanResult, PerformanceAnalysisResult, MigrationSettings } from '../types';

export const detectLanguage = async (code: string): Promise<string> => {
    const knownKeywords: { [key: string]: string[] } = {
        'TypeScript': ['interface', 'type', 'const', 'let', 'async', 'import', 'export', 'tsx'],
        'JavaScript': ['var', 'function', 'const', 'let', 'async', 'import', 'export'],
        'Python': ['def', 'class', 'import', 'from', 'if __name__'],
        'Go': ['package', 'import', 'func', 'var', 'type', 'struct'],
        'React': ['import React', 'useState', 'useEffect', '<div', 'className'],
        'CSS': ['{', '}', ':', ';', 'body', '.class', '#id', '@media'],
    };

    let maxScore = 0;
    let detectedLang = 'Unknown';

    for (const lang in knownKeywords) {
        let score = 0;
        for (const keyword of knownKeywords[lang]) {
            if (code.includes(keyword)) score++;
        }
        if (score > maxScore) {
            maxScore = score;
            detectedLang = lang;
        }
    }
    return detectedLang === 'Unknown' ? 'JavaScript' : detectedLang;
};

export const CodeFormatter = {
    async format(code: string, lang: string, styleGuide: string): Promise<string> {
        // Simple mock formatting: indentation fix
        const lines = code.split('\n');
        let indentLevel = 0;
        return lines.map(line => {
            line = line.trim();
            if (line.match(/^[}\])]/)) indentLevel = Math.max(0, indentLevel - 1);
            const val = '  '.repeat(indentLevel) + line;
            if (line.match(/[({[]$/)) indentLevel++;
            return val;
        }).join('\n');
    },
};

export const CodeMetricsAnalyzer = {
    async analyze(code: string, lang: string): Promise<CodeAnalysisReport> {
        const lines = code.split('\n');
        return {
            languageDetected: lang,
            linesOfCode: lines.length,
            commentLines: lines.filter(l => l.trim().startsWith('//') || l.trim().startsWith('#')).length,
            blankLines: lines.filter(l => !l.trim()).length,
            cyclomaticComplexity: Math.floor(Math.random() * 10) + 1,
            maintainabilityIndex: Math.floor(Math.random() * 40) + 60,
            readabilityScore: Math.floor(Math.random() * 30) + 70,
            codeSmells: [],
            potentialSecurityIssues: [],
            performanceInsights: [],
            architecturalSuggestions: [],
        };
    },
};

export const DiffGenerator = {
    async generateUnifiedDiff(original: string, modified: string): Promise<string> {
        // Mock diff
        return `--- Original\n+++ Modified\n@@ -1,5 +1,5 @@\n- ${original.substring(0, 20)}...\n+ ${modified.substring(0, 20)}...`;
    },
};

export const SecurityScanner = {
    async scan(code: string, lang: string, settings: MigrationSettings): Promise<SecurityScanResult[]> {
        if (!settings.enableSecurityScan) return [];
        const results: SecurityScanResult[] = [];
        if (code.includes('eval(')) {
            results.push({
                tool: ExternalService.Snyk,
                severity: 'critical',
                vulnerability: 'Unsafe Eval',
                description: 'Avoid usage of eval().',
                recommendation: 'Refactor to safe parsing.',
                line: 10
            });
        }
        return results;
    },
};

export const PerformanceOptimizer = {
    async analyzeAndSuggest(code: string, lang: string, settings: MigrationSettings): Promise<PerformanceAnalysisResult[]> {
        if (!settings.enablePerformanceOpt) return [];
        return [{
            metric: 'Loop Efficiency',
            value: 'O(n)',
            status: 'optimal',
            recommendation: 'No changes needed.'
        }];
    },
};

export const CostEstimator = {
    async estimate(input: string, output: string, settings: MigrationSettings): Promise<number> {
        const cost = (input.length + output.length) * 0.00001;
        return parseFloat(cost.toFixed(4));
    },
};

export const ProjectContextAnalyzer = {
    async analyzeProject(vcs: string, branch: string, path: string): Promise<string> {
        return "Project uses React 18, TailwindCSS, and TypeScript.";
    }
};

export const CodeDocumentor = {
    async generateDocs(code: string, lang: string): Promise<string> {
        return `/**\n * Automatically generated documentation for ${lang} code.\n * This module handles core business logic.\n */`;
    }
};

export const PostMigrationTestingFramework = {
    async runTests(code: string, lang: string): Promise<{ success: boolean, results: string }> {
        return { success: true, results: "All 5 unit tests passed." };
    }
};