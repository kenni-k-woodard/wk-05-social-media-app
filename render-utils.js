export function renderProfile(profileObject) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const a = document.createElement('a');

    div.classList.add('profile-list-item');
    img.classList.add('avatar');
    a.classList.add('profile-link');

    img.src = profileObject.avatar_url;
    img.alt = 'avatar';
    p.textContent = `⭐️${profileObject.stars}`;
    a.textContent = `${profileObject.username}`;
    a.href = `../profile/?id=${profileObject.id}`;

    div.append(img, a, p);
    return div;
}
