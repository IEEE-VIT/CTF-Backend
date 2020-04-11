const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
var cors = require('cors');
app.use(cors());
const chalk = require('chalk');
const dotenv = require("dotenv");
dotenv.config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


router.get('/', (req, res) => {
    res.send("Test successfull!")
})


//Route imports
const userRoute = require('./routes/userRoutes');
const questionRoute = require('./routes/tigerTeamRoutes');


//Use Routes
app.use('/user',userRoute);
app.use('/tigerTeam',questionRoute);


const port = process.env.PORT
app.listen(port,()=>{
    console.log('Server is up on port ',port)
})