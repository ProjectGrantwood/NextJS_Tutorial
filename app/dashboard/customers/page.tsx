import CustomersTable from '@/app/ui/customers/table';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/invoices/pagination';
import { Suspense } from 'react';
import { fetchCustomersPages } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchCustomersPages(query);
    return (
        <div className="w-full">
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-xl`}>
                Customers
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search customers..." />
            </div>
            <Suspense key={query + currentPage} fallback={<div>My Fallback</div>}>
                <CustomersTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}