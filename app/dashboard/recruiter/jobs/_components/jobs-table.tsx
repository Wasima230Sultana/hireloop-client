import { Badge } from "@/components/ui/badge"
import { formatCompensation, type JobListing } from "@/lib/jobs"
import { cn } from "cn"
import DeletedJobDialog from "@/app/components/DeletedJobDialog"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { CategoryIcon, CategoryLabel } from "./job-category"
import { ApplicantCount, DeadlineBlock, LocationLine } from "./job-meta"

const tableHeaders = [
    "Job Title & Dept",
    "Company & Location",
    "Type",
    "Compensation",
    "Applicants",
    "Status",
    "Deadline",
    "Actions",
] as const

type JobsTableProps = {
    jobs: JobListing[]
    /** Called with the job id after a successful delete (no refetch). */
    onDeleted: (id: string) => void
}

/**
 * Job posts as a responsive list: a desktop table (lg+) and
 * stacked cards below that breakpoint.
 */
export function JobsTable({ jobs, onDeleted }: JobsTableProps) {
    return (
        <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl border border-border bg-card lg:block">
                <table className="w-full min-w-[1020px] border-collapse text-left text-sm">
                    <caption className="sr-only">
                        Manage job posts: listings, compensation, applicants,
                        status, and deadlines.
                    </caption>
                    <thead>
                        <tr className="border-b border-border text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                            {tableHeaders.map((header) => (
                                <th
                                    key={header}
                                    scope="col"
                                    className={cn(
                                        "px-4 py-3",
                                        header === "Actions" && "text-right"
                                    )}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr
                                key={job._id}
                                className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/40"
                            >
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center gap-3">
                                        <CategoryIcon
                                            category={job.category}
                                        />
                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {job.title}
                                            </p>
                                            <CategoryLabel
                                                category={job.category}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td className="max-w-[220px] px-4 py-3 align-middle">
                                    <p className="truncate font-medium">
                                        {job.companyName}
                                    </p>
                                    <LocationLine job={job} />
                                </td>

                                <td className="px-4 py-3 align-middle">
                                    <Badge
                                        variant="secondary"
                                        className="whitespace-nowrap"
                                    >
                                        {job.jobType}
                                    </Badge>
                                </td>

                                <td className="px-4 py-3 align-middle whitespace-nowrap tabular-nums">
                                    {formatCompensation(job)}
                                </td>

                                <td className="px-4 py-3 align-middle">
                                    <ApplicantCount count={job.applicants} />
                                </td>

                                <td className="px-4 py-3 align-middle">
                                    <StatusBadge
                                        status={job.status}
                                        active={job.status === "Active"}
                                    />
                                </td>

                                <td className="px-4 py-3 align-middle">
                                    <DeadlineBlock job={job} />
                                </td>

                                <td className="px-4 py-3 text-right align-middle">
                                    <DeletedJobDialog
                                        job={job}
                                        onDeleted={onDeleted}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="flex flex-col gap-3 lg:hidden">
                {jobs.map((job) => (
                    <article
                        key={job._id}
                        className="rounded-xl border border-border bg-card p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                                <CategoryIcon category={job.category} />
                                <div className="min-w-0">
                                    <p className="font-medium">{job.title}</p>
                                    <CategoryLabel category={job.category} />
                                </div>
                            </div>
                            <StatusBadge
                                status={job.status}
                                active={job.status === "Active"}
                            />
                        </div>

                        <dl className="mt-4 flex flex-col gap-2.5 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                    Company &amp; Location
                                </dt>
                                <dd className="min-w-0 text-right">
                                    <p className="truncate font-medium">
                                        {job.companyName}
                                    </p>
                                    <LocationLine
                                        job={job}
                                        className="justify-end"
                                    />
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                    Type
                                </dt>
                                <dd>
                                    <Badge
                                        variant="secondary"
                                        className="whitespace-nowrap"
                                    >
                                        {job.jobType}
                                    </Badge>
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                    Compensation
                                </dt>
                                <dd className="text-right font-medium tabular-nums">
                                    {formatCompensation(job)}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                    Applicants
                                </dt>
                                <dd>
                                    <ApplicantCount count={job.applicants} />
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                    Deadline
                                </dt>
                                <dd className="text-right">
                                    <DeadlineBlock job={job} />
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-4 border-t border-border pt-3">
                            <DeletedJobDialog
                                job={job}
                                onDeleted={onDeleted}
                            />
                        </div>
                    </article>
                ))}
            </div>
        </>
    )
}
