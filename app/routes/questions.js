const express = require('express');
const models = require('../models');
const response = require('../utils/response');

const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const questions = await models.question.findAll();
    response.success(res, questions);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});


/* GET by ID. */
router.get('/:id', async (req, res, next) => {
  try {
    const question = await models.question.findById(req.params.id);
    response.success(res, question);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

module.exports = router;
