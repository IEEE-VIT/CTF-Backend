var Recaptcha = require('recaptcha-verify');

var recaptcha = new Recaptcha({
    secret: process.env.RECAPTCHA_KEY,
    verbose: true
});

const verifyCaptcha = (req, res, next) => {
    try {
        var token = req.body.token;
        recaptcha.checkResponse(token,function(error,response){
            if (response.success) {
                console.log("Verified recaptcha")
                next();
                // res.status(200).send({auth: 1, message: "Verified captcha"})
            }
            else {
                console.log("not verified recaptcha")
                res.status(404).send({auth: 0, message: "Unathorized"})
            }
        })
        
    } catch(e) {
        res.send(500).send({message: "Contact server"})
    }
}

module.exports = verifyCaptcha;