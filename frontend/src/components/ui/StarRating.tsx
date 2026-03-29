import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StarRating({ rating, max = 5, className }: { rating: number, max?: number, className?: string }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const empty = max - fullStars - (hasHalf ? 1 : 0);

    return (
        <div className={cn("flex items-center space-x-0.5 text-yellow-500", className)}>
            {
                [...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
                ))}
            {hasHalf && <StarHalf className="h-4 w-4 fill-current" />}
            {
                [...Array(empty)].map((_, i) => (
                    <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
                ))
            }
        </div >
    )
}
