"use client";

import { useActionState } from "react";
import { deleteCustomer, type DeleteCustomerState } from "@/app/lib/customer-actions";
import { UpdateCustomer, DeleteCustomer } from "@/app/ui/customers/buttons";
import Image from "next/image";
import CustomerImagePlaceholder from "@/app/ui/dashboard/customer-image-placeholder";

export function CustomerRow({ customer }: { customer: any }) {
  const initial: DeleteCustomerState = { message: null };
  const action = deleteCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(action, initial);
  const errId = `delete-error-${customer.id}`;

  return (
    <>
      <tr className="group">
        <td className="whitespace-nowrap bg-white py-3 pl-4 pr-3 text-sm text-black sm:pl-6">
          <div className="flex items-center gap-3">
            {customer.image_url !== "" && customer.image_url !== null ? (
              <Image
                src={customer.image_url}
                className="rounded-full"
                alt={`${customer.name}'s profile picture`}
                width={28}
                height={28}
              />
            ) : (
              <CustomerImagePlaceholder name={customer.name} />
            )}
            <p>{customer.name}</p>
          </div>
        </td>
        <td className="whitespace-nowrap bg-white px-4 py-3 text-sm">{customer.email}</td>
        <td className="whitespace-nowrap bg-white px-4 py-3 text-sm">{customer.total_invoices}</td>
        <td className="whitespace-nowrap bg-white px-4 py-3 text-sm">{customer.total_pending}</td>
        <td className="whitespace-nowrap bg-white px-4 py-3 text-sm">{customer.total_paid}</td>
        <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
          <div className="flex justify-end gap-3">
            <UpdateCustomer id={customer.id} />
            <DeleteCustomer formAction={formAction} describedBy={errId} />
          </div>
        </td>
      </tr>

      {state.message && (
        <tr>
          <td colSpan={6}>
            <div
              id={errId}
              aria-live="polite"
              aria-atomic="true"
              className="bg-red-50 px-4 py-2 text-sm text-red-600 rounded-b-md"
            >
              {state.message}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function MobileCustomerRow({ customer }: { customer: any }) {
  const initial: DeleteCustomerState = { message: null };
  const action = deleteCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(action, initial);
  const errId = `delete-error-${customer.id}`;

  return (
    <>
    <div className="mb-2 w-full rounded-md bg-white p-4">
        <div className="flex items-center justify-between border-b pb-4">
            <div>
            <div className="mb-2 flex items-center">
                <div className="flex items-center gap-3">
                {
                customer.image_url.length > 0 ? 
                    <Image
                        src={customer.image_url}
                        className="rounded-full"
                        alt={`${customer.name}'s profile picture`}
                        width={28}
                        height={28}
                    />
                    :
                    <CustomerImagePlaceholder name={customer.name} />
                }
                <p>{customer.name}</p>
                </div>
            </div>
            <p className="text-sm text-gray-500">
                {customer.email}
            </p>
            </div>
        </div>
        <div className="flex w-full items-center justify-between border-b py-5">
            <div className="flex w-1/2 flex-col">
            <p className="text-xs">Pending</p>
            <p className="font-medium">{customer.total_pending}</p>
            </div>
            <div className="flex w-1/2 flex-col">
            <p className="text-xs">Paid</p>
            <p className="font-medium">{customer.total_paid}</p>
            </div>
        </div>
        <div className="pt-4 text-sm">
            <p>{customer.total_invoices} invoices</p>
        </div>
        <div className="flex justify-end gap-2">
          <UpdateCustomer id={customer.id} />
          <DeleteCustomer formAction={formAction} describedBy={errId} />
        </div>
      </div>
      {state.message && (
        <div
          id={errId}
          aria-live="polite"
          aria-atomic="true"
          className="bg-red-50 px-4 py-2 text-sm text-red-600 rounded-b-md"
        >
          {state.message}
        </div>
      )}
    </>
  );
}