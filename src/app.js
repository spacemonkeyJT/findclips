// @ts-check

import { showUserClips } from "./clips.js";
import { clientID, root } from "./utils.js";

let token = window.localStorage.getItem('token');
let username;

function showUserSelect() {
  console.log('showUserSelect');

  // Show the user selection panel
  root.innerHTML = `
    <div class="user-select">
      <div class="title">Find clips for:</div>
      <input
        class="userbox"
        type="text"
        placeholder="Enter streamer name" />
      <div class="title">Recent:</div>
    </div>`;

  const userbox = /** @type {HTMLInputElement} */(document.getElementsByClassName('userbox')[0]);

  userbox.onkeyup = function(e) {
    if (e.code === 'Enter') {
      window.location.hash = userbox.value;
    }
  }
}

function renderPage() {
  const { hash } = window.location;
  console.log(`renderPage: ${hash}`);

  // Grab the current username from the url
  if (!hash.startsWith('#access_token')) {
    username = hash.substring(1);
    window.localStorage.setItem('username', username);
    if (token) {
      if (username) {
        showUserClips(username, token);
      } else {
        showUserSelect();
      }
    } else {
      // No API token, redirect to login page.
      console.log('no token, login');
      let redirectURI = 'https://spacemonkeyjt.github.io/findclips/';
      if (window.location.hostname === 'localhost') {
        redirectURI = 'http://localhost:3000';
      }
      window.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${redirectURI}&scope=`;
    }
  }
}

// Grab the API token from the url if we're coming back from login
const match = /access_token=([^&]+)/.exec(window.location.hash);
if (match) {
  console.log('got access token');

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
