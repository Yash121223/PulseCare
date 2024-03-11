const express  =require('express');
const app=express();
const port=8080;
const path = require('path');
const user=require('./routes/user');
const admin=require('./routes/admin')
app.use(express.static('public'));
const hbs=require('hbs');
// app.set('views',path.join(__dirname,'views'));

app.set('view engine', 'hbs');

app.use('/user',user);

app.use('/admin',admin);


app.get('/',(req,res)=>{
    res.render('login');
})


app.listen(port,()=>{
    console.log('server connected');
})