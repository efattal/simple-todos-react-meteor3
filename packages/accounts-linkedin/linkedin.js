Accounts.oauth.registerService('linkedin');

if (Meteor.isClient) {
  const loginWithLinkedin = (options, callback) => {
    // support a callback without options
    if (!callback && typeof options === 'function') {
      callback = options;
      options = null;
    }

    const credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Linkedin.requestCredential(options, credentialRequestCompleteCallback);
  }

  Accounts.registerClientLoginFunction('linkedin', loginWithLinkedin);

  Meteor.loginWithLinkedin = (...args) => {
    Accounts.applyLoginFunction('linkedin', args);
  }
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: ['services.linkedin']
  })
}