import React, { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState<string>(window.localStorage.getItem('token') ?? '');

  const clientID = 'gccrk5tmgyuq326eyvye4zqbf6rt5s';
  const loginUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${window.location.origin}&scope=`;

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
      {token && <span>Logged in</span>}
      {!token && <a href={loginUrl}>Login</a>}
    </div>
  );
}

export default App;
