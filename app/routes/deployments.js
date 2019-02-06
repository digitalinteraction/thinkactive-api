const express = require('express');
const response = require('../utils/response');
const policies = require('../config/policies');
const models = require('../models');
const avatar = require('../utils/avatar');
const PDFGenerator = require('../utils/pdf-generator');
const moment = require('moment');

const router = express.Router();


/**
 * GET all deployments associated to current user
 */
router.get('/', policies.isAuthed, async (req, res) => {
  try {
    const deployments = await models.deployment.findAll({ createdBy: req.user.id });
    response.success(res, deployments);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * GET deployment by Id
 */
router.get('/:id', policies.isAuthed, policies.canAccessDeployments('params', 'id'), async (req, res) => {
  try {
    const deployment = await models.deployment.findById(req.params.id);

    if (deployment === null) {
      throw new Error('Deployment does not exist');
    }

    response.success(res, deployment);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * GET deployment users
*/
router.get('/:deploymentId/users', policies.isAuthed, policies.canAccessDeployments('params', 'deploymentId'), async (req, res) => {
  try {
    // TODO: reformat this function to use proper relationships and ORM logic
    let deploymentDevices = await models.deploymentDevice.findAll({
      where: {
        deploymentId: req.params.deploymentId,
        isActiveDevice: true
      },
      include: [
        {
          model: models.deployment
        },
        {
          model: models.device
        },
        {
          model: models.deploymentUser
        }
      ]
    });

    deploymentDevices = deploymentDevices.map(deploymentDevice => ({
      id: deploymentDevice.deploymentUserId,
      animal: deploymentDevice.deploymentUser.animal,
      colour: deploymentDevice.deploymentUser.colour,
      macAddress: deploymentDevice.device.macAddress,
      deploymentDeviceId: deploymentDevice.id,
      avatar: deploymentDevice.deploymentUser.avatar,
      deploymentId: deploymentDevice.deploymentId,
      lastBlockSynced: deploymentDevice.lastBlockSynced,
      lastRTC: deploymentDevice.lastRTC,
      lastSyncTime: deploymentDevice.lastSyncTime
    }));

    if (deploymentDevices === null) {
      throw new Error('Deployment does not exist or does not have any users associated with this deployment');
    }
    response.success(res, deploymentDevices);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * POST deployment with device list
 */
router.post('/', policies.isAuthed, policies.isOrganisationMember('body', 'organisationId'), async (req, res) => {
  try {
    // get the deployment object
    const deployment = req.body;

    if (deployment === undefined) {
      throw new Error('Deployment object invalid');
    }

    // TODO: implement date checking logic
    const newDeployment = await models.deployment.create(deployment);

    deployment.id = newDeployment.id;

    const deviceIds = deployment.devices.map(device => device.id);
    // associate the devices with new avatars
    // check we have a valid list of ids
    const devices = await models.device.findAndCountAll({
      where: {
        id: deviceIds
      },
      raw: true
    });

    if (devices.count !== deployment.devices.length) {
      throw new Error('Devices do not exist');
    }

    const avatars = avatar.generate(devices.count, 2);

    const users = [];
    // create users
    for (let i = 0; i < avatars.length; i += 1) {
      users.push({
        username: `${avatars[i].avatar}-${newDeployment.id}`
      });
    }

    const newUsers = await models.user.bulkCreate(users, { returning: true });

    const deploymentUsers = [];
    for (let i = 0; i < newUsers.length; i += 1) {
      deploymentUsers.push({
        deploymentId: newDeployment.id,
        userId: newUsers[i].id,
        avatar: avatars[i].avatar,
        colour: avatars[i].colour,
        animal: avatars[i].animal
      });
    }

    const newDeploymentUsers = await models.deploymentUser.bulkCreate(
      deploymentUsers,
      { returning: true }
    );

    if (newDeploymentUsers.length !== devices.count) {
      throw new Error('Not enough devices for number of avatar identites requested');
    }

    const deploymentDevices = [];
    for (let i = 0; i < newDeploymentUsers.length; i += 1) {
      deploymentDevices.push({
        deploymentId: newDeployment.id,
        deviceId: devices.rows[i].id,
        deploymentUserId: newDeploymentUsers[i].id,
        isActiveDevice: true
      });
    }

    const newDeploymentDevices = await models.deploymentDevice.bulkCreate(
      deploymentDevices,
      { returning: true }
    );

    // TODO: Insert logic to confirmt that deploymentDevice has not already been allocated elsewhere
    // TODO: Confirm the deployment should return a list of devices
    response.success(res, deployment);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * GET deployment challenge
*/
router.get('/:deploymentId/challenges', policies.isAuthed, policies.canAccessDeployments('params', 'deploymentId'), async (req, res) => {
  try {
    // TODO: reformat this function to use proper relationships and ORM logic
    const deploymentChallenges = await models.challenge.findAll({
      where: {
        deploymentId: req.params.deploymentId
      }
    });

    response.success(res, deploymentChallenges);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * POST deployment challenge
*/
// TODO: Improve error checking on parameters in endpoint
router.post('/:deploymentId/challenges', policies.isAuthed, policies.canAccessDeployments('params', 'deploymentId'), async (req, res) => {
  try {
    const challenge = await models.challenge.create({
      deploymentId: req.params.deploymentId,
      name: req.body.name,
      message: req.body.message,
      metric: req.body.metric,
      mode: req.body.mode,
      target: req.body.target,
      start: req.body.start,
      end: req.body.end,
      deleted: req.body.deleted,
      createdBy: req.user.id
    });

    response.success(res, challenge);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * PUT deployment challenge
*/
// TODO: Improve error checking on parameters in endpoint
router.put('/:deploymentId/challenges/:challengeId', policies.isAuthed, policies.canAccessDeployments('params', 'deploymentId'), async (req, res) => {
  try {
    let challenge = await models.challenge.update(
      {
        deploymentId: req.params.deploymentId,
        name: req.body.name,
        message: req.body.message,
        metric: req.body.metric,
        mode: req.body.mode,
        target: req.body.target,
        start: req.body.start,
        end: req.body.end,
        deleted: req.body.deleted,
        createdBy: req.user.id
      },
      {
        where: {
          id: req.params.challengeId
        }
      }
    );

    challenge = await models.challenge.findById(req.params.challengeId);

    response.success(res, challenge);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});


/**
 * POST deploymentDevice data
 *
 */
router.post('/:deploymentId/device/:deploymentDeviceId/data', policies.isAuthed, policies.canAccessDeployments('params', 'deploymentId'), async (req, res) => {
  try {
    const deployment = await models.deployment.findById(req.params.deploymentId);

    if (!deployment) {
      throw new Error('Deployment not found');
    }

    // check is valid device
    const deploymentDevice = await models.deploymentDevice.find({
      where: {
        deploymentId: deployment.id,
        deploymentUserId: req.body.deploymentUserId,
        id: req.params.deploymentDeviceId
      }
    });

    if (!deploymentDevice) {
      throw new Error('Deployment device not found');
    }

    // update device information
    deploymentDevice.lastBlockSynced = req.body.lastBlockSynced;
    deploymentDevice.lastRTC = req.body.lastRTC;
    deploymentDevice.lastSyncTime = req.body.lastSyncTime;
    await deploymentDevice.save();

    const lastSyncRecord = await models.deviceSync.findOne({
      where: {
        deploymentUserId: req.body.deploymentUserId,
        deploymentDeviceId: req.body.deploymentDeviceId
      },
      order: [
        ['id', 'DESC']
      ],
      limit: 1
    });

    let firstSampleDateTime;
    let lastSampleDateTime;

    if (req.body.samples.length > 0) {
      firstSampleDateTime = req.body.samples[0].recordedOn;
      lastSampleDateTime = req.body.samples[req.body.samples.length - 1].recordedOn;
    }

    // create sync record
    const deviceSync = await models.deviceSync.create({
      batteryLevel: req.body.batteryLevel,
      deploymentDeviceId: deploymentDevice.id,
      deploymentUserId: req.body.deploymentUserId,
      // limit to max length of DB field
      raw: JSON.stringify({
        raw: req.body.raw,
        samples: req.body.samples.length,
        firstSampleDateTime,
        lastSampleDateTime
      }).substr(0, 4294967294)
    });

    let samples = [];
    let latestDeviceSyncSample = null;
    // check we have a sync record for this user (could be new user)
    if (lastSyncRecord) {
      // find the associated data
      latestDeviceSyncSample = await models.deviceData.findOne({
        where: {
          deviceSyncId: lastSyncRecord.id
        },
        order: [
          ['recordedOn', 'DESC']
        ]
      });
    }

    // check if sync actually had any device data for that latest sync
    if (latestDeviceSyncSample) {
      // check that samples are after this point in time otherwise discard
      // const earliestDateTimeInSamples = new Date(Math.min.apply(null, req.body.samples.map(e => new Date(e.recordedOn))));
      // loop through samples and make sure the recordedOn isn't greater than our latest recordedOn value
      req.body.samples.map((sample) => {
        if (new Date(sample.recordedOn).getTime() > new Date(latestDeviceSyncSample.recordedOn).getTime()) {
          samples.push({
            deviceSyncId: deviceSync.id,
            steps: sample.steps,
            batteryLevel: sample.batteryLevel,
            recordedOn: sample.recordedOn,
            deploymentDeviceId: deploymentDevice.id,
            deploymentUserId: req.body.deploymentUserId
          });
        }
      });
    }
    else {
      // we dont have any data for this device, insert the new data
      samples = req.body.samples.map(sample => ({
        deviceSyncId: deviceSync.id,
        steps: sample.steps,
        batteryLevel: sample.batteryLevel,
        recordedOn: sample.recordedOn,
        deploymentDeviceId: deploymentDevice.id,
        deploymentUserId: req.body.deploymentUserId
      }));
    }

    const deviceSamples = await models.deviceData.bulkCreate(samples);

    response.success(res, {});
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
 * GET deploymentDevice data for individual or groups of users
 * TODO: Protect this endpoint from large queries
 */
router.get('/:deploymentId/data', policies.isAuthed, policies.canAccessDeployments('params', 'deploymentId'), async (req, res) => {
  try {
    const deploymentUserIds = req.param('deploymentUserIds').split(',');
    const from = req.param('from');
    const to = req.param('to');
    const interval = req.param('interval');
    const intervalUnit = req.param('intervalUnit');

    const result = {};
    const deployment = await models.deployment.findById(req.params.deploymentId);

    if (!deployment) {
      throw new Error('Deployment not found');
    }

    const deploymentUsers = await models.deploymentUser.findAll({
      where: {
        id: deploymentUserIds,
        deploymentId: deployment.id
      },
      attributes: ['id']
    });

    if (!deploymentUsers) {
      throw new Error('Deployment user(s) not found');
    }

    // get active devices
    let fromUnix = moment(from).unix();
    let toUnix = moment(to).unix();
    let DATE_FORMAT = '%Y-%m-%d %H:%i:00';
    const groups = [
      'deploymentUserId',
      models.sequelize.fn('YEAR', models.sequelize.col('deviceData.recordedOn'))
    ];

    if (intervalUnit === 'MINUTE') {
      fromUnix = moment(from).seconds(0).unix();
      toUnix = moment(to).seconds(0).unix();

      DATE_FORMAT = '%Y-%m-%d %H:%i:00';
      groups.push(models.sequelize.fn('MONTH', models.sequelize.col('deviceData.recordedOn')));
      groups.push(models.sequelize.fn('DAY', models.sequelize.col('deviceData.recordedOn')));
      groups.push(models.sequelize.fn('HOUR', models.sequelize.col('deviceData.recordedOn')));
      groups.push(models.sequelize.fn('FLOOR', models.sequelize.condition(models.sequelize.fn('MINUTE', models.sequelize.col('deviceData.recordedOn')), '/', interval)));
    }
    else if (intervalUnit === 'HOUR') {
      fromUnix = moment(from).minutes(0).seconds(0).unix();
      toUnix = moment(to).minutes(0).seconds(0).unix();

      DATE_FORMAT = '%Y-%m-%d %H:00:00';
      groups.push(models.sequelize.fn('MONTH', models.sequelize.col('deviceData.recordedOn')));
      groups.push(models.sequelize.fn('DAY', models.sequelize.col('deviceData.recordedOn')));
      groups.push(models.sequelize.fn('FLOOR', models.sequelize.condition(models.sequelize.fn('HOUR', models.sequelize.col('deviceData.recordedOn')), '/', interval)));
    }
    else if (intervalUnit === 'DAY') {
      fromUnix = moment(from)
        .hours(0)
        .minutes(0)
        .seconds(0)
        .unix();

      toUnix = moment(to)
        .hours(0)
        .minutes(0)
        .seconds(0)
        .unix();

      DATE_FORMAT = '%Y-%m-%d 00:00:00';
      groups.push(models.sequelize.fn('MONTH', models.sequelize.col('deviceData.recordedOn')));
      groups.push(models.sequelize.fn('FLOOR', models.sequelize.condition(models.sequelize.fn('DAY', models.sequelize.col('deviceData.recordedOn')), '/', interval)));
    }
    else if (intervalUnit === 'MONTH') {
      fromUnix = moment(from)
        .days(0)
        .hours(0)
        .minutes(0)
        .seconds(0)
        .unix();

      toUnix = moment(to)
        .days(0)
        .hours(0)
        .minutes(0)
        .seconds(0)
        .unix();

      DATE_FORMAT = '%Y-%m-01 00:00:00';
      groups.push(models.sequelize.fn('FLOOR', models.sequelize.condition(models.sequelize.fn('MONTH', models.sequelize.col('deviceData.recordedOn')), '/', interval)));
    }

    const deviceData = await models.deviceData.findAll({
      attributes: [
        [models.sequelize.fn('sum', models.sequelize.col('deviceData.steps')), 'steps'],
        [
          models.sequelize.fn('UNIX_TIMESTAMP', models.sequelize.fn('DATE_FORMAT', models.sequelize.fn('min', models.sequelize.col('deviceData.recordedOn')), DATE_FORMAT)), 'recordedOn'],
        'deploymentUserId'
      ],
      where: {
        deploymentUserId: deploymentUserIds,
        recordedOn: {
          $between: [moment(fromUnix, 'X').format('YYYY-MM-DD HH:mm:ss'), moment(toUnix, 'X').format('YYYY-MM-DD HH:mm:ss')]
        }
      },
      group: groups,
      raw: true
    });

    const timeBucket = {};
    const momentFrom = moment(fromUnix, 'X');
    const momentTo = moment(toUnix, 'X');

    // Create dictionary of timestamps at given interval period
    for (let bucketDateTime = momentFrom; bucketDateTime.unix() < momentTo.unix(); bucketDateTime.add(interval, intervalUnit)) {
      timeBucket[bucketDateTime.unix()] = 0;
    }

    // console.log(timeBucket);

    // // for each deploymentUser add the time bucket object
    for (let i = 0; i < deploymentUserIds.length; i += 1) {
      result[deploymentUserIds[i]] = { ...timeBucket };
    }

    for (let i = 0; i < deviceData.length; i += 1) {
      // console.log(`recordedOn: ${deviceData[i].recordedOn} steps: ${deviceData[i].steps} deploymentUserId: ${deviceData[i].deploymentUserId}`);
      result[deviceData[i].deploymentUserId][deviceData[i].recordedOn] = parseInt(deviceData[i].steps, 10);
    }

    // loop through deviceData and add data to associated deploymentUserId key and pass in step data
    // for (let i = 0; i < deviceData.length; i += 1) {
    //   const availableRanges = Object.keys(timeBucket);
    //   for (let timeBucketIndex = 0; timeBucketIndex < availableRanges.length; timeBucketIndex += 1) {

    //     // console.log(`bucket start: ${availableRanges[timeBucketIndex]} bucket end: ${availableRanges[timeBucketIndex + 1]} recordedOn: ${deviceData[i].recordedOn} steps: ${deviceData[i].steps} deploymentUserId: ${deviceData[i].deploymentUserId}`);

    //     if (timeBucketIndex === (availableRanges.length - 1)) {
    //       result[deviceData[i].deploymentUserId][availableRanges[timeBucketIndex]] += parseInt(deviceData[i].steps, 10);
    //     }
    //     else if (deviceData[i].recordedOn >= availableRanges[timeBucketIndex] && deviceData[i].recordedOn < availableRanges[timeBucketIndex + 1]) {
    //       result[deviceData[i].deploymentUserId][availableRanges[timeBucketIndex]] += parseInt(deviceData[i].steps, 10);
    //     }
    //   }
    // }

    response.success(res, result);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

/**
* GET deployment pdfs
*/
router.get('/:deploymentId/files/:fileName', policies.isAuthed, policies.canAccessDeployments('params', 'deploymentId'), async (req, res) => {
  try {
    const deploymentUsers = await models.deploymentUser.findAll({
      where: {
        deploymentId: req.params.deploymentId
      },
      raw: true
    });

    let doc = null;

    if (req.params.fileName === 'avatarLabelSheet.pdf') {
      doc = PDFGenerator.drawAvatarLabelSheet(deploymentUsers);
    }
    else if (req.params.fileName === 'cribsheet.pdf') {
      doc = PDFGenerator.drawTeacherCribSheet(deploymentUsers);
    }
    else if (req.params.fileName === 'chargingDockLabels.pdf') {
      doc = PDFGenerator.drawChargingDockSheet(deploymentUsers);
    }
    else if (req.params.fileName === 'infoBookletLabels.pdf') {
      doc = PDFGenerator.drawInfoBookletLabelSheet(deploymentUsers);
    }

    if (doc) {
      doc.pipe(res);
      doc.end();
    }
    else {
      throw new Error('File not found');
    }
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

module.exports = router;
