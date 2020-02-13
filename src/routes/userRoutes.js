const router = require("express")();
const userControls = require('../controllers/userControls');
const userCreate = require('../middlewares/user/userCreateMiddleware')
const previouslySolved = require('../middlewares/universal/previouslySolved');
const userAuth = require('../middlewares/user/userAuth');

router.post('/create',userCreate,(req,res)=>{
    userControls.createUser(req.user)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

router.post("/checkAnswer",[previouslySolved, userAuth], (req, res) => {
    userControls.checkAnswer(req.body.uid, req.body.answer, req.body.questionId)
        .then( resp => res.status(200).send(resp))
        .catch( err => res.status(400).send(err))
})

router.post('/hint',userAuth,(req,res)=>{
    var questionID = req.body.questionID;
    var uid = req.body.uid;
    userControls.fetchHint(questionID,uid)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

router.get('/getAllQuestions',[userAuth],(req,res)=>{
    userControls.readAllQuestion()
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

module.exports=router;