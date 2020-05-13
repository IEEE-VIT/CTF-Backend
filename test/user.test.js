const request = require('supertest')
const app = require('../src/index')




test('api/', async () => {
    await request(app).get('/')
        .expect(200)
})