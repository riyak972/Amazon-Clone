import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export interface BreadcrumbItem {
    label: string
    href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Breadcrumb">
            < ol className ="flex items-center space-x-2 text-sm text-muted-foreground">
    {
        items.map((item, index) => (
            <li key={index} className="flex items-center">
            {
                item.href ? (
                    <Link to={item.href} className="hover:text-foreground transition-colors">
                { item.label }
              </Link>
            ) : (
            <span className="font-medium text-foreground">{item.label}</span>
            )
    }
    {
        index < items.length - 1 && (
            <ChevronRight className="mx-1 h-4 w-4" />
            )
    }
          </li >
        ))
}
      </ol >
    </nav >
  )
}
