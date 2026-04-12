var express = require('express');
var router = express.Router();

const { db } = require('../services/database');

router.get('/', async function(req, res) {
  const orders = await db.collection('orders').find().toArray();
  res.json(orders);
});

router.post('/', async function(req, res) {
  try {
    const doc = {
      ...req.body,
      source: 'api',
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('orders').insertOne(doc);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

