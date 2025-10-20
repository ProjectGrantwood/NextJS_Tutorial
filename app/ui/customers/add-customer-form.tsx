'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { addCustomer, State } from '@/app/lib/actions';

import { useActionState } from 'react';

export default function Form() {
  
  const initialState: State = {message: null, errors: {}};
  const [state, formAction] = useActionState(addCustomer, initialState);
  
  return (
    <form action={formAction}>
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
        
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customerName" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="customerName"
                name="customerName"
                type="string"
                placeholder="Enter Customer Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="customerName-error"
              />
            </div>
            <div id="customerName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.amount &&
                state.errors.amount.map((error: string) => (
                  <p className = "mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="customerEmail" className="mb-2 block text-sm font-medium">
            Customer Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="customerEmail"
                name="customerEmail"
                type="string"
                placeholder="Enter Customer Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="customerEmail-error"
              />
            </div>
            <div id="customerEmail-error" aria-live="polite" aria-atomic="true">
              {state.errors?.amount &&
                state.errors.amount.map((error: string) => (
                  <p className = "mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
              {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className = "mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
          </div>
          
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add New Customer</Button>
      </div>
    </form>
  );
}
