import { getStoredObject } from "./utils.js";

export function renderUserSelect() {
  console.log('showUserSelect');

  const recentUsers = getStoredObject('recent_users') ?? [];

  const recentUsersLinks = recentUsers.map(user => `<div class="user">
    <a class="link" href="#${user.login}">
      <img class="userlogo" src="${user.profile_image_url}" />
      <div class="username">${user.display_name}</div>
    </a>
  </div>`).join('\n');

  // Show the user selection panel
  root.innerHTML = `
    <div class="user-select">
      <div class="title">Find clips for:</div>
      <input
        class="userbox"
        type="text"
        placeholder="Enter streamer name" />
      <div class="title">Recent:</div>
      <div class="recent-users">
        ${recentUsers.length > 0 ? recentUsersLinks :
          '<div class="no-recents">No recent users found</div>'}
      </div>
    </div>`;

  const userbox = /** @type {HTMLInputElement} */(document.getElementsByClassName('userbox')[0]);

  userbox.onkeyup = function(e) {
    if (e.code === 'Enter') {
      window.location.hash = userbox.value;
    }
  }
}
