'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { customerHasInvoices } from '@/app/lib/data';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

const CreateInvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, {message: 'Please enter an amount greater than 0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

export type InvoiceState = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

// CREATE INVOICE

const CreateInvoice = CreateInvoiceFormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: InvoiceState, formData: FormData) {
    
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to Create Invoice',
        }
    }
    
    const { customerId, amount, status } = validatedFields.data;
    
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    
    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        console.log(error);
        return { message: 'Database Error: Failed to Create Invoice' };
    }
        
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
    
}

// UPDATE INVOICE

const UpdateInvoice = CreateInvoiceFormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: InvoiceState, formData: FormData) {
    
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to Update Invoice',
        };
    }
        
    const { customerId, amount, status } = validatedFields.data;
    
    const amountInCents = amount * 100;
        
    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount= ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.log(error);
        return { message: 'Missing Fields: Failed to Update Invoice'}
    }
        
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
    
}

// DELETE INVOICE

export async function deleteInvoice(id: string) {

    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');

}

// ADD NEW CUSTOMER

const AddCustomerFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a customer name'
    }),
    email: z.string({
        invalid_type_error: 'Please enter a customer email'
    }),
    imageUrl: z.string(),
})

const AddCustomer = AddCustomerFormSchema.omit({ id: true, imageUrl: true})

export type CustomerState = {
    message?: string | null;
}

// UPDATE CUSTOMER

export async function updateCustomer(id: string) {
    return;
}
// DELETE CUSTOMER

export async function deleteCustomer(id: string) {
    
    // don't delete the customer if there are any invoices associated with their account
    const numInvoices = await customerHasInvoices(id);
    
    if (numInvoices === 0) {
        await sql`DELETE FROM customers WHERE id= ${id}`;
        revalidatePath('/dashboard/customers');
    }
    
}

export async function addCustomer(prevState: CustomerState, formData: FormData) {
    
    const validatedFields = AddCustomer.safeParse({
        name: formData.get('customerName'),
        email: formData.get('customerEmail')
    });
    
    if (!validatedFields.success) {
        return {
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
        return { message: 'Database Error: Failed to Add Customer'}
    }
    
    revalidatePath('/dashboard/customers')
    redirect('/dashboard/customers')
}

// AUTHENTICATION

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}