"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ExternalLink, Pencil, Trash2, Users } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import DeletedJobDialog from "@/app/components/DeletedJobDialog"
import type { JobListing } from "@/lib/jobs"

/** Edit / applicant / delete controls shown in the job detail header. */
export function JobActions({ job }: { job: JobListing }) {
    const router = useRouter()

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Link
                href={`/dashboard/recruiter/jobs/${job._id}/edit`}
                className={buttonVariants({ variant: "outline" })}
            >
                <Pencil aria-hidden />
                Edit Job
            </Link>

            <Link
                href={`/dashboard/recruiter/jobs/${job._id}/applications`}
                className={buttonVariants()}
            >
                <Users aria-hidden />
                View Applicants
            </Link>

            <Link
                href={`/browse-jobs/${job._id}`}
                className={buttonVariants({ variant: "outline" })}
            >
                <ExternalLink aria-hidden />
                View Public Listing
            </Link>

            <DeletedJobDialog
                job={job}
                onDeleted={() => router.push("/dashboard/recruiter/jobs")}
                trigger={
                    <Button variant="destructive">
                        <Trash2 aria-hidden />
                        Delete Job
                    </Button>
                }
            />
        </div>
    )
}
