const  tigerTeamAuth = () => {
    const secret = req.body.secret
    if(secret === process.env.Tiger_Team_Pass){
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