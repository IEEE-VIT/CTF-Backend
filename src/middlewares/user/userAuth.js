const { checkUserUid, checkUserObject } = require('../../controllers/userControls');

const userAuth = async (req, res, next) => {
    try {
        console.log('entered user auth')
        if(req.header("Authorization") === undefined){
            throw new Error("Unauthorized")
        }
        const uid = req.header("Authorization").replace("Bearer ", "")
        console.log(uid)
        await checkUserUid(uid)
        await checkUserObject(uid)
        next()
    } catch (error) {
        res.status(400).send({
            statusCode: 400,
            payload: {
                err: error
            }
        })
    }
}

module.exports = userAuth