const router = require("express")();
const quesControl = require('../controllers/questionControl');
// const quesCreate = require('../middlewares/question/question')
const tigerTeamAuth = require('../middlewares/question/tigerTeamAuth');

//route for CREATE Question
router.post('/create', tigerTeamAuth, (req, res) => {
    quesControl.createQuestion({
        name: req.body.quesName, 
        url: req.body.url, 
        description: req.body.description, 
        hint: req.body.hint,
        flag: req.body.flag
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

//route for READ Question
router.get('/read',tigerTeamAuth, (req, res) => {
    quesControl.readQuestion({
        id: req.body.id
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

//route for ALL READ Question
router.get('/readAll',tigerTeamAuth, (req, res) => {
    quesControl.readAllQuestion()
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

//route for UPDATE Question
router.patch('/update',tigerTeamAuth, (req, res) => {
    quesControl.updateQuestion({
        id: req.body.id, 
        name: req.body.quesName, 
        url: req.body.url, 
        description: req.body.description, 
        hint: req.body.hint,
        flag: req.body.flag
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

//route for DELETE Question
router.delete('/delete',tigerTeamAuth, (req, res) => {
    quesControl.deleteQuestion({
        id: req.body.id
    })
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})


module.exports = router;
