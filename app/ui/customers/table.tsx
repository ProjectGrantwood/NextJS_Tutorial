import { fetchFilteredCustomers } from "@/app/lib/data";
import { CustomerRow, MobileCustomerRow } from "@/app/ui/customers/customer-table-row";

export default async function CustomersTable({
  query,
  currentPage,
}: { query: string; currentPage: number }) {
  const customers = await fetchFilteredCustomers(query, currentPage);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* Mobile */}
              <div className="md:hidden">
                {customers?.map((c) => (
                  <MobileCustomerRow key={c.id} customer={c} />
                ))}
              </div>

              {/* Desktop */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
                    <th className="px-3 py-5 font-medium">Email</th>
                    <th className="px-3 py-5 font-medium">Total Invoices</th>
                    <th className="px-3 py-5 font-medium">Total Pending</th>
                    <th className="px-4 py-5 font-medium">Total Paid</th>
                    <th />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {customers.map((c) => (
                    <CustomerRow key={c.id} customer={c} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}