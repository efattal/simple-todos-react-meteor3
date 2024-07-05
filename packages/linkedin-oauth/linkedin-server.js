Linkedin = {};

// checks whether a string parses as JSON
const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
const getTokenResponse = (query) => {
  const config = ServiceConfiguration.configurations.findOne({ service: 'linkedin' });

  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }

  let responseContent;

  try {
    // Request an access token
    responseContent = HTTP.get('https://api.linkedin.com/uas/oauth2/accessToken', {
      params: {
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        code: query.code,
        redirect_uri: OAuth._redirectUri('linkedin', config)
      }
    }).content;
  } catch (err) {
    throw new Error(`Failed to complete OAuth handshake with Linkedin. ${err.message}`);
  }

  // If 'responseContent' does not parse as JSON, it is an error.
  if (!isJSON(responseContent)) {
    throw new Error(`Failed to complete OAuth handshake with Linkedin. ${responseContent}`);
  }

  // Success! Extract access token and expiration
  const parsedResponse = JSON.parse(responseContent);
  const accessToken = parsedResponse.access_token;
  const expiresIn = parsedResponse.expires_in;

  if (!accessToken) {
    throw new Error(`Failed to complete OAuth handshake with Linkedin -- can't find access token in HTTP response. ${responseContent}`);
  }

  return {
    accessToken,
    expiresIn
  };
};

// Request available fields from r_liteprofile
const getIdentity = (accessToken) => {
  try {
    const url = encodeURI(`https://api.linkedin.com/v2/userinfo?oauth2_access_token=${accessToken}`);
    return HTTP.get(url).data;
  } catch (err) {
    throw new Error(`Failed to fetch identity from Linkedin. ${err.message}`);
  }
};

OAuth.registerService('linkedin', 2, null, query => {
  const response = getTokenResponse(query);
  const { accessToken } = response;
  const identity = getIdentity(accessToken);

  const { sub, name, given_name, family_name, picture, email, email_verified } = identity;

  if (!sub) {
    throw new Error('Linkedin did not provide an id');
  }

  const serviceData = {
    id: sub,
    accessToken,
    expiresAt: +new Date() + 1000 * response.expiresIn,
  };

  const fields = {
    name,
    firstName: given_name,
    lastName: family_name,
    picture,
    email,
    verified_email: email_verified
  };


  Object.assign(serviceData, fields);

  return {
    serviceData,
    options: {
      profile: fields
    }
  }
})

Linkedin.retrieveCredential = (credentialToken, credentialSecret) => {
  OAuth.retrieveCredential(credentialToken, credentialSecret);
}