const express = require('express');
const express_validator = require('express-validator');
const path = require('path');

const connectDb = require('./config/db');

const app = express();

const PORT = process.env.PORT || 5000;

connectDb();

app.get('/',(req,res)=>res.send('app is fucking'));

app.listen(PORT,()=>{
    console.log('bal')
});