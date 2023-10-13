const clientID = 'gccrk5tmgyuq326eyvye4zqbf6rt5s';
const root = document.getElementById('root');
let token = window.localStorage.getItem('token');
let username;
let delayTimer;

async function apiCall(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientID
    }
  });
  return await res.json();
}

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

  const userbox = document.getElementsByClassName('userbox')[0];

  userbox.onkeyup = function(e) {
    if (e.code === 'Enter') {
      window.location.hash = e.target.value;
    }
  }
}

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

async function showUserClips() {
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
  const loading = document.getElementsByClassName('loading')[0];
  if (loading) {
    loading.style.display = 'none';
    const searchBox = document.getElementsByClassName('searchbox')[0];
    if (searchBox) {
      searchBox.style.display = 'block';
      searchBox.onkeyup = function(e) {
        if (delayTimer) {
          clearTimeout(delayTimer);
        }
        delayTimer = setTimeout(() => searchClips(e.target.value, clips), 1000);
      }
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
        showUserClips();
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
    window.location.hash = window.localStorage.getItem('username');
  }
}

window.onhashchange = renderPage;

renderPage();