import React, { createContext, useContext, useState, useEffect } from 'react';

// A simple internal Toast implementation to replace react-hot-toast if not available
// This ensures the app is self-contained and functional.

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'blank';
}

const ToastContext = createContext<{ addToast: (msg: string, type: Toast['type']) => void } | null>(null);

export const Toaster = ({ position, reverseOrder }: any) => {
    const { toasts, removeToast } = useContext(ToastInternalContext);
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
            {toasts.map(t => (
                <div key={t.id} className={`pointer-events-auto px-4 py-3 rounded shadow-lg text-sm text-white transform transition-all duration-300 ease-in-out ${
                    t.type === 'error' ? 'bg-red-600' : 
                    t.type === 'success' ? 'bg-green-600' : 
                    'bg-gray-700'
                }`}>
                    {t.message}
                </div>
            ))}
        </div>
    );
};

const ToastInternalContext = createContext<{ toasts: Toast[], removeToast: (id: string) => void }>({ toasts: [], removeToast: () => {} });

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: Toast['type']) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    // Expose a global or hook-based toast for compatibility
    // In this structured app, we use a hook wrapper.
    return (
        <ToastInternalContext.Provider value={{ toasts, removeToast }}>
            <ToastContext.Provider value={{ addToast }}>
                {children}
            </ToastContext.Provider>
        </ToastInternalContext.Provider>
    );
};

// Simplified global access object to mimic react-hot-toast API
export const toast = {
    success: (msg: string) => window.dispatchEvent(new CustomEvent('toast', { detail: { message: msg, type: 'success' } })),
    error: (msg: string) => window.dispatchEvent(new CustomEvent('toast', { detail: { message: msg, type: 'error' } })),
    info: (msg: string) => window.dispatchEvent(new CustomEvent('toast', { detail: { message: msg, type: 'info' } })),
    // Basic shim
    dismiss: () => {},
};

// Event listener for global toast
export const GlobalToastListener = () => {
    const { addToast } = useToast();
    useEffect(() => {
        const handler = (e: any) => addToast(e.detail.message, e.detail.type);
        window.addEventListener('toast', handler);
        return () => window.removeEventListener('toast', handler);
    }, [addToast]);
    return null;
}

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
};