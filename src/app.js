// @ts-check

import { renderUserClips } from "./clips.js";
import { renderUserSelect } from "./user_select.js";
import { clientID, getSiteUrl, root } from "./utils.js";

let token = window.localStorage.getItem('token');
let username;

function renderPage() {
  const { hash } = window.location;

  // Grab the current username from the url
  if (!hash.startsWith('#access_token')) {
    username = hash.substring(1);
    window.localStorage.setItem('username', username);
    if (token) {
      if (username) {
        renderUserClips(username, token);
      } else {
        renderUserSelect();
      }
    } else {
      // No API token, redirect to login page.
      console.log('no token, login');
      window.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${getSiteUrl()}&scope=`;
    }
  }
}

// Grab the API token from the url if we're coming back from login
const match = /access_token=([^&]+)/.exec(window.location.hash);
if (match) {
  window.location.hash = '';
  window.localStorage.setItem('token', match[1]);
  token = match[1];

  // Bring back the selected user if it was present before login
  if (!username) {
    window.location.hash = window.localStorage.getItem('username') ?? '';
  }
}

window.onhashchange = renderPage;

renderPage();
