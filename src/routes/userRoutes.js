const router = require("express")();
const userControls = require('../controllers/userControls');
const userCreate = require('../middlewares/user/userCreateMiddleware')
const userAuth = require('../middlewares/user/userAuth')

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

module.exports=router;