const chalk = require('chalk')

const  tigerTeamAuth = (req, res, next) => {
	const secret = req.body.secret
	if(secret === process.env.Tiger_Team_Pass){
		console.log(chalk.green("Access Granted\nUser Authorized"))
		next()
	} else{
		res.status(400).send({
			statusCode: 400,
			payload: {
				errorMsg: "Unauthorized User"
			}
		})
	}
}

module.exports = tigerTeamAuth