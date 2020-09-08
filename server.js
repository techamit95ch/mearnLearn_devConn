const express = require('express');
const express_validator = require('express-validator');
const path = require('path');

const connectDb = require('./config/db');

const app = express();

const PORT = process.env.PORT || 5000;

connectDb();

app.use('/api/users',require('./routes/api/users'));

app.use('/api/auth',require('./routes/api/auth'));

app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));
app.get('/',(req,res)=>res.send('app is fucking'));

app.listen(PORT,()=>{ 
    console.log('bal')
});