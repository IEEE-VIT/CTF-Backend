const express = require('express');
const app = express();
const router = express.Router();
var cors = require('cors');
app.use(cors());
const chalk = require('chalk');
const dotenv = require("dotenv");
dotenv.config();
// const {admin,database} = require("./utils/firebase")
// const userRef = database.collection('Users').doc('hello')
//         userRef.set({
//             uid: 'user.uid',
//             name: 'user.name',
//             email: 'user.email',
//         })
//         .then(( resp )=>{
//             console.log(chalk.green("New user details saved in db"))
//         })
const port = process.env.PORT
app.listen(port,()=>{
    console.log('Server is up on port ',port)
})