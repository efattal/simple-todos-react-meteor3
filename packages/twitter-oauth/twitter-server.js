import { Base64 } from 'meteor/ostrio:base64';

Twitter = {};

// checks whether a string parses as JSON
const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
};

const nativeB64 = new Base64({ useNative: true });

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
const getTokenResponse = (query) => {
  const config = ServiceConfiguration.configurations.findOne({ service: 'twitter' });

  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }

  let responseContent;

  try {
    // Request an access token
    responseContent = HTTP.post('https://api.twitter.com/2/oauth2/token', {
      headers: {
        Authorization: `Basic ${nativeB64.encode(config.clientId+':'+config.secret)}`
      },
      params: {
        code: query.code,
        grant_type: 'authorization_code',
        client_id: config.clientId,
        redirect_uri: OAuth._redirectUri('twitter', config),
        code_verifier: 'challenge',
      }
    }).content;
  } catch (err) {
    throw new Error(`Failed to complete OAuth handshake with Twitter. ${err.message}`);
  }

  // If 'responseContent' does not parse as JSON, it is an error.
  if (!isJSON(responseContent)) {
    throw new Error(`Failed to complete OAuth handshake with Twitter. ${responseContent}`);
  }

  // Success! Extract access token and expiration
  const parsedResponse = JSON.parse(responseContent);
  const accessToken = parsedResponse.access_token;
  const expiresIn = parsedResponse.expires_in;

  if (!accessToken) {
    throw new Error(`Failed to complete OAuth handshake with Twitter -- can't find access token in HTTP response. ${responseContent}`);
  }

  return {
    accessToken,
    expiresIn
  };
};

// Request available fields from r_liteprofile
const getIdentity = (accessToken) => {
  try {
    const url = encodeURI(`https://api.twitter.com/2/users/me`);
    return HTTP.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}` 
      }
    }).data;
  } catch (err) {
    throw new Error(`Failed to fetch identity from Twitter. ${err.message}`);
  }
};

OAuth.registerService('twitter', 2, null, query => {
  const response = getTokenResponse(query);
  const { accessToken } = response;
  const identity = getIdentity(accessToken);

  const { id, name, username } = identity.data;

  if (!id) {
    throw new Error('Twitter did not provide an id');
  }

  const serviceData = {
    id,
    accessToken,
    expiresAt: +new Date() + 1000 * response.expiresIn,
  };

  const fields = {
    name,
    username
  };


  Object.assign(serviceData, fields);

  return {
    serviceData,
    options: {
      profile: fields
    }
  }
})

Twitter.retrieveCredential = (credentialToken, credentialSecret) => {
  OAuth.retrieveCredential(credentialToken, credentialSecret);
}