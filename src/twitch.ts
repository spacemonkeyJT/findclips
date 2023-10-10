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

export async function getUser(username: string, token: string) {
  const url = `https://api.twitch.tv/helix/users?login=${username}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientID
    }
  });
  const json = await res.json();
  return json.data[0];
}
