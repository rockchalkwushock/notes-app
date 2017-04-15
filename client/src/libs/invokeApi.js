import { apiURL } from './awsVars';

export default async({ path, method = 'GET', body }, userToken) => {
  const url = `${apiURL}${path}`;
  const headers = { Authorization: userToken };
  body = (body) ? JSON.stringify(body) : body; // eslint-disable-line
  const results = await fetch(url, { method, body, headers });
  return results.json();
};
