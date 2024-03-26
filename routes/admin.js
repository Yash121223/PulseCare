const express = require('express');
const route = express.Router();
const pool = require('../models/pool');
const body_parser = require('body-parser');
const { renderSync } = require('node-sass');
// const sessions = require('sessions');

route.use(body_parser.urlencoded({ extended: false }));
route.use(body_parser.json());

route.get('/dashboard',(req,res)=>{
    
    if(req.session.adminname){
        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
            if (err){
    
                console.log(err);
                res.render('admin/dashboard_admin',{notification:0});
            }else{
                if(obj.length==0)
                res.render('admin/dashboard_admin',{notification:0});
                else{
                    res.render('admin/dashboard_admin',{notification:obj[0].count});
                }
            }
            
        })
    }
    else{
        res.redirect('/admin/login');
    }
    
})

route.get('/dashboard/patients',(req,res)=>{
    res.render('admin/patients');
})

route.get('/dashboard/appointment',(req,res)=>{
    res.render('admin/add_appointment');
})

route.get('/login',(req,res)=>{
    res.render('login',{action:'admin'});
})
route.post('/logged',(req,res)=>{
    if(req.body.Username=='Pulsecare ka admin'&&req.body.Password=='kake ka hone wala baccha'){
        req.session.adminname=req.body.Username;
        res.redirect('/admin/dashboard');
    }
})

route.get('/dashboard/doctor',(req,res)=>{
    res.render('admin/add_doctor');
})

route.get('/dashboard/update/health',(req,res)=>{
    res.render('admin/update_health');
})

route.get('/dashboard/update/info',(req,res)=>{
    res.render('admin/update_info');
})

route.get('/dashboard/update/patient',(req,res)=>{
    res.render('admin/update_patients');
})

route.get('/dashboard/update/report',(req,res)=>{
    res.render('admin/update_report');
})

route.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/login');
    
})


module.exports=route;