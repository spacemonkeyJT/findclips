import React, { useEffect, useState } from 'react';
import { Clip, User, getAllClips, getUser } from './twitch';

interface Props {
  username: string;
  token: string;
}

export const Clips = ({ username, token }: Props) => {
  const [user, setUser] = useState<User | undefined>();
  const [search, setSearch] = useState<string>('');
  const [allClips, setAllClips] = useState<Clip[]>([]);
  const [filteredClips, setFilteredClips] = useState<Clip[]>([]);
  const [searchCommitted, setSearchCommitted] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Get the data
  useEffect(() => {
    async function fetchData() {
      const user = await getUser(username, token);
      setUser(user);
      setAllClips(await getAllClips(user.id, token));
      setLoading(false);
    }
    if (token && username) {
      fetchData();
    }
  }, [username, token]);

  // Delay searching until the user finish entering the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchCommitted(search);
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (allClips.length > 0 && searchCommitted) {
      const clips: Clip[] = [];
      const searchExpr = new RegExp(`\\b${searchCommitted}\\b`, 'i');
      for (const clip of allClips) {
        if (searchExpr.exec(clip.title)) {
          clips.push(clip);
        }
      }
      setFilteredClips(clips);
    } else {
      setFilteredClips([]);
    }
  }, [allClips, searchCommitted]);

  if (user) {
    return <div className="clips">
      <img className="userlogo" src={user.profile_image_url} alt={user.display_name} />
      <div className="userdesc">Finding clips for <b>{user.display_name}</b></div>
      {loading && <div>Loading...</div>}
      {!loading && <>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
        <pre>{JSON.stringify(filteredClips, null, 2)}</pre>
      </>}
    </div>
  } else {
    return null;
  }
}
