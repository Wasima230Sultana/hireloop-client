import { LoaderCircle } from "lucide-react"

type SyncStatusProps = {
    loading: boolean
    /** Message shown while loading (spinner) and after the sync finished. */
    label: string
}

/** Small `role="status"` line with a spinner shown during a data sync. */
export function SyncStatus({ loading, label }: SyncStatusProps) {
    return (
        <p
            role="status"
            className="flex items-center gap-2 text-xs text-muted-foreground"
        >
            {loading && (
                <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
            )}
            <span>{label}</span>
        </p>
    )
}
