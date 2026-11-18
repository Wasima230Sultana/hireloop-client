import Link from "next/link"

import { JobsExplorer } from "@/components/jobs/jobs-explorer"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { getJobs } from "@/lib/api/jobs"
import { mapApiJob, type JobListing } from "@/lib/jobs"

// Listings change whenever a recruiter posts or deletes a job.
export const dynamic = "force-dynamic"

export default async function BrowseJobsPage() {
    let jobs: JobListing[] = []
    let failed = false

    try {
        const data = await getJobs()
        jobs = data
            .map(mapApiJob)
            .filter((job): job is JobListing => job !== null)
    } catch {
        failed = true
    }

    return (
        <>
            <main className="mx-auto w-full max-w-7xl px-6 py-8">
                <h1 className="sr-only">Browse Jobs</h1>

                {failed ? (
                    <div
                        role="alert"
                        className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-10 text-center"
                    >
                        <p className="text-sm text-destructive">
                            Could not load jobs from the server.
                        </p>
                        <Link
                            href="/browse-jobs"
                            className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                            Try again
                        </Link>
                    </div>
                ) : (
                    <JobsExplorer jobs={jobs} />
                )}
            </main>

            <SiteFooter />
        </>
    )
}
