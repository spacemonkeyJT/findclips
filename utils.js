// @ts-check

export const clientID = 'gccrk5tmgyuq326eyvye4zqbf6rt5s';

export const root = /** @type {HTMLInputElement} */ (document.getElementById('root'));

/**
 * Makes a call to the Twitch API.
 * @param {string} url The url to call
 * @param {string} token The API token
 * @returns The parsed JSON response.
 */
export async function apiCall(url, token) {
  // TODO Set the Twitch API prefix in here
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientID
    }
  });
  return await res.json();
}
