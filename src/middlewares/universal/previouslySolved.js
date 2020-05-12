const { admin, database } = require('../../utils/firebase')

const previouslySolved = (req, res, next) => {
    console.log("Checking if Previously solved")
    const userRef = database.collection('Users').doc(req.body.uid)
    userRef.get()
        .then((doc) => {
            let solved = false
            doc._fieldsProto.qAnswered.arrayValue.values.forEach(question => {
                if (req.body.id === question.stringValue) {
                    solved = true
                }
            })
            if (solved) {
                console.log("Question Previously Solved")
                res.status(200).send({
                    payload: {
                        msg: "Question already solved"
                    }
                })
            } else {
                console.log("Question Not Previously Solved")
                next()
            }

        })
        .catch((e) => {
            console.log("Error in checking Previously solved")
            res.status(400).send({
                status: 400,
                payload: {
                    msg: "Error in checking Previously solved, Contact Support!"
                }
            })
        })
}

module.exports = previouslySolved