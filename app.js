const express  =require('express');
const app=express();
const port=900;
const path = require('path');
const user=require('./routes/user');
const admin=require('./routes/admin')
app.use(express.static('public'));
const session=require('express-session');
app.use(session({
    secret:'rashika',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:3600000*5}
}))
const hbs=require('hbs');
// app.set('views',path.join(__dirname,'views'));

app.set('view engine', 'hbs');

app.use('/user',user);

app.use('/admin',admin);


app.get('/',(req,res)=>{
    res.render('index');
})



app.get('/contact',(req,res)=>{
    res.render('contact');
})

app.post('/mailsent',(req,res)=>{
    res.send("Query sent!");
})


app.listen(port,()=>{
    console.log('server connected');
})