'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { customerHasInvoices } from '@/app/lib/data';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a customer name'
    }),
    email: z.string({
        invalid_type_error: 'Please enter a customer email'
    }),
    imageUrl: z.string(),
})

export type CustomerState = {
    errors?: {
        id?: string[];
        name?: string[];
        email?: string[];
    }
    message?: string | null;
}

export type AddCustomerState = {
    errors?: {
        name?: string[];
        email?: string[];
    }
    message?: string | null;
}


// ADD CUSTOMER

const AddCustomer = CustomerFormSchema.omit({ id: true, imageUrl: true })

export async function addCustomer(prevState: CustomerState, formData: FormData) {
    
    const validatedFields = AddCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email')
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to Add Customer',
        }
    }
    
    const { name, email } = validatedFields.data;
    
    try {
        await sql`
            INSERT INTO customers (name, email, image_url)
            VALUES (${name}, ${email}, ${""})
        `
    } catch (error) {
        console.log(error);
        return { message: 'Database Error: Failed to Add Customer' }
    }
    
    revalidatePath('/dashboard/customers')
    redirect('/dashboard/customers')
}

// UPDATE CUSTOMER

const UpdateCustomer = CustomerFormSchema.omit({ imageUrl: true })

export async function updateCustomer(customerId: string, prevState: CustomerState, formData: FormData) {
    
    const validatedFields = UpdateCustomer.safeParse({
        id: customerId,
        name: formData.get('name'),
        email: formData.get('email')
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields: Failed to Update Customer'
        }
    }
    
    const { id, name, email } = validatedFields.data;
    
    try {
        await sql`
            UPDATE customers
            SET name = ${name}, email = ${email}
            WHERE id = ${id}
        `
    } catch (err) {
        console.error('Database Error: ', err);
        return { message: 'Missing Fields: Failed to Update Customer' };
    }
    
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

// DELETE CUSTOMER

export type DeleteCustomerState = {
    message: string | null;
}

export async function deleteCustomer(id: string, _prev: DeleteCustomerState): Promise<DeleteCustomerState> {
    const numInvoices = await customerHasInvoices(id);
    if (numInvoices > 0) {
        return {message: "Cannot delete: customer has invoices associated with their account."};
    }
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath("/dashboard/customers");
    return {message: null};
}