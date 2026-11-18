import React from 'react';

const BrowseJobsPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = await searchParams;
console.log('search params :' , search)
    return (
        <div>
            BrowseJobsPage
        </div>
    );
};

export default BrowseJobsPage;