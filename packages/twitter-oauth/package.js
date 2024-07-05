Package.describe({
  name: 'efattal:twitter-oauth',
  version: '0.0.1',
  summary: 'Twitter OAuth flow',
  git: 'https://github.com/efattal/meteor-twitter-oauth',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('2.3');
  api.use('ecmascript');
  api.use('oauth2@~1.3.3-rc300.4', ['client', 'server']);
  api.use('oauth@~3.0.0-rc300.4', ['client', 'server']);
  api.use('http@1.4.4 || 2.0.0', 'server');
  api.use('ostrio:base64', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('twitter-client.js', 'client');
  api.addFiles('twitter-server.js', 'server');

  api.export('Twitter');
});