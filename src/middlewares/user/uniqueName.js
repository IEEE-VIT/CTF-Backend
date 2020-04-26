const { admin, database } = require('../../utils/firebase')

const uniqueName = async (req, res, next) => {
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