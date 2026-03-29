import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

export interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    side?: 'left' | 'right'
    children: React.ReactNode
    className?: string
}

export function Drawer({ isOpen, onClose, side = 'right', children, className }: DrawerProps) {
    React.useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            < div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

            < div
                className={
                    cn(
                        "relative z-50 h-full w-full max-w-sm bg-background p-6 shadow-xl transition-transform duration-300 ease-in-out",
                        side === 'left' ? 'animate-in slide-in-from-left' : 'ml-auto animate-in slide-in-from-right',
                        className
                    )
                }
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <X className="h-5 w-5" />
                    < span className="sr-only">Close</span>
                </button >
                <div className="h-full overflow-y-auto mt-6">
                    {children}
                </div >
            </div >
        </div >
    )
}
