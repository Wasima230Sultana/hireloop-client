'use client'
import { Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import type { JobListing } from '@/lib/jobs';
import { useState } from 'react';
import { toast } from '@/components/ui/toast';
import { deleteJob } from '@/lib/actions/jobs';

type DeletedJobDialogProps = {
    job: JobListing
    /** Called after the job has been removed so the list can drop the row. */
    onDeleted?: (jobId: string) => void
    /** Element that opens the dialog; defaults to an icon-only delete button. */
    trigger?: ReactElement
}

const DeletedJobDialog = ({ job, onDeleted, trigger }: DeletedJobDialogProps) => {
    const [open, setOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (deleting) return
        setDeleting(true)
        try {
            await deleteJob(job._id)
            setOpen(false)
            toast.add({
                title: "Job deleted",
                description: "The job has been permanently deleted.",
            })
            onDeleted?.(job._id)
        } catch (error) {
            toast.add({
                type: "error",
                title: "Could not delete job",
                description:
                    error instanceof Error ? error.message : "Something went wrong.",
            })
        } finally {
            setDeleting(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
            <AlertDialogTrigger
                render={
                    trigger ?? (
                        <Button
                            variant="destructive"
                            size="icon-sm"
                            aria-label={`Delete ${job.title}`}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 aria-hidden />
                        </Button>
                    )
                }
            />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        job post from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeletedJobDialog;
