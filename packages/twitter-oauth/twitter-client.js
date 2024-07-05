Twitter = {};

// Request LinkedIn credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on completion. Takes one argument, credentialToken on success, or Error on error.
Twitter.requestCredential = function(options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  const config = ServiceConfiguration.configurations.findOne({ service: 'twitter' });

  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError('Service not configured')
    );
    return;
  }

  const credentialToken = Random.secret();

  let scope;
  const { requestPermissions, ...otherOptionsToPassThrough } = options;

  if (requestPermissions) {
    scope = requestPermissions.join('+');
  } else {
    // If extra permissions not passed, we need to request basic, available to all
    scope = 'users.read+tweet.read';
  }

  const loginStyle = OAuth._loginStyle('twitter', config, options);

  if (!otherOptionsToPassThrough.popupOptions) {
    // the default dimensions (https://github.com/meteor/meteor/blob/release-1.6.1/packages/oauth/oauth_browser.js#L15) don't play well with the content shown by twitter
    // so override popup dimensions to something appropriate (might have to change if LinkedIn login page changes its layout)
    otherOptionsToPassThrough.popupOptions = { width: 390, height: 628 };
  }

  const loginUrl =
    `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${config.clientId}` +
    `&redirect_uri=${OAuth._redirectUri('twitter', config)}` +
    `&state=${OAuth._stateParam(loginStyle, credentialToken)}` +
    `&scope=${scope}` +
    '&code_challenge=challenge&code_challenge_method=plain'

  OAuth.launchLogin({
    loginService: 'twitter',
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
    ...otherOptionsToPassThrough
  });
}