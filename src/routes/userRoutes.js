const router = require("express")();
const userControls = require('../controllers/userControls');
const userCreate = require('../middlewares/user/userCreateMiddleware');
const verifyRecaptcha = require('../middlewares/user/recaptcha');
const previouslySolved = require('../middlewares/universal/previouslySolved');
const userAuth = require('../middlewares/user/userAuth');
// const capcha = require('../middlewares/user/capcha');
const uniqueName = require('../middlewares/user/uniqueName')
const chalk = require('chalk')
// var Recaptcha = require('recaptcha-verify')

// var recaptcha = new Recaptcha({
//     secret: process.env.RECAPTCHA_KEY,
//     verbose: true
// });

// router.post("/auth/recaptcha", (req,res) => {
//     console.log("recaptcha request");
// 	var token = req.body.token;
// 	console.log(token)

//     recaptcha.checkResponse(token,function(error,response){
// 		console.log(response)
//         if (response.success) {
//             console.log("Verified recaptcha")
// 			res.status(200).send({auth: 1, message: "Verified captcha"})
// 		}
//         else {
//             console.log("not verified recaptcha")
// 			res.status(401).send({auth: 0, message: "Failed to verify"})
// 		}
//     })
// })

//route to create for a user
router.post('/create', [verifyRecaptcha, userCreate], (req, res) => {
    userControls.createUser(req.user)
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})


// //route to check flags on submit
// router.post('/checkFlag', [verifyRecaptcha, userAuth, previouslySolved], (req, res) => {
//     userControls.checkAnswer(
//         req.body.uid,
//         req.body.flag,
//         req.body.id
//     )
//         .then(resp => res.status(200).send(resp))
//         .catch(err => res.status(400).send(err))
// })


// //route to show the hint of a given question
// router.post('/hint', [userAuth], (req, res) => {
//     const questionID = req.body.questionID;
//     const uid = req.body.uid;
//     userControls.fetchHint(questionID, uid)
//         .then(resp => res.status(200).send(resp))
//         .catch(err => res.status(400).send(err))
// })


// //route to get all questions on the globe
// router.post('/getAllQuestions', [userAuth], (req, res) => {
//     const uid = req.body.uid
//     userControls.readAllQuestion(uid)
//         .then(resp => res.status(200).send(resp))
//         .catch(err => res.status(400).send(err))
// })


// //route to show the user profile
// router.post('/profile', [userAuth], (req, res) => {
//     userControls.showProfile({
//         "uid": req.body.uid
//     })
//         .then(resp => res.status(200).send(resp))
//         .catch(err => res.status(400).send(err))
// })


// // route to update the user profile
// router.post('/updateProfile', [verifyRecaptcha, userAuth, uniqueName], (req, res) => {
//     userControls.updateProfile({
//         uid: req.body.uid,
//         userName: req.body.userName
//     })
//         .then(resp => res.status(200).send(resp))
//         .catch(err => res.status(400).send(err))
// })

// router.post('/leaderboard', [userAuth], (req, res) => {
//     console.log(chalk.yellow('Fetching Leaderboards...'))
//     userControls.getLeaderboard()
//         .then(resp => res.send(resp).status(200))
//         .catch(err => res.status(400).send(err))
// })

module.exports = router;
