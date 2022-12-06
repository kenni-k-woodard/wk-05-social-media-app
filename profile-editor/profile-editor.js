// import
import { getUser, uploadImage, upsertProfile } from '../fetch-utils.js';

// get DOM elements
const profileForm = document.querySelector('#profile-form');
const errorDisplay = document.getElementById('error-display');
const updateButton = profileForm.querySelector('button');
const preview = document.getElementById('preview');
const avatarInput = profileForm.querySelector('[name=avatar]');
const bioInput = profileForm.querySelector('[name="bio"]');
const userNameInput = profileForm.querySelector('[name=username]');

// state
let error = null;
let profile = null;

const user = getUser();

// events
window.addEventListener('load', async () => {});
// event listener for submit button
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(profileForm);
    const profileObj = {
        username: formData.get('username'),
        bio: formData.get('bio'),
        user_id: user.id,
    };
    const imageFile = formData.get('avatar');
    if (imageFile.size) {
        const imagePath = `${user.id}/${imageFile.name}`;
        const url = await uploadImage(imagePath, imageFile);
        profileObj.avatar_url = url;
    }

    const response = await upsertProfile(profileObj);
    error = response.error;

    if (error) {
        errorDisplay.textContent = error.message;
        console.log(`errorDisplay`, errorDisplay);
        updateButton.disabled = false;
        updateButton.textContent = 'Update Profile';
    } else {
        location.assign('/');
    }
});

avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
    } else {
        preview.src = '/assets/avatar.png';
    }
});
