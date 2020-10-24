const request = require('supertest')
const app = require('../src/index')
const dotenv = require("dotenv");
dotenv.config();
const { admin, database } = require('../src/utils/firebase')
jest.setTimeout(100000);


// beforeAll(async () => {
//     await firebase.firestore.enableNetwork();
// });

// afterAll(async () => {
//     await firebase.firestore.close();
// });


test('api/', async () => {
    await request(app).get('/')
        .expect(200)

})


test('user/profile', async () => {
    await request(app)
        .post('/user/profile')
        .set('Authorization', process.env.AUTH_KEY)
        .expect(200)

})


test('user/leaderboard', async () => {
    await request(app)
        .post('/user/leaderboard')
        .set('Authorization', process.env.AUTH_KEY)
        .expect(200)

})


test('user/getAllQuestions', async () => {
    await request(app)
        .post('/user/getAllQuestions')
        .set('Authorization', process.env.AUTH_KEY)
        .expect(200)

})



test('user/checkFlag', async () => {
    await request(app)
        .post('/user/checkFlag')
        .set('Authorization', process.env.AUTH_KEY)
        .send({
            "id": "l1xy1mhrkg2d5x8z",
            "flag": "CTF{ziitest}"
        })
        .expect(200)

})


test('user/hint', async () => {
    await request(app)
        .post('/user/hint')
        .set('Authorization', process.env.AUTH_KEY)
        .send({
            "questionID": "l1xy1mhrkg2d5x8z"
        })
        .expect(200)

})

