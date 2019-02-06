const express = require('express');
const response = require('../utils/response');
const policies = require('../config/policies');
const models = require('../models');
const uuidv4 = require('uuid/v4');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();


/**
 * Get all organisations associated to current user
 */
router.get('/', policies.isAuthed, async (req, res) => {
  try {
    const organisations = await models.organisation.findAll({ createdBy: req.user.id });
    response.success(res, organisations);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * Get organisation by Id
 */
router.get('/:id', policies.isAuthed, policies.isOrganisationMember('params', 'id'), async (req, res) => {
  try {
    const organisation = await models.organisation.find({
      where: {
        id: req.params.id
      },
      include: [{
        model: models.user
      }]
    });

    if (organisation === null) {
      throw new Error('Organisation does not exist');
    }

    response.success(res, organisation);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * Invite user by email to organisation
 * Generates invite code and emails user
 * todo: RATELIMIT
 * todo: What happens when user already has an account?
 */
router.post('/:id/invite', policies.isAuthed, policies.isOrganisationMember('params', 'id'), async (req, res) => {
  try {
    // check email passed
    if (req.body.email === undefined) {
      throw new Error('Enter email address to send invite to');
    }

    // check organisation exists
    const organisation = await models.organisation.find({
      where: { id: req.params.id }
    });

    if (organisation === null) {
      throw new Error('Organisation does not exist');
    }

    const email = req.body.email.trim();

    // check that they aren't already in the system
    const user = await models.user.findOne({
      where: { email }
    });

    // FIXME: What if they exist but are added to a different organisation?
    if (user !== null) {
      throw new Error(`Email address has already been registered with the service. Please ask them to sign into the system with their email (${req.body.email})`);
    }

    // invalidate all previous invites
    await models.organisationInvite.update(
      { hasExpired: true },
      {
        where: {
          email,
          organisationId: organisation.id
        }
      }
    );

    // create new organisationInvite
    const invite = await models.organisationInvite.create({
      email,
      firstName: '',
      lastName: '',
      code: uuidv4(),
      organisationId: organisation.id,
      createdBy: req.user.id
    });

    const webUrl = process.env.WEB_URL || 'http://localhost:8080';
    const link = `${webUrl}/join/org/${invite.code}`;

    // email user with invite code
    const msg = {
      to: invite.email,
      from: 'admin@thinkactive.io',
      subject: `ThinkActive: You've been invited to join ${organisation.name}`,
      text: `Use this link ${link} to join the organisation`,
      html: `Use <a href="${link}">this link</a> to join the organisation`
    };

    sgMail.send(msg);

    response.success(res, invite.email);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * Join orgnisation using invite code
*/
router.post('/join', async (req, res) => {
  try {
    // check first name
    if (req.body.firstName === undefined) {
      throw new Error('Enter firstName to send invite');
    }

    // check last name
    if (req.body.lastName === undefined) {
      throw new Error('Enter lastName to send invite');
    }

    // check password
    if (req.body.password === undefined) {
      throw new Error('Please enter a password');
    }

    // check code passed
    if (req.body.code === undefined) {
      throw new Error('Please enter an invite code');
    }

    // find valid invite code
    const invite = await models.organisationInvite.findOne({
      where: {
        code: req.body.code,
        hasExpired: false
      }
    });

    if (invite === null) {
      throw new Error('Invite code invalid');
    }

    // check invite is still valid
    const codeCreatedAt = new Date(invite.createdAt);
    const timeoutPeriod = (process.env.INVITE_CODE_TIMEOUT_IN_HOURS * 60 * 60 * 1000);
    const inviteCodeTimeoutWindow = new Date(new Date().getTime() - timeoutPeriod);

    // test if codeCreatedAt is before our timeout window (i.e. now - 24 hours)
    // test if code has expired
    if (codeCreatedAt <= inviteCodeTimeoutWindow) {
      throw new Error('Invite code has expired, please request a new invite code');
    }

    const { email } = invite;

    // find or create user
    const [user, found] = await models.user.findOrCreate({
      defaults: {
        username: email.substr(0, email.indexOf('@')).replace(/[^a-z0-9]/gi, ''),
        password: await models.user.hashPassword(req.body.password),
        email
      },
      where: {
        email
      }
    });

    // add user to organisation
    const organisationUser = await models.organisationUser.create({
      organisationId: invite.organisationId,
      userId: user.id,
      role: 'organisationMember'
    });

    // make invite code invalid
    invite.hasExpired = true;
    invite.save();

    response.success(res, user);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * Get all available devices for available to an organisation
 * TODO: Refactor to only select devices associated with current organisation
 */
router.get('/:id/devices', policies.isAuthed, policies.isOrganisationMember('params', 'id'), async (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error('Organisation Id required');
    }
    // TODO: Implement logic to only select available devices that are not on deployment
    const devices = await models.device.findAll({
      where: {
        organisationId: req.params.id
      }
    });
    response.success(res, devices);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

module.exports = router;
