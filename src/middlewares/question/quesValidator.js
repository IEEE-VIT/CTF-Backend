const validator = require('validator')
const chalk = require('chalk')

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
    if((hint.lenght > 20)){
        errorList.push('Hint length should be less than 20 character!')
    }

    //Check on flag
    if((flag.match(/(^CTF\{[A-Z0-9!@#$%^&*_+=-]{5,20}\}$)/gi) == null)){
        errorList.push('Flag needs to be of the type CTF{I_am_a_FLAG}')
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
        console.log(chalk.green("Validation Check Complete\nNo Issues Found\n"))
        next()
    }

}

module.exports = quesValidator