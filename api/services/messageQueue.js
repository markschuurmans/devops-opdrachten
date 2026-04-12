const amqp = require('amqplib');

const rabbitUrl = process.env.RABBITMQ_URL;
const queueName = process.env.USER_CREATED_QUEUE || 'user.created';

let channelPromise;

async function getChannel() {
  if (process.env.MQ_DISABLED === 'true' || !rabbitUrl) {
    return null;
  }

  if (!channelPromise) {
    channelPromise = amqp.connect(rabbitUrl)
      .then((connection) => connection.createChannel())
      .then(async (channel) => {
        await channel.assertQueue(queueName, { durable: true });
        return channel;
      });
  }

  return channelPromise;
}

async function publishUserCreated(payload) {
  const channel = await getChannel();
  if (!channel) {
    return;
  }

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
    persistent: true
  });
}

module.exports = {
  publishUserCreated
};

