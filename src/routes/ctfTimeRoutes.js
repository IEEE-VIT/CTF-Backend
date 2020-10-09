const router = require("express")();
const chalk = require('chalk');
const ctfTimeControls = require("../controllers/ctfTimeControls");

router.get('/minimalScoreboard', (req, res) => {
    console.log(chalk.yellow('Fetching Scoreboard...'))
    ctfTimeControls.getMinimalScoreboard()
        .then(resp => res.send(resp).status(200))
        .catch(err => res.status(400).send(err))
})

router.get('/logs', (req, res) => {
    var id = req.query.lastId;
    ctfTimeControls.getLogs(id)
        .then(resp => res.send(resp).status(200))
        .catch(err => res.status(400).send(err))
})

module.exports = router;