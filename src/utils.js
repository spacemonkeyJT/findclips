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

export function getSiteUrl() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  } else {
    return 'https://spacemonkeyjt.github.io/findclips/';
  }
}

/**
 * Deserializes an object from JSON from the local storage.
 * @param {string} name Name of the item to get.
 */
export function getStoredObject(name) {
  const json = window.localStorage.getItem(name);
  if (json) {
    return JSON.parse(json);
  }
  return undefined;
}

/**
 * Serializes an object to JSON and writes it to local storage.
 * @param {string} name The name of the item to set.
 * @param {any} value The object to store.
 */
export function setStoredObject(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
}
