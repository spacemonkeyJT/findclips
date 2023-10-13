export function renderUserSelect() {
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
