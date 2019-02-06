const response = require('../utils/response');
const models = require('../models');

module.exports = {
  isAuthed(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    else {
      response.unauthorized(res, ['You are not authorized to perform that action']);
    }
  },
  isOrganisationMember(target, key) {
    return async (req, res, next) => {
      try {
        const organisationId = req[target][key];

        console.log(organisationId);

        const organisation = await models.organisationUser.findOne({
          where: {
            organisationId,
            userId: req.user.id
          }
        });

        if (!organisation) {
          throw new Error('You are not authorized to perform that action');
        }

        next();
      }
      catch (error) {
        console.error(error);
        response.unauthorized(res, [error.message]);
      }
    };
  },
  canAccessDeployments(target, key) {
    return async (req, res, next) => {
      try {
        const deploymentId = req[target][key];

        const deployment = await models.deployment.findById(deploymentId);

        if (!deployment) {
          throw new Error('You are not authorized to perform that action');
        }

        const organisation = await models.organisationUser.findOne({
          where: {
            organisationId: deployment.organisationId,
            userId: req.user.id
          }
        });

        if (!organisation) {
          throw new Error('You are not authorized to perform that action');
        }

        next();
      }
      catch (error) {
        console.error(error);
        response.unauthorized(res, [error.message]);
      }
    };
  }
};
