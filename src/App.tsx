import React, { useEffect, useState } from 'react';
import { Clips } from './Clips';
import { loginUrl } from './twitch';

function App() {
  const [token, setToken] = useState<string>(window.localStorage.getItem('token') ?? '');

  const username = window.location.pathname.substring(1);

  useEffect(() => {
    const match = /access_token=([^&]+)/.exec(window.location.hash);
    if (match) {
      window.location.hash = '';
      window.localStorage.setItem('token', match[1]);
      setToken(match[1]);
    }
  }, []);

  return (
    <div>
      {token && username && <Clips username={username} token={token} />}
      {!token && <a href={loginUrl}>Login</a>}
      {token && !username && <span>No user</span>}
    </div>
  );
}

export default App;
