import { cn } from "cn"

export type NoticeTone = "info" | "error"

export type NoticeState = {
    tone: NoticeTone
    message: string
}

type NoticeProps = {
    tone: NoticeTone
    children: React.ReactNode
    className?: string
}

/** Inline info / error message shown under the order summary. */
export function Notice({ tone, children, className }: NoticeProps) {
    return (
        <p
            role={tone === "error" ? "alert" : "status"}
            className={cn(
                "rounded-lg border px-3 py-2.5 text-xs",
                tone === "error"
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-border bg-muted/40 text-muted-foreground",
                className
            )}
        >
            {children}
        </p>
    )
}
