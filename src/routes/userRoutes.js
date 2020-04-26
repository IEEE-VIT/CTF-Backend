const router = require("express")();
const userControls = require('../controllers/userControls');
const userCreate = require('../middlewares/user/userCreateMiddleware');
const previouslySolved = require('../middlewares/universal/previouslySolved');
const userAuth = require('../middlewares/user/userAuth');
const capcha = require('../middlewares/user/capcha');
const uniqueName = require('../middlewares/user/uniqueName')
const chalk = require('chalk')


//route to create for a user
router.post('/create', [userCreate], (req, res) => {
    userControls.createUser(req.user)
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})


//route to show the user profile
router.post('/profile', [userAuth], (req, res) => {
    userControls.showProfile({
        "uid": req.body.uid
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})


//route to update the user profile
router.put('/updateProfile', [userAuth, uniqueName], (req, res) => {
    userControls.updateProfile({
        uid: req.body.uid,
        userName: req.body.userName
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})


//route to get all questions on the globe
router.post('/getAllQuestions', [userAuth], (req, res) => {
    userControls.readAllQuestion()
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})


//route to show the user profile
router.post('/profile', [userAuth], (req, res) => {
    userControls.showProfile({
        "uid": req.body.uid
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

router.post('/leaderboard', (req, res) => {
    console.log(chalk.yellow('Fetching Leaderboards...'))
    userControls.getLeaderboard()
        .then(resp => res.send(resp).status(200))
        .catch(err => res.status(400).send(err))
})

module.exports = router;