export const clientID = 'gccrk5tmgyuq326eyvye4zqbf6rt5s';
export const loginUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${window.location.origin}&scope=`;

export interface User {
  id: string;
  login: string;
  display_name: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
}

export interface Clip {
  id: string,
  url: string,
  embed_url: string,
  broadcaster_id: string,
  broadcaster_name: string,
  creator_id: string,
  creator_name: string,
  video_id: string,
  game_id: string,
  language: string,
  title: string,
  view_count: number,
  created_at: string,
  thumbnail_url: string,
  duration: number,
  vod_offset: any
}

async function apiCall(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientID
    }
  });
  return await res.json();
}

export async function getUser(username: string, token: string): Promise<User> {
  const { data } = await apiCall(`https://api.twitch.tv/helix/users?login=${username}`, token);
  return data[0];
}

export async function getAllClips(broadcasterID: string, token: string) {
  const baseUrl = `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterID}&first=100`;
  let url = baseUrl;
  const clips: Clip[] = [];
  let cursor: string | undefined;

  while (true) {
    const result = await apiCall(url, token);
    clips.push(...result.data);
    cursor = result.pagination.cursor;
    if (!cursor) {
      break;
    }
    url = `${baseUrl}&after=${cursor}`;
  }

  return clips;
}
