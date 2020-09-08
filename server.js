const express = require('express');
const express_validator = require('express-validator');
const path = require('path');


const app = express();

const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>res.send('app is fucking'));

app.listen(PORT,()=>{
    console.log('bal')
});