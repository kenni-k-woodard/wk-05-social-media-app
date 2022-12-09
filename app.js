/* Imports */
import { getProfiles } from './fetch-utils.js';
import { renderProfile } from './render-utils.js';
// this will check if we have a user and set signout link if it exists
import './auth/user.js';

/* Get DOM Elements */
const listEl = document.querySelector('.profiles-container');

/* State */

/* Events */
window.addEventListener('load', async () => {
    fetchAndDisplayProfiles();
});

/* Display Functions */
async function fetchAndDisplayProfiles() {
    listEl.textContent = '';

    const profiles = await getProfiles();

    for (let profile of profiles) {
        console.log(profile);
        const profileEl = renderProfile(profile);
        listEl.append(profileEl);
    }
}
