const express = require('express');
const models = require('../models');
const response = require('../utils/response');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  response.success(res, { request: req.originalUrl });
});

module.exports = router;
