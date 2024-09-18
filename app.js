const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./database/database');
const indexRouter = require('./routes/index');

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY ||'secret';
const rootSecret=process.env.ROOT_SECRET || "root";
const adminSerct=process.env.ADMIN_SECRET || "admin";
const email=process.env.MY_EMAIL || "goodLuck@you.day";
const mongoDB = process.env.MONGO_URI ||'mongodb://127.0.0.1:27017/teabussiness';



app.listen(PORT, () => {
    console.log('----------------------------')
    console.log(`email:   ${email}`);
    console.log(`secretKey:   ${secretKey}`);
    console.log(`rootSecret:   ${rootSecret}`);
    console.log(`adminSerct:   ${adminSerct}`);
    console.log(`mongoDB:   ${mongoDB}`);
    console.log(`\napilimiter_on_cookie_or_ip:   300/5min`);
    console.log(`login_signup_limiter_on_ip:   20/5min`);
    console.log(`fileLimiter_on_ip:   800/5min`);
    console.log('----------------------------\n')
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
