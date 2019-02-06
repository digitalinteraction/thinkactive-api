const express = require('express');
const models = require('../models');
const response = require('../utils/response');
const policies = require('../config/policies');

const router = express.Router();

/* GET by ID. */
router.get('/:deploymentUserId', async (req, res) => {
  try {
    const state = await models.deploymentUserState.findOne({
        where: {
            deploymentUserId: req.params.deploymentUserId
        },
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 1
    });

    console.log(state);

    if(!state) {
        throw new Error("No state found");
    }
    
    const deploymentUserState = state;
    if (deploymentUserState === null) {
        throw new Error('deploymentUserState does not exist');
    }
    response.success(res, deploymentUserState);

    // models.deploymentUserState.findAll({
    //     limit: 1,
    //     where:{
    //         deploymentUserId : req.params.id
    //     },
    //     order:[['createdAt','DESC']]        
    // }).then(function(entries)
    // {
    //     if(entries.length > 0) {
    //         const deploymentUserState = entries[0];
    //         if (deploymentUserState === null) {
    //             throw new Error('deploymentUserState does not exist');
    //         }
    //         response.success(res, deploymentUserState);
    //     } else {
    //         throw new Error('deploymentUserState does not exist');
    //     }
    // }); 
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * Create deploymentUserState i.e. Log new state
 */
router.post('/', policies.isAuthed, async (req, res) => {
    try {
      // get the deployment object
      const deploymentUserState = req.body;
      if (deploymentUserState === undefined) {
        throw new Error('Deployment object invalid');
      }
      models.deploymentUser.findById(deploymentUserState.deploymentUserId)
        .then(async function(entry) {
            if(entry !== null) {
                const newdeploymentUserState = await models.deploymentUserState.create(deploymentUserState);
                response.success(res, newdeploymentUserState);
            }
            else {
                throw new Error('deploymentUser:'+deploymentUserState.deploymentUserId+' does not exist');
            }
        });
    }
    catch (error) {
        console.error(error);
        response.failed(res, [error.message]);
    }
});

module.exports = router;