import { Meteor } from 'meteor/meteor';
import '/imports/api';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  ServiceConfiguration.configurations.upsertAsync(
    { service: "google" },
    {
      $set: {
        loginStyle: "popup",
        clientId: Meteor.settings.google.clientId,
        secret: Meteor.settings.google.secret
      },
    }
  );

  ServiceConfiguration.configurations.upsertAsync(
    { service: 'linkedin' },
    {
      $set: {
        loginStyle: 'popup',
        clientId: Meteor.settings.linkedIn.clientId,
        secret: Meteor.settings.linkedIn.secret,
      }
    });

  ServiceConfiguration.configurations.upsertAsync(
    { service: 'github' },
    {
      $set: {
        loginStyle: 'popup',
        clientId: Meteor.settings.github.clientId,
        secret: Meteor.settings.github.secret,
      }
    });

  ServiceConfiguration.configurations.upsertAsync(
    { service: 'twitter' },
    {
      $set: {
        loginStyle: 'popup',
        clientId: Meteor.settings.twitter.clientId,
        secret: Meteor.settings.twitter.secret,
      }
    });

  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUserAsync({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
      profile: {
        name: SEED_USERNAME
      },
    });
  }

});

Accounts.onCreateUser(function (options, user: Meteor.User) {
  if (typeof (user.services.google) != "undefined") {
    const { name, email, verified_email, picture } = user.services.google
    user.profile = {
      name,
      email,
      picture
    }
  }
  else if (typeof (user.services.linkedin) != "undefined") {
    const { name, email, verified_email, picture, locale } = user.services.linkedin
    user.profile = {
      name,
      email,
      picture,
      locale
    }
  }
  else if (typeof (user.services.github) != "undefined") {
    const { username, email, avatar } = user.services.github
    user.profile = {
      name: username,
      email,
      picture: avatar
    }
  }
  else if (typeof (user.services.twitter) != "undefined") {
    const { name, email, profile_image_url } = user.services.twitter
    user.profile = {
      name,
      email,
      picture: profile_image_url
    }
  }

  return user;
});