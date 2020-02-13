const { admin, database } = require('../../utils/firebase')

const previouslySolved = (req, res, next) => {
    // console.log(req)
    const userRef = database.collection('Users').doc(req.body.uid)
    userRef.get()
        .then((doc) => {
            doc._fieldsProto.qAnswered.arrayValue.values.forEach(question => {
                if (req.body.questionId === question.stringValue) {
                    res.status(200).send({
                        payload: {
                            msg: "Question already solved"
                        }
                    })
                }
            });
            next()
        })
}

module.exports = previouslySolved