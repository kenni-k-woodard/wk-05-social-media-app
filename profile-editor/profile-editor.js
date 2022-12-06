// import
import { getUser, upsertProfile } from '../fetch-utils.js';

// get DOM elements

// state
const user = getUser();

// events
const profileForm = document.querySelector('#profile-form');

// event listener for submit button
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(profileForm);
    const profile = {
        username: formData.get('username'),
        bio: formData.get('bio'),
        user_id: user.id,
    };

    await upsertProfile(profile);
});
