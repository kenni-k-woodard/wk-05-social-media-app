// imports
import {
    getUser,
    getProfile,
    decrementStars,
    getProfileById,
    incrementStars,
} from '../fetch-utils.js';

// get DOM elements
const imgEl = document.querySelector('#avatar-img');
const usernameHeaderEl = document.querySelector('.username-header');
const profileDetailEl = document.querySelector('.profile-detail');

const params = new URLSearchParams(location.search);
const id = params.get('id');
// events

// display functions
window.addEventListener('load', async () => {
    // error handling
    // no id found? redirect back to main page
    // don't run the rest of the code in function
    if (!id) {
        location.assign('/');
        return;
    }
    fetchAndDisplayProfile();
});

// get profile
async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';

    const profile = await getProfileById(id);
    console.log('profile', profile);
    imgEl.src = profile.avatar_url;

    usernameHeaderEl.textContent = profile.username;
    profileDetailEl.textContent = profile.bio;

    const profileStars = renderStars(profile);

    profileDetailEl.append(profileStars);
}

// render stars
function renderStars({ stars, username, id }) {
    const p = document.createElement('p');
    const downButton = document.createElement('button');
    const upButton = document.createElement('button');

    const profileStars = document.createElement('div');

    profileStars.classList.add('profile-stars');
    profileStars.append(p, upButton, downButton);

    downButton.textContent = 'downvote user ⬇️';
    upButton.textContent = 'upvote user ⬆️';
    p.classList.add('profile-name');

    p.textContent = `${username} has ${stars} ⭐`;

    // add click event listener to each button
    downButton.addEventListener('click', async () => {
        await decrementStars(id);
        await fetchAndDisplayProfile();
    });

    upButton.addEventListener('click', async () => {
        await incrementStars(id);
        await fetchAndDisplayProfile();
    });

    return profileStars;
}
