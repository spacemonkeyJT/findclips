// @ts-check

import { apiCall, getSiteUrl, getStoredObject, root, setStoredObject } from "./utils.js";

/** @type {number | undefined} */
let delayTimer;

/** @type {Clip[]} */
let clips = [];

/**
 * @typedef {{
 *   id: string;
 *   login: string;
 *   display_name: string;
 *   broadcaster_type: string;
 *   description: string;
 *   profile_image_url: string;
 *   offline_image_url: string;
 * }} User
 */

/**
 * @typedef {{
 *   id: string,
 *   url: string,
 *   embed_url: string,
 *   broadcaster_id: string,
 *   broadcaster_name: string,
 *   creator_id: string,
 *   creator_name: string,
 *   video_id: string,
 *   game_id: string,
 *   language: string,
 *   title: string,
 *   view_count: number,
 *   created_at: string,
 *   thumbnail_url: string,
 *   duration: number,
 *   vod_offset: any
 * }} Clip
 */

/**
 * Search the available clips based on the search criteria.
 */
function searchClips() {
  const searchBox = /** @type {HTMLInputElement | undefined} */ (document.getElementsByClassName('searchbox')[0]);
  if (searchBox) {
    const searchText = searchBox.value;
    const clipsPanel = document.getElementsByClassName('clipspanel')[0];
    if (clipsPanel) {
      if (searchText) {
        console.log(`searchClips: ${searchText}`);
        /** @type {Clip[]} */
        const filteredClips = [];
        if (searchText) {
          for (const clip of clips) {
            if (clip.title.toLowerCase().indexOf(searchText) !== -1) {
              filteredClips.push(clip);
            }
          }
        }

        clipsPanel.innerHTML = filteredClips.map(clip => `
          <div class="clip">
            <a target="_blank" rel="noreferrer" href="${clip.url}" class="thumbnail">
              <img src="${clip.thumbnail_url}" alt="thumbnail" />
            </a>
            <div class="title">${clip.title}</div>
            <div class="creator">Clipped by ${clip.creator_name}</div>
          </div>`).join('\n');
      } else {
        clipsPanel.innerHTML = '';
      }
    }
  }
}

/**
 * Gets the current clips cached in local storage for the specified streamer.
 * @param {string} username
 */
function loadClipsFromCache(username) {
  clips = getStoredObject(`clips_${username}`) ?? [];
  console.log(`Loaded ${clips.length} clips from cache`);
}

/**
 * Caches the clip data in local storage.
 * @param {string} username The streamer username.
 */
function updateCache(username) {
  console.log(`Updating cache with ${clips.length} clips`);
  setStoredObject(`clips_${username}`, clips);
}

/**
 * Loads clips from the Twitch API.
 * @param {User} user The user to load clips for.
 * @param {string} token The API token.
 */
async function loadClipsFromAPI(user, token) {
  console.log('loadClipsFromAPI');

  const baseUrl = `https://api.twitch.tv/helix/clips?broadcaster_id=${user.id}&first=100`;
  let url = baseUrl;

  /** @type {string | undefined} */
  let cursor;

  /** @type {Clip[]} */
  const newClips = [];

  // Load all the clips for the user
  while (true) {
    const result = await apiCall(url, token);
    newClips.push(...result.data);
    cursor = result.pagination.cursor;
    if (!cursor) {
      break;
    }
    url = `${baseUrl}&after=${cursor}`;
  }

  clips = newClips;
  updateCache(user.login);
  showSearchBox();
}

function showSearchBox() {
  const loading = /** @type {HTMLDivElement | undefined} */ (document.getElementsByClassName('loading')[0]);
  if (loading) {
    loading.style.display = 'none';
    const searchBox = /** @type {HTMLInputElement | undefined} */ (document.getElementsByClassName('searchbox')[0]);
    if (searchBox) {
      searchBox.style.display = 'block';
    }
  }
}

/**
 * Adds a user to the recent user list
 * @param {User} user The user to add
 */
function addRecentUser(user) {
  /** @type {User[]} */
  let users = getStoredObject('recent_users') ?? [];
  users = users.filter(r => r.id !== user.id);
  users.push(user);
  setStoredObject('recent_users', users);
}

/**
 * Render the clips page.
 * @param {string} username The streamer username.
 * @param {string} token The API token.
 */
export async function renderUserClips(username, token) {
  console.log('showUserClips');

  document.title = `${username} - Find Twitch Clips`;

  // Load the selected user info
  const { data } = await apiCall(`https://api.twitch.tv/helix/users?login=${username}`, token);

  /** @type {User} */
  const user = data[0];

  addRecentUser(user);

  if (!user) {
    root.innerHTML = `
      <div class="error">No such user: ${username}</div>
      <a class="backbutton" href="${getSiteUrl()}">
        <img src="images/back.png" />
      </a>`;
    return;
  }

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
      <a class="backbutton" href="${getSiteUrl()}">
        <img src="images/back.png" />
      </a>
      <div class="clipspanel"></div>
    </div>`;

  const searchBox = /** @type {HTMLInputElement | undefined} */ (document.getElementsByClassName('searchbox')[0]);
  if (searchBox) {
    searchBox.onkeyup = function(e) {
      if (delayTimer) {
        clearTimeout(delayTimer);
      }
      delayTimer = setTimeout(searchClips, 1000);
    }
  }

  loadClipsFromCache(username);

  if (clips.length > 0) {
    showSearchBox();
  }

  await loadClipsFromAPI(user, token);
  showSearchBox();
  searchClips();
}
