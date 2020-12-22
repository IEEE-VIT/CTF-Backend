const { admin, database } = require('../../utils/firebase')
const validator = require('validator');

const uniqueName = async (req, res, next) => {
	if (!validator.isAlphanumeric(validator.blacklist(req.body.userName, ' '))) {
		res.status(400).send({
			payload: {
				msg: "Username invalid"
			}
		})
	}

	if (req.body.userName.length < 5 || req.body.userName.length > 24) {
		res.status(400).send({
			payload: {
				msg: "Username too short or long. Username should be between 5-24 characters."
			}
		})
	}
	console.log('Unique Name Check')
	const userRef = database.collection('Users')
	await userRef.get()
		.then(snap => {
			allUsers = []
			snap.forEach(doc => {
				const id = doc.id;
				const username = doc.data().userName
				allUsers.push(
					username
				)
			})
			return (allUsers)
		})
		.then((users) => {
			const index = users.indexOf(req.body.userName)
			if (index < 0) {
				next()
			} else {
				res.status(400).send({
					statusCode: 400,
					payload: {
						status: "User Name already Taken",
					}
				})
			}
		})
		.catch((e) => {
			console.log("Error in Reading all the User details")
			res.status(400).send({
				status: 400,
				payload: {
					msg: "Error in reading User data, Contact Support!"
				}
			})
		})
}

module.exports = uniqueName