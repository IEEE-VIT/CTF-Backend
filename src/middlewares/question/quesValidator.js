const validator = require('validator')

const quesValidator = (req, res, next) => {
    //store all the parameters of the request in constants
    const name = req.body.name.trim()
    const url = req.body.url.trim()
    const description = req.body.description.trim()
    const hint = req.body.hint.trim()
    const flag = req.body.flag.trim()

    //Array to store all the errors
    const errorList = []

    //Check on name
    if (!validator.isAlphanumeric(name) || name.lenght > 20) {
        errorList.push('Name can only be AlphaNumeric and length less than 20 character!')
    }

    //Check on url
    if(!validator.isURL(url)){
        errorList.push('URL is Invalid, Please enter a valid URL')
    }

    //Check on hint
    if(){
        errorList.push('')
    }

    //Check on flag
    if(){
        errorList.push('')
    }

    if (errorList.length !== 0) {
        res.status(400).send({
            statusCode: 400,
            payload: {
                status: "Error",
                errorMsg: errorList
            }
        })
    } else {
        //if no error recorded then pass the request
        const quesData = {
            name,
            url,
            description,
            hint,
            flag
        }
        req.quesData = quesData
        next()
    }

}

module.exports = quesValidator