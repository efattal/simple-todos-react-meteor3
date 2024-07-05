Package.describe({
  name: 'efattal:accounts-linkedin',
  version: '1.0.4',
  summary: 'Login service for Linkedin accounts',
  git: 'https://github.com/efattal/meteor-accounts-linkedin',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('2.3');
  api.use('ecmascript');
  api.use('accounts-base@3.0.0-rc300.4', ['client', 'server']);
  api.imply('accounts-base@3.0.0-rc300.4', ['client', 'server']);
  api.use('accounts-oauth@1.4.5-rc300.4', ['client', 'server']);
  api.use('efattal:linkedin-oauth@1.0.4');
  api.imply('efattal:linkedin-oauth');

  api.addFiles("linkedin.js");
});