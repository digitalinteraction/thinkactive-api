const express = require('express');
const response = require('../utils/response');
const policies = require('../config/policies');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json({ hello: 'hello' });
});

router.get('/test', policies.isAuthed, (req, res) => {
  // console.log(req.user);
  response.success(res, { hello: true });
});

module.exports = router;
