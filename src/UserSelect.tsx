import React, { useState } from 'react';

interface Props {
  token: string;
  username: string;
  onChange: (user: string) => void;
}

export const UserSelect = (props: Props) => {
  const [username, setUsername] = useState<string>(props.username);

  return <div className="user-select">
    <div className="title">Find clips for:</div>
    <input
      className="userbox"
      type="text"
      value={username}
      placeholder="Enter streamer name"
      onChange={e => setUsername(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && username) {
          props.onChange(username);
        }
      }} />
    <div className="title">Recent:</div>
  </div>
}
