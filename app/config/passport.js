const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// models
const models = require('../models');

module.exports = (passport) => {
  // passportjs configuration
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    let user;
    try {
      user = await models.user.scope('withPassword').findOne({
        where: { email }
      });

      // user not found
      if (!user) {
        return done(null, false);
      }

      if (!user.password) {
        return done(null, false);
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        return done(null, false);
      }
    }
    catch (error) {
      console.error(error);
      return done(error);
    }

    return done(null, user);
  }));

  // Configure Passport authenticated session persistence.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let user;
    try {
      user = await models.user.findOne({
        where: { id }
      });
    }
    catch (error) {
      console.error(error);
      return done(error);
    }

    return done(null, user);
  });
};
