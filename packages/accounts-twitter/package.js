Package.describe({
  name: 'efattal:accounts-twitter',
  version: '0.0.1',
  summary: 'Login service for Twitter accounts',
  git: 'https://github.com/efattal/meteor-accounts-linkedin',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('2.3');
  api.use('ecmascript');
  api.use('accounts-base@3.0.0-rc300.4', ['client', 'server']);
  api.imply('accounts-base@3.0.0-rc300.4', ['client', 'server']);
  api.use('accounts-oauth@1.4.5-rc300.4', ['client', 'server']);
  api.use('efattal:twitter-oauth@0.0.1');
  api.imply('efattal:twitter-oauth');

  api.addFiles("twitter.js");
});