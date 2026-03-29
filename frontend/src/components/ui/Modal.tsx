import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            < div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            < div className={
                cn("relative z-50 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg animate-in fade-in zoom-in-95", className)}>
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="text-lg font-semibold">{title}</h2>}
                    < button
                        onClick={onClose}
                        className="rounded-full p-1 opacity-70 hover:bg-accent hover:opacity-100 transition-opacity"
                    >
                        <X className="h-4 w-4" />
                        < span className="sr-only">Close</span>
                    </button >
                </div >
                <div>
                    {children}
                </div>
            </div >
        </div >
    )
}
