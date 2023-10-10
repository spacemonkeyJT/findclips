import React, { useEffect, useState } from 'react';
import { ClipsPage } from './ClipsPage';
import { loginUrl } from './twitch';

function getUsername() {
  const { hash } = window.location;
  if (hash && !hash.startsWith('#access_token')) {
    return hash.substring(1);
  }
  return undefined;
}

function App() {
  const [token, setToken] = useState<string>(window.localStorage.getItem('token') ?? '');

  useEffect(() => {
    const match = /access_token=([^&]+)/.exec(window.location.hash);
    if (match) {
      window.location.hash = '';
      window.localStorage.setItem('token', match[1]);
      setToken(match[1]);
    }
  }, []);

  const username = getUsername();

  return (
    <div>
      {token && username && <ClipsPage username={username} token={token} />}
      {!token && <a className="login-button" href={loginUrl}>
        <svg className="twitch-icon" focusable="false" viewBox="0 0 24 24">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4 6.214L7.333 3H20v9l-6 5.786h-2.667L8 21v-3.214H4V6.214zm14.667 5.143V4.286H8v9.643h3v2.25l2.333-2.25H16l2.667-2.572z"></path><path d="M16.667 6.698h-1.334v4.033h1.334V6.698zM13 6.698h-1.333v4.033H13V6.698z" />
        </svg>
        <span className="label">Login with Twitch</span>
      </a>}
      {token && !username && <span>No user</span>}
    </div>
  );
}

export default App;
