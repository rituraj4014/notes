require('dotenv').config();
const express = require("express");
const cors = require('cors');
const path = require('path');

const connectDatabase = require("./config/db");

const app = express();
const port = 80;
connectDatabase(process.env.DATABASE_URL);

app.use(express.json());
app.use('/api/auth/login', require('./routes/login'));
app.use('/api/auth/register', require('./routes/register'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/user', require('./routes/user'));

app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(port, ()=>{
    console.log(`Backend Server listing on: ${port}`);
})