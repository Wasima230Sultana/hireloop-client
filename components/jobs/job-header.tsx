'use client'

import { useSession } from "@/lib/auth-client";
import { Badge } from "../ui/badge";
import { cn } from "cn"
import { CheckIcon } from "lucide-react";
import { Button } from "@base-ui/react";
import { useRouter } from "next/navigation";
import { formatCompensation, JobListing } from "@/lib/jobs";
import { createApplication } from "@/lib/actions/applications";
import { getApplicationsByCount } from "@/lib/api/applications";
const JobHeaderPage = ({ job }: { job: JobListing }) => {
    const { data: session } = useSession()
    const user = session?.user;
    const isExpired = job.status === "Expired"
    const router = useRouter()
    const handleApply = async () => {
        if (!user) {
            router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
            return
        } else if (user.type === 'seeker') {
            const countResult = await getApplicationsByCount(`applicantId = ${user.id}`)
            if (countResult.count >= 10) {
                router.push('/payment')
                return
            } else {
                const application = {
                    jobId: job._id,
                    userId: user.id,
                    email: user.email,
                    applicantName: user.name ?? user.email ?? "Unknown applicant",
                    jobTitle: job.title,
                    companyName: job.companyName,
                    location: job.location,
                    jobType: job.jobType,
                    workMode: job.workMode,
                    category: job.category,
                    compensation: formatCompensation(job),
                    status: "Applied" as const,
                }
                try {
                    const result = await createApplication(application);
                    if (result.insertedId) {
                        console.log("Application submitted successfully");
                        router.push('/dashboard/seekers/applications')
                    }
                } catch (error) {
                    console.error("Failed to submit application", error)
                }
            }
            // Store every detail the seeker will need to recognise this application
            // later on their dashboard, without re-joining the jobs collection.


        } else {
            console.log('Not a job seeker')
        }
    }
    return (
        <div>
            {/* Header */}
            <header className="flex flex-wrap items-start gap-4 rounded-xl border border-border bg-card p-6">
                <span
                    aria-hidden
                    className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-xl font-semibold text-muted-foreground"
                >
                    {job.companyName.charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {job.title}
                    </h1>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {job.companyName}
                        </span>
                        <span aria-hidden>•</span>
                        <Badge
                            className={cn(
                                isExpired
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            )}
                        >
                            {!isExpired && <CheckIcon aria-hidden />}
                            {job.status}
                        </Badge>
                        <span aria-hidden>•</span>
                        <span className="text-xs">{job.postedLabel}</span>
                    </div>
                </div>

                <Button
                    onClick={handleApply}
                    className="inline-flex h-10 shrink-0 items-center rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                    Apply Now
                </Button>
            </header>
        </div>
    );
};

export default JobHeaderPage;
