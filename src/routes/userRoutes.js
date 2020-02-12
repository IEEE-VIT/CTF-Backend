const router = require("express")();
const userControls = require('../controllers/userControls');
const userCreate = require('../middlewares/user/userCreateMiddleware')

router.post('/create',userCreate,(req,res)=>{
    userControls.createUser(req.user)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

router.post("/checkAnswer", (req, res) => {
    userControls.checkAnswer(req.body.uid, req.body.answer, req.body.questionId)
        .then( resp => res.status(200).send(resp))
        .catch( err => res.status(400).send(err))
})

router.post('/hint',(req,res)=>{
    var questionID = req.body.questionID;
    var uid = req.body.uid;
    userControls.fetchHint(questionID,uid)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

module.exports=router;