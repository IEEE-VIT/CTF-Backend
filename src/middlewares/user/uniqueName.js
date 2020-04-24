const { admin, database } = require('../../utils/firebase')

const uniqueName = (req, res, next) => {
    const userRef = database.collection('Users')
    var names = []
    console.log(userRef)
}

module.exports = uniqueName