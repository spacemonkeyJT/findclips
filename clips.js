// @ts-check

import { apiCall, root } from "./utils.js";

/** @type {number | undefined} */
let delayTimer;

function searchClips(searchText, clips) {
  console.log(`searchClips: ${searchText}`);
  const filteredClips = [];
  if (searchText) {
    for (const clip of clips) {
      if (clip.title.toLowerCase().indexOf(searchText) !== -1) {
        filteredClips.push(clip);
      }
    }
  }
  const clipsPanel = document.getElementsByClassName('clipspanel')[0];
  if (clipsPanel) {
    clipsPanel.innerHTML = filteredClips.map(clip => `
      <div class="clip">
        <a target="_blank" rel="noreferrer" href="${clip.url}" class="thumbnail">
          <img src="${clip.thumbnail_url}" alt="thumbnail" />
        </a>
        <div class="title">${clip.title}</div>
        <div class="creator">Clipped by ${clip.creator_name}</div>
      </div>`).join('\n');
  }
}

export async function showUserClips(username, token) {
  console.log('showUserClips');

  // Load the selected user info
  const { data } = await apiCall(`https://api.twitch.tv/helix/users?login=${username}`, token);

  const user = data[0];

  root.innerHTML = `
    <div class="clips">
      <div class="navbar">
        <a target="_blank" rel="noreferrer" href="https://twitch.tv/${user.login}">
          <img class="userlogo" src="${user.profile_image_url}" alt="${user.display_name}" />
        </a>
        <span class="userdesc">Finding clips for <b>${user.display_name}</b></span>
        <div class="loading">Loading...</div>
        <input class="searchbox" type="text" placeholder="Enter search term" style="display: none" />
      </div>
      <div class="clipspanel"></div>
    </div>`;

  const baseUrl = `https://api.twitch.tv/helix/clips?broadcaster_id=${user.id}&first=100`;
  let url = baseUrl;
  const clips = [];
  let cursor;

  // Load all the clips for the user
  while (true) {
    const result = await apiCall(url, token);
    clips.push(...result.data);
    cursor = result.pagination.cursor;
    if (!cursor) {
      break;
    }
    url = `${baseUrl}&after=${cursor}`;
  }

  // Show the search box now the clips are loaded
  const loading = /** @type {HTMLDivElement | undefined} */ (document.getElementsByClassName('loading')[0]);
  if (loading) {
    loading.style.display = 'none';
    const searchBox = /** @type {HTMLInputElement | undefined} */ (document.getElementsByClassName('searchbox')[0]);
    if (searchBox) {
      searchBox.style.display = 'block';
      searchBox.onkeyup = function(e) {
        if (delayTimer) {
          clearTimeout(delayTimer);
        }
        delayTimer = setTimeout(() => searchClips(searchBox.value, clips), 1000);
      }
    }
  }
}
