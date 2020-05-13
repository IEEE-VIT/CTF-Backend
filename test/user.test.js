const request = require('supertest')
const app = require('../src/index')
jest.setTimeout(100000);


beforeAll(done => {
    done()
})

afterAll(done => {
    // Closing the server connection allows Jest to exit successfully.
    done()
})


test('api/', async () => {
    await request(app).get('/')
        .expect(200)

})


test('user/profile', async () => {
    await request(app)
        .post('/user/profile')
        .set('Authorization', 'XAvpYLfU9eTCTfCkEvQIH8nXpy62')
        .expect(200)

})


test('user/leaderboard', async () => {
    await request(app)
        .post('/user/leaderboard')
        .expect(200)

})


test('user/getAllQuestions', async () => {
    await request(app)
        .post('/user/getAllQuestions')
        .set('Authorization', 'XAvpYLfU9eTCTfCkEvQIH8nXpy62')
        .expect(200)

})



test('user/checkFlag', async () => {
    await request(app)
        .post('/user/checkFlag')
        .set('Authorization', 'XAvpYLfU9eTCTfCkEvQIH8nXpy62')
        .send({
            "id": "22258tk9zelzvg",
            "flag": "CTF{flag1}"
        })
        .expect(200)

})


test('user/hint', async () => {
    await request(app)
        .post('/user/hint')
        .set('Authorization', 'XAvpYLfU9eTCTfCkEvQIH8nXpy62')
        .send({
            "questionID": "22258tk9zelzvg"
        })
        .expect(200)

})

