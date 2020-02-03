const router = require("express")();
const quesControl = require('../controllers/quesControls');
// const quesCreate = require('../middlewares/question/question')

//route for CREATE Question
router.post('/tigerTeam/create', (req, res) => {
    quesControl.createQuestion({
        name: req.body.quesName, 
        url: req.body.url, 
        description: req.body.description, 
        hint: req.body.hint
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

//route for READ Question
router.post('/tigerTeam/read', (req, res) => {
    quesControl.readQuestion({
        uid: req.body.uid
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

//route for ALL READ Question
router.post('/tigerTeam/readAll', (req, res) => {
    quesControl.readAllQuestion()
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

//route for UPDATE Question
router.post('/tigerTeam/update', (req, res) => {
    quesControl.updateQuestion({
        uid: req.body.uid, 
        name: req.body.quesName, 
        url: req.body.url, 
        description: req.body.description, 
        hint: req.body.hint
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

//route for DELETE Question
router.post('/tigerTeam/delete', (req, res) => {
    quesControl.deleteQuestion({
        uid: req.body.uid
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})


module.exports = router;
