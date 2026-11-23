"use client"

import { useState } from "react"
import { LoaderCircle } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { updateApplicationStatus } from "@/lib/actions/applications"
import {
    applicationStatuses,
    type ApplicationStatus,
} from "@/lib/applications"

type StatusSelectProps = {
    applicationId: string
    status: ApplicationStatus
    /** Lets the parent list reflect the new stage immediately. */
    onStatusChange: (status: ApplicationStatus) => void
}

/** Dropdown that moves one applicant to a new hiring-pipeline stage. */
export function StatusSelect({
    applicationId,
    status,
    onStatusChange,
}: StatusSelectProps) {
    const [value, setValue] = useState<ApplicationStatus>(status)
    const [saving, setSaving] = useState(false)

    async function handleChange(next: string | null) {
        if (!next || next === value || saving) return

        const previous = value
        const selected = next as ApplicationStatus
        setValue(selected)
        setSaving(true)

        try {
            await updateApplicationStatus(applicationId, selected)
            onStatusChange(selected)
            toast.add({
                title: "Status updated",
                description: `Applicant moved to ${selected}.`,
            })
        } catch {
            setValue(previous)
            toast.add({
                type: "error",
                title: "Could not update status",
                description: "Please try again.",
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {saving && (
                <LoaderCircle
                    className="size-3.5 animate-spin text-muted-foreground"
                    aria-hidden
                />
            )}
            <Select value={value} onValueChange={handleChange} disabled={saving}>
                <SelectTrigger
                    aria-label="Application status"
                    className="w-36"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {applicationStatuses.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
