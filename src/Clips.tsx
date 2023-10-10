import React, { useEffect, useState } from 'react';
import { User, getUser } from './twitch';

interface Props {
  username: string;
  token: string;
}

export const Clips = ({ username, token }: Props) => {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    if (token && username) {
      getUser(username, token).then(setUser);
    }
  }, [username, token]);

  if (user) {
    return <div>Clips for {user.display_name}</div>
  } else {
    return null;
  }
}
