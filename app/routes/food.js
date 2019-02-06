const express = require('express');
const models = require('../models');
const response = require('../utils/response');

const router = express.Router();

/* GET food by ID. */
router.get('/:id', async (req, res, next) => {
  try {
    const food = await models.food.findById(req.params.id);
    if (food === null) {
        throw new Error('food does not exist');
    }
    response.success(res, food);
  }
  catch (error) {
    console.error(error);
    response.failed(res, [error.message]);
  }
});

module.exports = router;