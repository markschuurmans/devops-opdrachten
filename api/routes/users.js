var express = require('express');
var router = express.Router();

const { db } = require("../services/database");
const { publishUserCreated } = require('../services/messageQueue.js');

/* GET users listing. */
router.get('/', async function(req, res) {
  let users = await db.collection('users').find().toArray();
  res.json(users);
});

router.post('/', async function(req, res) {
  try {
    const user = await db.collection('users').insertOne(req.body);
    await publishUserCreated({
      userId: user.insertedId.toString(),
      payload: req.body
    });
    res.status(201).json({ id: user.insertedId });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;