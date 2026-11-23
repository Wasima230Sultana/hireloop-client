type ErrorAlertProps = {
    message: string
}

/** Destructive-tinted `role="alert"` banner for a failed data load. */
export function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
            {message}
        </p>
    )
}
