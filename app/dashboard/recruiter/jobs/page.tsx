"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Briefcase, Plus } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { mapApiJob, type JobListing } from "@/lib/jobs"
import { getJobsByRecruiter } from "@/lib/api/jobs"
import { useSession } from "@/lib/auth-client"
import { DashboardPageHeader } from "@/app/dashboard/_components/page-header"
import { EmptyState } from "@/app/dashboard/_components/empty-state"
import { ErrorAlert } from "@/app/dashboard/_components/error-alert"
import { SyncStatus } from "@/app/dashboard/_components/sync-status"
import { JobsTable } from "./_components/jobs-table"

export default function RecruiterManageJobsPage() {
    const { data: session, isPending } = useSession()
    const user = session?.user
    // Only the signed-in recruiter's listings belong on this page.
    const recruiterId = user?.type === "recruiter" ? user.id : undefined

    const [jobs, setJobs] = useState<JobListing[]>([])
    /** Recruiter whose jobs are currently in state (null = none loaded yet). */
    const [loadedForId, setLoadedForId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const loading = isPending || Boolean(recruiterId && loadedForId !== recruiterId)

    useEffect(() => {
        if (!recruiterId) return

        let cancelled = false

        async function loadJobs() {
            try {
                const data = await getJobsByRecruiter(recruiterId!)
                if (cancelled) return

                const ownJobs = data
                    .map(mapApiJob)
                    .filter((job): job is JobListing => job !== null)

                setJobs(ownJobs)
                setError(null)
            } catch {
                if (!cancelled) {
                    setError("Could not load your job posts from the server.")
                }
            } finally {
                // Async callback, so this does not cascade a render inside the effect.
                if (!cancelled) setLoadedForId(recruiterId!)
            }
        }

        loadJobs()

        return () => {
            cancelled = true
        }
    }, [recruiterId])

    /** Ignore rows belonging to a previously signed-in account while loading. */
    const rowsReady = !recruiterId || loadedForId === recruiterId
    const visibleJobs = rowsReady ? jobs : []

    /** Drops a deleted job from the table without a refetch. */
    function handleJobDeleted(id: string) {
        setJobs((previous) => previous.filter((job) => job._id !== id))
    }

    const header = (
        <DashboardPageHeader
            crumbs={[
                { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
                { label: "Job Listings & Postings" },
            ]}
            title="Manage Job Posts"
            description="Review your own listings, monitor applicants, and update job details."
            action={
                <Link
                    href="/dashboard/recruiter/jobs/new"
                    className={buttonVariants({ size: "lg" })}
                >
                    <Plus aria-hidden />
                    New Job Post
                </Link>
            }
        />
    )

    // Signed out, or an account that cannot publish jobs: nothing of theirs to show.
    if (!isPending && !recruiterId) {
        const signedOut = !user

        return (
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
                {header}
                <EmptyState
                    icon={Briefcase}
                    title={
                        signedOut
                            ? "Sign in to see your job posts"
                            : "Recruiter access required"
                    }
                    description={
                        signedOut
                            ? "Only your own published listings are shown here."
                            : "Only recruiter accounts can publish and manage job posts."
                    }
                    action={
                        <Link
                            href={signedOut ? "/sign-in" : `/dashboard/${user.type}`}
                            className={buttonVariants()}
                        >
                            {signedOut ? "Sign in" : "Go to dashboard"}
                        </Link>
                    }
                />
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
            {header}

            <SyncStatus
                loading={loading}
                label={
                    loading
                        ? "Syncing your job posts from the server…"
                        : `${visibleJobs.length} of your job posts`
                }
            />

            {error && <ErrorAlert message={error} />}

            {visibleJobs.length === 0 ? (
                loading ? null : (
                    <EmptyState
                        icon={Briefcase}
                        title="No job posts yet"
                        description="Create your first listing to start receiving applications from candidates."
                        action={
                            <Link
                                href="/dashboard/recruiter/jobs/new"
                                className={buttonVariants()}
                            >
                                <Plus aria-hidden />
                                New Job Post
                            </Link>
                        }
                    />
                )
            ) : (
                <JobsTable jobs={visibleJobs} onDeleted={handleJobDeleted} />
            )}
        </div>
    )
}
