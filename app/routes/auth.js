const express = require('express');

const router = express.Router();
const response = require('../utils/response');
const passport = require('passport');
const models = require('../models');
const uuidv4 = require('uuid/v4');
const policies = require('../config/policies');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* POST Register new user */
router.post('/register', async (req, res) => {
  let user;

  try {
    if (!req.body.password) {
      throw new Error('Please pass valid password');
    }

    user = await models.user.create({
      username: req.body.username.trim(),
      password: await models.user.hashPassword(req.body.password),
      email: req.body.email.trim()
    });

    response.success(res, { user });
  }
  catch (error) {
    console.error(error);
    response.failed(res, error);
  }
});

/* POST Login user */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (error, user, info) => {
    if (error) {
      return response.failed(res, [error]);
    }

    if (info) {
      return response.failed(res, [info.message]);
    }

    if (!user) {
      return response.unauthorized(res, ['Authentication failed']);
    }

    await req.logIn(user, (err) => {
      if (err) {
        response.failed(res, err);
      }

      return true;
    });

    return response.success(res, req.user.toJSON());
  })(req, res, next);
});

/* POST Log current user out */
router.post('/forgot', async (req, res) => {
  try {
    if (req.body.email === undefined) {
      throw new Error('Username is required');
    }

    const user = await models.user.findOne({ where: { email: req.body.email } });
    // if we have user, generate forgotten code
    if (user !== null) {
      // invalidate all previous forgotten password requests
      const forgottenPasswords = await models.forgottenPassword.update(
        { hasExpired: true },
        { where: { userId: user.id } }
      );

      // create new forgottenPassword
      const forgottenPassword = await models.forgottenPassword.create({
        userId: user.id,
        token: uuidv4()
      });

      const webUrl = process.env.WEB_URL || 'http://localhost:8080';
      const link = `${webUrl}/login/reset/${forgottenPassword.token}`;

      const msg = {
        to: user.email,
        from: 'admin@thinkactive.io',
        subject: 'Forgotten Password Request',
        text: `Use this link ${link} to reset your password`,
        html: `Use <a href="${link}">this link</a> to reset your password`
      };

      if (process.NODE_ENV !== 'testing') {
        sgMail.send(msg);
      }
    }

    response.success(res);
  }
  catch (error) {
    // console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * POST Reset password
 * todo: RATELIMIT
*/
router.post('/reset', async (req, res) => {
  try {
    if (req.body.token === undefined) {
      throw new Error('Provide a forgotten token');
    }

    if (req.body.password === undefined) {
      throw new Error('Provide a new password');
    }

    // find forgottenPassword record by email + token
    let user = await models.user.findOne({
      // where: { email: req.body.email },
      include: [{
        model: models.forgottenPassword,
        where: { token: req.body.token }
      }]
    });

    // test if we found a result
    if (user === null) {
      throw new Error('Invalid token or email address');
    }

    const tokenCreatedAt = new Date(user.forgottenPasswords[0].createdAt);
    // timeout = tokenCreatedAt + 24 hours (expires in 24 hours time)
    const timeoutPeriod = (process.env.FORGOTTEN_PASSWORD_TIMEOUT_IN_HOURS * 60 * 60 * 1000);
    const forgottenPasswordTimeoutWindow = new Date(tokenCreatedAt.getTime() + timeoutPeriod);
    const now = new Date();
    // test if tokenCreatedAt is before our timeout window (i.e. now - 24 hours)
    // test if token has expired

    if (now.getTime() > forgottenPasswordTimeoutWindow.getTime() ||
      user.forgottenPasswords[0].hasExpired === true) {
      throw new Error('Forgotten password request has expired, please request a new forgotten password');
    }

    user.password = await models.user.hashPassword(req.body.password);
    await user.save();

    // Update forgotten password record to be expired
    user.forgottenPasswords[0].hasExpired = true;
    await user.forgottenPasswords[0].save();

    // Remove forgotten password object
    user = user.toJSON();
    delete user.forgottenPasswords;

    response.success(res, user);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/* POST Log current user out */
router.post('/logout', async (req, res) => {
  req.logout();
  response.success(res, {});
});

/* GET Current user */
router.get('/me', policies.isAuthed, (req, res, next) => {
  try {
    const user = req.user.toJSON();
    response.success(res, user);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

module.exports = router;
