import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateMigration } from '../services/gemini';
import { 
    detectLanguage, CodeFormatter, CodeMetricsAnalyzer, DiffGenerator, 
    SecurityScanner, PerformanceOptimizer, CostEstimator, 
    ProjectContextAnalyzer, CodeDocumentor, PostMigrationTestingFramework 
} from '../services/mockServices';
import { 
    ArrowPathIcon, Cog6ToothIcon, CircleStackIcon, RocketLaunchIcon, 
    PauseIcon, EyeIcon, MagnifyingGlassIcon, ServerStackIcon, 
    LightbulbIcon, AdjustmentsHorizontalIcon, ChatBubbleLeftRightIcon, 
    CurrencyDollarIcon, RectangleGroupIcon, BugAntIcon, ShieldCheckIcon, ComputerDesktopIcon 
} from './icons';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { MarkdownRenderer } from './shared/MarkdownRenderer';
import { languages, exampleCodeSnippets, defaultMigrationSettings } from '../constants';
import { MigrationSettings, CodeAnalysisReport, MigrationHistoryEntry, AIProvider, ExternalService, AIModelConfig } from '../types';
import { toast } from './shared/Toast';

// -- Subcomponents --

const AdvancedLanguageSelector: React.FC<{
    value: string;
    onChange: (val: string) => void;
    label: string;
    onAutoDetect?: (code: string) => Promise<void>;
    codeToAnalyze?: string;
    disabled?: boolean;
}> = ({ value, onChange, label, onAutoDetect, codeToAnalyze, disabled }) => {
    const [isDetecting, setIsDetecting] = useState(false);

    const handleAutoDetect = useCallback(async () => {
        if (!codeToAnalyze || !onAutoDetect) return;
        setIsDetecting(true);
        try {
            await onAutoDetect(codeToAnalyze);
        } finally {
            setIsDetecting(false);
        }
    }, [codeToAnalyze, onAutoDetect]);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-text-secondary mb-1">{label}:</label>
            <div className="flex space-x-2">
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="flex-grow px-3 py-2 rounded-md bg-surface border border-border focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200"
                    disabled={disabled}
                >
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
                {onAutoDetect && codeToAnalyze && (
                    <button
                        onClick={handleAutoDetect}
                        disabled={isDetecting || disabled || !codeToAnalyze.trim()}
                        className="bg-surface-light hover:bg-surface border border-border text-text-primary px-3 py-2 flex items-center justify-center rounded-md text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        title="Auto-detect language"
                    >
                        {isDetecting ? <LoadingSpinner className="w-4 h-4" /> : <MagnifyingGlassIcon className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

const CodeAnalysisReportViewer: React.FC<{ report: CodeAnalysisReport | null }> = ({ report }) => {
    if (!report) return null;
    return (
        <div className="bg-surface-dark border border-border rounded-md p-4 text-sm mt-4">
            <h3 className="text-xl font-semibold text-text-primary mb-3 flex items-center"><RectangleGroupIcon className="w-5 h-5 mr-2" /> Analysis Report</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
                <p>Lang: <span className="text-text-secondary">{report.languageDetected}</span></p>
                <p>LOC: <span className="text-text-secondary">{report.linesOfCode}</span></p>
                <p>Complexity: <span className={report.cyclomaticComplexity > 5 ? 'text-yellow-400' : 'text-green-400'}>{report.cyclomaticComplexity}</span></p>
                <p>Maintainability: <span className="text-green-400">{report.maintainabilityIndex}</span></p>
            </div>
            {report.potentialSecurityIssues && report.potentialSecurityIssues.length > 0 && (
                <div className="mt-2 text-red-400 flex items-center"><ShieldCheckIcon className="w-4 h-4 mr-2"/> {report.potentialSecurityIssues.length} Security Issues</div>
            )}
        </div>
    );
};

const MigrationSettingsPanel: React.FC<{
    settings: MigrationSettings;
    onSettingsChange: (s: MigrationSettings) => void;
    onClose: () => void;
    isOpen: boolean;
}> = ({ settings, onSettingsChange, onClose, isOpen }) => {
    if (!isOpen) return null;
    
    const updateAI = (k: keyof AIModelConfig, v: any) => onSettingsChange({ ...settings, aiConfig: { ...settings.aiConfig, [k]: v } });
    const update = (k: keyof MigrationSettings, v: any) => onSettingsChange({ ...settings, [k]: v });

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-border flex justify-between items-center bg-surface-dark">
                    <h2 className="text-xl font-bold flex items-center"><Cog6ToothIcon className="w-6 h-6 mr-2" /> Settings</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-white">✕</button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center text-accent-secondary"><LightbulbIcon className="w-5 h-5 mr-2"/> AI Model</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-text-secondary">Provider</label>
                                <select value={settings.aiConfig.provider} onChange={e => updateAI('provider', e.target.value)} className="w-full mt-1 bg-background border border-border rounded p-2">
                                    {Object.values(AIProvider).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-text-secondary">Model</label>
                                <input value={settings.aiConfig.modelName} onChange={e => updateAI('modelName', e.target.value)} className="w-full mt-1 bg-background border border-border rounded p-2" />
                            </div>
                            <div>
                                <label className="text-sm text-text-secondary">Temp</label>
                                <input type="number" step="0.1" value={settings.aiConfig.temperature} onChange={e => updateAI('temperature', parseFloat(e.target.value))} className="w-full mt-1 bg-background border border-border rounded p-2" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 space-y-4">
                         <h3 className="text-lg font-medium flex items-center text-accent-secondary"><AdjustmentsHorizontalIcon className="w-5 h-5 mr-2"/> Workflow</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" checked={settings.enableAutoFormat} onChange={e => update('enableAutoFormat', e.target.checked)} className="rounded bg-background border-border" />
                                <span className="text-sm">Auto Format</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" checked={settings.enableSecurityScan} onChange={e => update('enableSecurityScan', e.target.checked)} className="rounded bg-background border-border" />
                                <span className="text-sm">Security Scan</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" checked={settings.generateDocumentation} onChange={e => update('generateDocumentation', e.target.checked)} className="rounded bg-background border-border" />
                                <span className="text-sm">Generate Docs</span>
                            </label>
                         </div>
                    </div>
                </div>
                <div className="p-4 border-t border-border flex justify-end bg-surface-dark">
                    <button onClick={onClose} className="px-4 py-2 bg-accent-primary hover:bg-blue-600 rounded text-white font-medium">Done</button>
                </div>
            </div>
        </div>
    );
};

// -- Main Component --

export const AiCodeMigrator: React.FC = () => {
    const [inputCode, setInputCode] = useState(exampleCodeSnippets['JavaScript']);
    const [outputCode, setOutputCode] = useState('');
    const [fromLang, setFromLang] = useState('JavaScript');
    const [toLang, setToLang] = useState('Python');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState<MigrationSettings>(defaultMigrationSettings);
    const [inputReport, setInputReport] = useState<CodeAnalysisReport | null>(null);
    const [outputReport, setOutputReport] = useState<CodeAnalysisReport | null>(null);
    const [history, setHistory] = useState<MigrationHistoryEntry[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showDiff, setShowDiff] = useState(false);
    const [diffContent, setDiffContent] = useState('');
    const [progressMsg, setProgressMsg] = useState('');

    useEffect(() => {
        // Initial analysis
        analyzeInput();
    }, []);

    const analyzeInput = async () => {
        if(!inputCode.trim()) return;
        const report = await CodeMetricsAnalyzer.analyze(inputCode, fromLang);
        setInputReport(report);
    }

    const handleAutoDetect = async (code: string, setter: (s:string)=>void) => {
        const lang = await detectLanguage(code);
        setter(lang);
        toast.success(`Detected: ${lang}`);
    }

    const handleMigrate = async () => {
        if (!inputCode.trim()) {
            toast.error("Input code is empty");
            return;
        }
        setIsLoading(true);
        setError('');
        setOutputCode('');
        setProgressMsg('Initializing AI...');
        const startTime = Date.now();

        try {
            // 1. Context Analysis
            let context = "";
            if (settings.enableContextualAnalysis) {
                setProgressMsg("Analyzing project context...");
                context = await ProjectContextAnalyzer.analyzeProject("repo", "main", "src");
            }

            // 2. Generate
            setProgressMsg("Generating code with " + settings.aiConfig.modelName + "...");
            
            // Build Prompt
            const prompt = `
                You are a world-class code migration expert.
                Task: Migrate the following ${fromLang} code to ${toLang}.
                
                Project Context: ${context}
                
                Code Style: ${settings.codeStyleGuide}
                Strategy: ${settings.migrationStrategy}
                Instructions:
                - Maintain all logic and functionality.
                - Use modern ${toLang} idioms.
                - Return ONLY the code, inside a markdown block.
                ${settings.customPromptAppend || ''}

                Input Code:
                \`\`\`${fromLang}
                ${inputCode}
                \`\`\`
            `;

            let generated = await generateMigration(
                prompt, 
                settings.aiConfig.modelName, 
                settings.aiConfig.temperature,
                settings.aiConfig.maxTokens,
                settings.aiConfig.topP
            );

            // Strip markdown formatting if AI provides it, to clean up
            const match = generated.match(/```(?:\w+)?\n([\s\S]+?)```/);
            if (match) generated = match[1].trim();

            // 3. Post Processing
            if (settings.enableAutoFormat) {
                setProgressMsg("Formatting code...");
                generated = await CodeFormatter.format(generated, toLang, settings.codeStyleGuide || 'Standard');
            }

            if (settings.generateDocumentation) {
                setProgressMsg("Generating documentation...");
                const docs = await CodeDocumentor.generateDocs(generated, toLang);
                generated = docs + "\n\n" + generated;
            }

            setOutputCode(generated);

            // 4. Analysis & Testing
            setProgressMsg("Analyzing output...");
            const outReport = await CodeMetricsAnalyzer.analyze(generated, toLang);
            
            if (settings.enableSecurityScan) {
                const issues = await SecurityScanner.scan(generated, toLang, settings);
                outReport.potentialSecurityIssues = issues;
                if(issues.length > 0) toast.error(`Found ${issues.length} security issues.`);
            }

            if (settings.postMigrationTesting) {
                const testRes = await PostMigrationTestingFramework.runTests(generated, toLang);
                if(testRes.success) toast.success("Automated tests passed.");
                else toast.error("Automated tests failed.");
            }

            setOutputReport(outReport);
            
            // 5. Finalize
            const cost = await CostEstimator.estimate(inputCode, generated, settings);
            const entry: MigrationHistoryEntry = {
                id: Date.now().toString(),
                timestamp: new Date(),
                inputCode, outputCode: generated, fromLang, toLang, settings,
                status: 'success', durationMs: Date.now() - startTime, costEstimateUSD: cost
            };
            setHistory(prev => [entry, ...prev]);
            
            if(settings.enableDiffView) {
                const diff = await DiffGenerator.generateUnifiedDiff(inputCode, generated);
                setDiffContent(diff);
            }

            toast.success("Migration complete!");

        } catch (e: any) {
            console.error(e);
            setError(e.message || "Migration failed");
            toast.error("Migration failed");
        } finally {
            setIsLoading(false);
            setProgressMsg('');
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent-primary/20 rounded-lg">
                        <ArrowPathIcon className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Chimera Migrator</h1>
                        <p className="text-xs text-text-tertiary">Powered by Google Gemini</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setIsSettingsOpen(true)} className="btn-secondary px-3 py-2 flex items-center text-sm">
                        <Cog6ToothIcon className="w-5 h-5 mr-2" /> Settings
                    </button>
                    <button className="btn-secondary px-3 py-2 flex items-center text-sm">
                        <CircleStackIcon className="w-5 h-5 mr-2" /> History
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                {/* Input Column */}
                <div className="bg-surface rounded-xl shadow-lg flex flex-col overflow-hidden border border-border">
                    <div className="p-4 border-b border-border bg-surface-dark/50">
                        <AdvancedLanguageSelector 
                            label="Source" 
                            value={fromLang} 
                            onChange={setFromLang} 
                            onAutoDetect={(c) => handleAutoDetect(c, setFromLang)}
                            codeToAnalyze={inputCode}
                        />
                    </div>
                    <textarea 
                        className="flex-grow p-4 bg-background font-mono text-sm resize-none focus:outline-none"
                        placeholder="Paste code here..."
                        value={inputCode}
                        onChange={e => { setInputCode(e.target.value); if(inputReport) setInputReport(null); }}
                        onBlur={analyzeInput}
                    />
                    {inputReport && (
                        <div className="p-4 border-t border-border bg-surface-dark/30">
                            <CodeAnalysisReportViewer report={inputReport} />
                        </div>
                    )}
                </div>

                {/* Output Column */}
                <div className="bg-surface rounded-xl shadow-lg flex flex-col overflow-hidden border border-border relative">
                     <div className="p-4 border-b border-border bg-surface-dark/50 flex justify-between items-center">
                        <AdvancedLanguageSelector 
                            label="Target" 
                            value={toLang} 
                            onChange={setToLang}
                        />
                         {outputCode && settings.enableDiffView && (
                            <button 
                                onClick={() => setShowDiff(!showDiff)}
                                className={`p-2 rounded ${showDiff ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-white'}`}
                                title="Toggle Diff"
                            >
                                <EyeIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-grow bg-background relative overflow-y-auto">
                        {isLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                <LoadingSpinner className="w-10 h-10 text-accent-primary" />
                                <div className="text-accent-secondary animate-pulse font-mono">{progressMsg}</div>
                            </div>
                        ) : outputCode ? (
                            <div className="p-4 min-h-full">
                                {showDiff && diffContent ? (
                                    <pre className="font-mono text-xs whitespace-pre-wrap text-text-secondary">{diffContent}</pre>
                                ) : (
                                    <MarkdownRenderer content={`\`\`\`${toLang.toLowerCase()}\n${outputCode}\n\`\`\``} />
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-tertiary">
                                Ready to migrate code...
                            </div>
                        )}
                    </div>

                    {outputReport && !isLoading && (
                        <div className="p-4 border-t border-border bg-surface-dark/30">
                             <CodeAnalysisReportViewer report={outputReport} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center pb-4">
                {isLoading ? (
                     <button onClick={() => window.location.reload()} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-8 py-3 rounded-lg font-bold flex items-center transition-all border border-red-500/50">
                        <PauseIcon className="w-5 h-5 mr-2" /> Cancel
                    </button>
                ) : (
                    <button onClick={handleMigrate} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center">
                        <RocketLaunchIcon className="w-6 h-6 mr-2" /> Migrate Code
                    </button>
                )}
            </div>

            <MigrationSettingsPanel 
                settings={settings} 
                onSettingsChange={setSettings} 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />
        </div>
    );
};