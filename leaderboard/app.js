const express = require("express")
const bodyParser = require("body-parser")

const app = express()




const port = process.env.PORT || 8000
console.log(port)
app.listen(port, ()=>{
    console.log("Server started at: "+port)
})