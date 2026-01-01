import React from 'react';
import { AiCodeMigrator } from './components/AiCodeMigrator';
import { ToastProvider, Toaster, GlobalToastListener } from './components/shared/Toast';

export default function App() {
  return (
    <ToastProvider>
        <div className="min-h-screen bg-background text-text-primary font-sans antialiased selection:bg-accent-primary/30">
            <GlobalToastListener />
            <Toaster />
            <div className="max-w-[1600px] mx-auto p-4 h-screen">
                <AiCodeMigrator />
            </div>
        </div>
    </ToastProvider>
  );
}