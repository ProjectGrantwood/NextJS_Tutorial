'use server'

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export default async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') {
                return 'Invalid credentials';
            }
            return 'Something went wrong';
        }
        throw error;
    }
}