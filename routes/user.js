const express = require('express');
const route = express.Router();
const pool = require('../models/pool');
const body_parser = require('body-parser');
// const session = require('express-session')

route.use(body_parser.urlencoded({ extended: false }));
route.use(body_parser.json());


route.get('/dashboard',(req,res)=>{
    res.render('patient/dashboard_patient');
})


route.post('/registered',(req,res)=>{
    const text=req.body;
    // console.log(text);
    pool.query(`insert into users (Username, Name, Age, Mobile, Gender, Password) values (?,?,?,?,?,?)`, [text.Username,text.Name, text.Age, text.Mobile ,text.Gender, text.Password],(err,obj)=>{
        if(err){
            console.log(err);
            res.send('Username already exists!');
        }
       
        else{
            let qry2 = `create table ` + text.Username + ` (Date varchar(50), Doctor varchar(50), Category varchar(50), Description varchar(300), Medicine varchar(50), Report varchar(50))`
            pool.query(qry2, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("User successfully registered, proceed to login!")
                }
            })
        }
        
    });
})

route.get('/login',(req,res)=>{
    res.render('login',{action:'user'});
})

route.post('/logged',(req,res)=>{
    const pid=req.body.Username;
    pool.query(`select * from users where Username =? and Password=?`,[pid,req.body.Password],(err,obj)=>{
        if (err){
            console.log (err);
            res.redirect ('/user/login');
          }
          
          else{
            if (obj.length == 0){
              res.redirect('/user/login');
            }
          
            else{
              req.session.username = obj[0].name;
              res.render ('patient/dashboard_patient',{user:req.body.Username});
            }
          }

    })
})

route.get('/dashboard/appointment',(req,res)=>{
    res.render('patient/dashboard_appointment');
})

route.get('/dashboard/request',(req,res)=>{
    res.render('patient/dashboard_md');
})

route.get('/dashboard/diagnosis',(req,res)=>{
    res.render('patient/diagnosis');
})

route.get('/dashboard/treatment',(req,res)=>{
    res.render('patient/treatment_dashboard');
})

module.exports=route