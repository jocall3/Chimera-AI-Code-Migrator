import React from 'react';

// A simple renderer that handles code blocks specifically, as that's the core requirement.
export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Basic parser for code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="prose prose-invert max-w-none text-sm font-mono whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    const match = part.match(/```(\w*)\n([\s\S]*?)```/);
                    if (match) {
                        const [, lang, code] = match;
                        return (
                            <div key={index} className="my-4 rounded-md overflow-hidden border border-border bg-surface-dark">
                                <div className="px-4 py-1 bg-surface border-b border-border text-xs text-text-secondary uppercase">
                                    {lang || 'code'}
                                </div>
                                <pre className="p-4 overflow-x-auto">
                                    <code className="text-text-primary">{code.trim()}</code>
                                </pre>
                            </div>
                        );
                    }
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};