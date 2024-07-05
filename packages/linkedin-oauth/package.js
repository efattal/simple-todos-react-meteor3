Package.describe({
  name: 'efattal:linkedin-oauth',
  version: '1.0.4',
  summary: 'Linkedin OAuth flow',
  git: 'https://github.com/efattal/meteor-linkedin-oauth',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('2.3');
  api.use('ecmascript');
  api.use('oauth2@~1.3.3-rc300.4', ['client', 'server']);
  api.use('oauth@~3.0.0-rc300.4', ['client', 'server']);
  api.use('http@1.4.4 || 2.0.0', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('linkedin-client.js', 'client');
  api.addFiles('linkedin-server.js', 'server');

  api.export('Linkedin');
});