const SUPABASE_URL = 'https://redfcyboqrqwpbcseyiu.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZGZjeWJvcXJxd3BiY3NleWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxMDgwNjAsImV4cCI6MTk4MzY4NDA2MH0.OoXlk2kwsTh4QiT7WNyjocL1GPxxVvERWoKwz167v0o';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */
