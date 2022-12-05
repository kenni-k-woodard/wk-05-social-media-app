# Week 05, Monday Notes

## Project Planning

### Supabase Table

-   profiles
    -   id
    -   user_id (foreign key to user table)
    -   username (could use email instead)
    -   bio
    -   stars (popularity on assignment - for upvotes and downvotes)
    -   avatar_url

### Pages

-   profile list (home page)
-   profile editor/creator
-   profile detail page

### HTML

editor page

-   `form`
    -   input with label for USERNAME
    -   input with label for BIO
    -   input with label for Avatar (type="file")
    -   img (for preview of avatar)
    -   submit button
    -   p tag for error display

profiles list (home page)

-   list container that is hardcoded
    -   render list items

profile detail page

-   hardcode an img and header
-   stars detail container

### Events

editor page

-   on page load, get profile information from Supabase and display on form if it exists
-   avatar img input ("change"), display img preview
-   form submit:
    -   utilize user input and send it to Supabase
    -   upsert (insert and update) to send to Supabase (if it doesn't exist, create it. If it does exist, then edit it)
    -   error handling to display issues to user

profile page

-   up and down vote button clicks
    -   increment or decrement the stars count in Supabase
-   page load fetch

profiles list (home page)

-   page load fetch

### Functions

-   uploadImage(imagePath, imageFile)
-   upsertProfile(profile)
-   getProfile(user_id) and getProfileById(id)
-   incrementStars(id) and decrementStars(id)

### Workflow Slices

1. Create/edit simple profile (username and bio)
2. add in avatar upload to profile
3. get Profile back from Supabase (use it to fill in form)
4. error handling and button disable while uploading image to Supabase
5. Profiles list (home page)
6. Profile detail page and stars up/down votes

---

## Creating a storage bucket

Click on bucket icon (under users)

-   name
-   public
-   policies (only have to do this once):
    -   Other policies under storage.objects
        -   enable ALL for authenticated users only

--

## Table: Name - profiles

(turning off RLS for now)

-   delete created at
-   user_id (add foreign key to users_id) default value = uid()
-   stars type int8, default value=0
-   avatar_url is varchar

---

## profile-editor

-   username, add `required`
-   `textarea` for bio

---

## fetch-utils - add upsert (if it doesn't exist, create it. If it does exist, then edit it)

```
export async function upsertProfile(profile) {
    const response = await client.from('profiles').upsert(profile).single();

    return checkError(response);
}

```

---

.single() - can only be one instance

---

## profile-editor.js - user upsert function

```
// get DOM elements
const errorDisplay = document.querySelector('#error-display')
const preview = document.querySelector('#preview')
const profileForm = document.querySelector(form)
const updateButton = document.querySelector(button)
const userNameInput = document.querySelector('[name=username]')
const avatarInput = document.querySelector('[name=avatar]')


profile.Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(profileForm);
    // initial profile object
    const profile = {
        username: formData.get('username'),
        bio: forData.get('bio'),
    };

    await upsertProfile(profile)
});

```

---

Pause to check functionality of profile-editor page

---

## fetch-utils, add avatar

```
// uploadImage
export async function uploadImage(imagePath, imageFile)
    // use the storage bucket to upload image to bucket
    // then use it to get the public URL
    const bucket = client.storage.from('avatars');

    const response = await bucket.upload(imagePath, imageFile, {
        // sizing
        cacheControl: '3600',
        // replace any existing file with same name
        upsert: true,
    });

    if (response.error) {
        return null;
    }
    // construct the url to image
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`

    return url;

```

---

^ "just copy it down sort of function"

---

## profile-editor.js, get avatar file from form

```
profile.Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(profileForm);
    // initial profile object
    const profile = {
        username: formData.get('username'),
        bio: forData.get('bio'),
    };

    // UPDATE WITH NEW INFO BELOW
    // get avatar file from form
    const imageFile = formData.get('avatar')
    console.log('imageFile', imageFile);

    // do we have a file? then size will be > 0
    if (imageFile.size) {
        const imagePath = `${user.id}/${imageFile.name}`

        const url = await uploadImage(imagePath, imageFile);

        profile.avatar_rul = url;
    }
    // END OF NEW INFO

    await upsertProfile(profile)
});

```

---

^ Why are we using the template literal?

-   We want to create a unique image path.
-   Creates a folder specific to the user id, then looks at the image files name

---

## profile-editor.js, get preview showing up

Need event listener for avatar input that will show preview
This event listener just happens locally in our browser

```
// ADD BELOW profileForm.eventListener

avatarInput.addEventListener('change', () => {
    // only selects first file
    const file = avatarInput.files[0];
    // if file has been selected, we want to see the preview
    if (file) {
        // creates a string containing a URL representing the file object
        preview.src = URL.createObjectURL(file)
    } else {
        preview.src = '/assets/avatar.jpeg';
    }
});

```

---

## fetch-utils

Write a getProfile function

```
export async function getProfile(user_id) {
    const response = await client.from('profiles').select('*').match({ user_id }).maybeSingle();

    return response;
}

```

---

({ user_id }) is same as { user_id : user_id }

---

## profile-editor.js

```
// get DOM elements
const user = getUser()

// STATE
let error = null;
let profile = null'

// ADD ABOVE profile.addEventListener()
window.addEventListener('load', async () => {
    const response = await getProfile(user.id);

    // error handling
    error = response.error;
    profile = response.data;

    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        if (profile) {
            userNameInput.value = profile.username;
            if(profile.avatar_url) {
                preview.src = profile.avatar_url;
            }
        }
    }
})

```

---

## Debugging

~ 10:40
Things started not working. Duplicating and creating a new row instead of updating current id
Added RLS to attempt to fix

RLS Policies:

-   Enable insert for users based on user_id
-   Enable update for users based on user_id
-   Read access for authenticated users

It's still duplicating

Upsert might not be working, so changed to below:

## fetch-utils

```
export async function upsertProfile(profile) {
    const response = await client
    .from('profiles')
    .update(profile)
    .match({ user_id: profile.user_id })
    .single();

    return checkError(response);
}

// add in a create function to create the profile for each user

```

## profile-editor.js

profile.Form.addEventListener('submit', async (e) => {
e.preventDefault();

    const formData = new FormData(profileForm);
    // initial profile object
    const profile = {
        username: formData.get('username'),
        bio: forData.get('bio'),
        user_id: user.id,
    };

    await upsertProfile(profile)

});

---

## profile-editor.js

```
profile.Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // NEW CODE TO ADD:
    updateButton.disabled = true;
    updateButton.textContent = 'Saving...';

    ...

    // ADD AFTER if (imageFile.size)
    const response = await upsertProfile(profile);

    error = response.error;

    if (error) {
        errorDisplay.textContent = error.message;
        updateButton.disabled = false;
        updateButton.textContent = 'Update Profile';
        } else {
            location.assign('/');
        }
}
```

---

~ 11:00
CHECK OUT DEMO CODE FOR THIS CHUNK - notes not consistent below

## app.js

-   add fetchAndDisplayProfiles()

## fetch-utils

-   add getProfileById(user_id)

## profile.js

-   add fetchAndDisplayProfile()

---

## fetch-utils, increment/decrement

```
export async function incrementStars(id) {
    const profile = await getProfileById(id);

    const response = await client
    .from('profiles')
    .update({ stars: profile.stars + 1 })
    .match({ id });

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

```

---

## profile.js

-   can also render stars in render-utils; did this way to easily access downButton and upButton

```
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

    // event listeners
    // down votes
    downButton.addEventListener('click', async() => {
        await decrementStars(id);
        await fetchAndDisplayProfile();
    })

    // up votes
    upButton.addEventListener('click', async() => {
    await incrementStars(id);
    await fetchAndDisplayProfile();
    })

    return profileStars;

}

```

---

function renderStars({ stars, username, id }) {}
^ this is called destructuring, don't need to use dot notation

---

Wednesday - will build out messaging with real time

---

## Rubric

Madden will be updating rubric with more

-   Also submit screenshots of:
    -   RLS
    -   Table
    -   Bucket existing
