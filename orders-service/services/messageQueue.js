const amqp = require('amqplib');
const { db } = require('./database');

const rabbitUrl = process.env.RABBITMQ_URL;
const queueName = process.env.USER_CREATED_QUEUE || 'user.created';

async function startConsumer() {
  if (process.env.MQ_DISABLED === 'true' || !rabbitUrl) {
    return;
  }

  const connection = await amqp.connect(rabbitUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (message) => {
    if (!message) {
      return;
    }

    try {
      const payload = JSON.parse(message.content.toString());
      await db.collection('orders').insertOne({
        type: 'USER_CREATED',
        userId: payload.userId,
        payload: payload.payload,
        source: 'queue',
        createdAt: new Date().toISOString()
      });
      channel.ack(message);
    } catch (err) {
      console.error('Failed processing user.created message', err);
      channel.nack(message, false, false);
    }
  });
}

module.exports = {
  startConsumer
};

