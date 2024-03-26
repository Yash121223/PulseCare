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
    pool.query(`insert into users (Name, Age, Mobile, Gender, Password) values (?,?,?,?,?)`, [text.Name, text.Age, text.Mobile ,text.Gender, text.Password],(err,obj)=>{
        if(err)
        console.log(err);
        else
        res.render('login');
    });
})

route.get('/login',(req,res)=>{
    res.render('login');
})

route.post('/logged',(req,res)=>{
    const pid=req.body.Username.substring(4);
    pool.query(`select * from users where P_id =? and Password=?`,[pid,req.body.Password],(err,obj)=>{
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
              res.redirect ('/user/dashboard');
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