const express = require('express');
const app = express();
const router = express.Router();
var cors = require('cors');
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT
app.listen(port,()=>{
    console.log('Server is up on port ',port)
})