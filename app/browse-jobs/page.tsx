import { getJobs } from '@/lib/actions/jobs';
import React from 'react';

const BrowseJobsPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = await searchParams;
    const urlSearch = new URLSearchParams(search as Record<string,string>);
    const query = urlSearch.toString()
console.log('search params :' , query)
const jobs = await getJobs(query);
    return (
        <div>
            BrowseJobsPage
            {jobs.map((job, id) => (
                <li key={id}>{job.category}</li>
            ))}
        </div>
    );
};

export default BrowseJobsPage;