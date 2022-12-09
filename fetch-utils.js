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
// upsert
export async function upsertProfile(profile) {
    const response = await client
        .from('profiles')
        .upsert(profile, { onConflict: 'user_id' })
        .single();

    return checkError(response);
}

// upload image
export async function uploadImage(imagePath, imageFile) {
    const bucket = client.storage.from('avatars');

    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        upsert: true,
    });

    if (response.error) {
        return null;
    }

    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    return url;
}

export async function getProfile(user_id) {
    const response = await client.from('profiles').select('*').match({ user_id }).maybeSingle();
    return response;
}

export async function getProfileById(id) {
    const response = await client.from('profiles').select('*').match({ id }).single();
    return checkError(response);
}

export async function incrementStars(id) {
    const profile = await getProfileById(id);

    const response = await client
        .from('profiles')
        .update({ stars: profile.stars + 1 })
        .match({ id });

    console.log(response);

    return checkError(response);
}

export async function decrementStars(id) {
    const profile = await getProfileById(id);

    const response = await client
        .from('profiles')
        .update({ stars: profile.stars - 1 })
        .match({ id });

    return checkError(response);
}

export async function getProfiles() {
    const response = await client.from('profiles').select('*');
    return checkError(response);
}

// error handling
function checkError(response) {
    return response.error ? console.error(response.error) : response.data;
}
