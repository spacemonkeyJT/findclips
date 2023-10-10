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
      {!token && <a href={loginUrl}>Login</a>}
      {token && !username && <span>No user</span>}
    </div>
  );
}

export default App;
