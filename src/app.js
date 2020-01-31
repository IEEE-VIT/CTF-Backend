const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
var cors = require('cors');
app.use(cors());
const chalk = require('chalk');
const dotenv = require("dotenv");
dotenv.config();
<<<<<<< HEAD
// const {admin,database} = require("./utils/firebase")
// const userRef = database.collection('Users').doc('hello')
//         userRef.update({
//             uid: 'user',
//         })
//         .then(( resp )=>{
//             console.log(chalk.green("New user details saved in db"))
//         })
=======


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route imports
const userRoute = require('./routes/user');

//Use Routes
app.use('/user',userRoute);

>>>>>>> 2b2136edbfcf3e0488da1a3b31d65a543804d7c8
const port = process.env.PORT
app.listen(port,()=>{
    console.log('Server is up on port ',port)
})