const request = require('supertest');
const app = require('../../app');
const { db, client } = require('../../services/database');

describe('Orders routes', () => {
  beforeEach(async () => {
    await db.collection('orders').deleteMany({});
  });

  afterAll(async () => {
    await client.close();
  });

  it('should return all orders', async () => {
    await db.collection('orders').insertOne({ item: 'book', source: 'api' });

    const res = await request(app).get('/orders');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toEqual(expect.objectContaining({ item: 'book' }));
  });

  it('should create an order', async () => {
    const payload = { item: 'pen', quantity: 2 };

    const res = await request(app).post('/orders').send(payload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');

    const saved = await db.collection('orders').findOne({ item: 'pen' });
    expect(saved).toEqual(expect.objectContaining({ item: 'pen', quantity: 2, source: 'api' }));
  });
});

