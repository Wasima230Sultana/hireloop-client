import type { ReactNode } from "react"

import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { DashboardPageHeader } from "@/app/dashboard/_components/page-header"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { getApplicationsByJob } from "@/lib/api/applications"
import { getJobById } from "@/lib/api/jobs"
import {
    categoryLabel,
    formatCompensation,
    formatDeadline,
    mapApiJob,
} from "@/lib/jobs"
import { CategoryIcon, CategoryLabel } from "../_components/job-category"
import { ApplicantCount, LocationLine } from "../_components/job-meta"
import { JobActions } from "./_components/job-actions"

type JobDetailsPageProps = {
    params: Promise<{ id: string }>
}

/** Splits a textarea-style block into bullet items. */
function Bullets({ text }: { text: string }) {
    const items = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)

    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground">Not specified.</p>
    }

    return (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    )
}

/** One label/value pair in the overview grid. */
function Detail({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm">{children}</dd>
        </div>
    )
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
    const { id } = await params

    const [apiJob, apiApplicants] = await Promise.all([
        getJobById(id),
        getApplicationsByJob(id),
    ])
    const job = apiJob ? mapApiJob(apiJob) : null

    if (!job) notFound()

    const applicantCount = apiApplicants.length
    const postedOn = job.createdAt
        ? new Date(job.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
          })
        : null

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
            <DashboardPageHeader
                crumbs={[
                    { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
                    { label: job.title },
                ]}
                title={job.title}
                description={`${job.companyName} · ${categoryLabel(job.category)}`}
                action={<JobActions job={job} />}
            />

            {/* Overview */}
            <section className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <CategoryIcon category={job.category} />
                        <div>
                            <p className="font-medium">{job.companyName}</p>
                            <CategoryLabel category={job.category} />
                        </div>
                    </div>
                    <StatusBadge
                        status={job.status}
                        active={job.status === "Active"}
                    />
                </div>

                <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail label="Job Type">
                        <Badge variant="secondary">{job.jobType}</Badge>
                    </Detail>

                    <Detail label="Location">
                        <LocationLine job={job} />
                    </Detail>

                    <Detail label="Compensation">
                        <span className="font-medium tabular-nums">
                            {formatCompensation(job)}
                        </span>
                    </Detail>

                    <Detail label="Application Deadline">
                        <span className="font-medium">
                            {formatDeadline(job.deadline)}
                        </span>
                    </Detail>

                    <Detail label="Applicants">
                        <ApplicantCount count={applicantCount} />
                    </Detail>

                    <Detail label="Posted">
                        {postedOn ?? "New posting"}
                    </Detail>
                </dl>
            </section>

            {/* Responsibilities & requirements */}
            <section className="rounded-xl border border-border bg-card p-5">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <h2 className="flex items-center gap-2 text-sm font-semibold">
                            <span
                                className="size-2 rounded-full bg-primary"
                                aria-hidden
                            />
                            Key Responsibilities
                        </h2>
                        <Bullets text={job.responsibilities} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <h2 className="flex items-center gap-2 text-sm font-semibold">
                            <span
                                className="size-2 rounded-full bg-primary"
                                aria-hidden
                            />
                            Qualifications & Requirements
                        </h2>
                        <Bullets text={job.requirements} />
                    </div>
                </div>
            </section>
        </div>
    )
}
