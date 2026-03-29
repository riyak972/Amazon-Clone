import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./Button"

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-2 my-4">
            < Button
    variant ="outline"
    size ="icon"
    onClick = {() => onPageChange(currentPage - 1)
}
disabled = { currentPage <= 1}
      >
    <ChevronLeft className="h-4 w-4" />
        < span className ="sr-only">Previous Page</span>
      </Button >

    <span className="text-sm font-medium">
        Page { currentPage } of { totalPages }
      </span >

    <Button
        variant="outline"
size ="icon"
onClick = {() => onPageChange(currentPage + 1)}
disabled = { currentPage >= totalPages}
      >
    <ChevronRight className="h-4 w-4" />
        < span className ="sr-only">Next Page</span>
      </Button >
    </div >
  )
}
