import * as React from "react"

import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"

export type ToastType = 'default' | 'success' | 'error' | 'info';

export interface ToastProps {
    id: string;
    title?: string;
    description: string;
    type?: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, title, description, type = 'default', duration = 3000, onClose }: ToastProps) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    const icons = {
        default: null,
        success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        error: < AlertCircle className="h-5 w-5 text-destructive" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    };

    return (
        <div className="pointer-events-auto flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md border bg-background p-4 pr-6 shadow-lg transition-all animate-in slide-in-from-bottom-5 fade-in">
            < div className="flex items-start gap-3">
                {icons[type]}
                <div className="grid gap-1">
                    {
                        title && <div className="text-sm font-semibold">{title}</div>}
                    < div className="text-sm opacity-90">{description}</div>
                </div >
            </div >
            <button
                onClick={() => onClose(id)}
                className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            >
                <X className="h-4 w-4" />
            </button >
        </div >
    )
}

// Simple Toast Provider System using Zustand
import { create } from 'zustand';

interface ToastStore {
    toasts: Omit<ToastProps, 'onClose'>[];
    addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => string;
    removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
        return id;
    },
    removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function Toaster() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2">
            {
                toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={removeToast} />
                ))
            }
        </div >
    )
}
