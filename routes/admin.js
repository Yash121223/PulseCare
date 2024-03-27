const express = require('express');
const route = express.Router();
const pool = require('../models/pool');
const body_parser = require('body-parser');
const { renderSync } = require('node-sass');
// const sessions = require('sessions');

route.use(body_parser.urlencoded({ extended: false }));
route.use(body_parser.json());


// rendering the dashboard page

route.get('/dashboard',(req,res)=>{
    
    if(req.session.adminname){
        pool.query(`select * from doctors `,(err,data1)=>{
            if(err){
                console.log(err);
            }
            else{
                pool.query(`select count(*) as count from doctors`,(err,num)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
                            if (err){
                    
                                console.log(err);
                                res.render('admin/dashboard_admin',{notification:0,doctors:data1,num:num});
                            }else{
                                if(obj.length==0)
                                res.render('admin/dashboard_admin',{notification:0,doctors:data1,num:num});
                                else{
                                    res.render('admin/dashboard_admin',{notification:obj[0].count,doctors:data1,num:num[0].count});
                                }
                            }
                            
                        })
                    }
                })
            }
        })
    }
    else{
        res.redirect('/admin/login');
    }
    
})


// rendering the patients page

route.get('/dashboard/patients',(req,res)=>{
    if(req.session.adminname){
        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
            if (err){
    
                console.log(err);
                res.render('admin/patients',{notification:0});
            }else{
                if(obj.length==0)
                res.render('admin/patients',{notification:0});
                else{
                    res.render('admin/patients',{notification:obj[0].count});
                }
            }
            
        })
    }
    else{
        res.redirect('/admin/login');
    }
})

// rendering the appointment page

route.get('/dashboard/appointment',(req,res)=>{
    if(req.session.adminname){
        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
            if (err){
    
                console.log(err);
                res.render('admin/add_appointment',{notification:0});
            }else{
                if(obj.length==0)
                res.render('admin/add_appointment',{notification:0});
                else{
                    res.render('admin/add_appointment',{notification:obj[0].count});
                }
            }
            
        })
    }
    else{
        res.redirect('/admin/login');
    }
})

// rendering the login page

route.get('/login',(req,res)=>{
    res.render('login',{action:'admin'});
})

// Login process

route.post('/logged',(req,res)=>{
    if(req.body.Username=='Pulsecare ka admin'&&req.body.Password=='kake ka hone wala baccha'){
        req.session.adminname=req.body.Username;
        res.redirect('/admin/dashboard');
    }
})


// adding doctors in the database

route.post('/doctor/added',(req,res)=>{
    let qry=`insert into doctors values(?,?,?,?,?)`;
    pool.query(qry,[req.body.name,req.body.department,req.body.degree,req.body.date,req.body.mobile],(err,obj)=>{
        if(err){
            console.log(err);
            res.redirect('/admin/dashboard/add_doctor')
        }else{
            res.redirect('/admin/dashboard');
        }
    })
})

// Doctor Adding form display

route.get('/dashboard/doctor',(req,res)=>{
    if(req.session.adminname){
        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
            if (err){
    
                console.log(err);
                res.render('admin/add_doctor',{notification:0});
            }else{
                if(obj.length==0)
                res.render('admin/add_doctor',{notification:0});
                else{
                    res.render('admin/add_doctor',{notification:obj[0].count});
                }
            }
            
        })
    }
    else{
        res.redirect('/admin/login');
    }
})

// Health Factors update

route.get('/dashboard/update/health',(req,res)=>{
    if(req.session.adminname){
        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
            if (err){
    
                console.log(err);
                res.render('admin/update_health',{notification:0});
            }else{
                if(obj.length==0)
                res.render('admin/update_health',{notification:0});
                else{
                    res.render('admin/update_health',{notification:obj[0].count});
                }
            }
            
        })
    }
    else{
        res.redirect('/admin/login');
    }
})


// Information update

route.get('/dashboard/update/info',(req,res)=>{
    if(req.session.adminname){
        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
            if (err){
    
                console.log(err);
                res.render('admin/update_info',{notification:0});
            }else{
                if(obj.length==0)
                res.render('admin/update_info',{notification:0});
                else{
                    res.render('admin/update_info',{notification:obj[0].count});
                }
            }
            
        })
    }
    else{
        res.redirect('/admin/login');
    }
})

// updating ptients

route.get('/dashboard/update/patient',(req,res)=>{
    if(req.session.adminname){
        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
            if (err){
    
                console.log(err);
                res.render('admin/update_patient',{notification:0});
            }else{
                if(obj.length==0)
                res.render('admin/update_patients',{notification:0});
                else{
                    res.render('admin/update_patients',{notification:obj[0].count});
                }
            }
            
        })
    }
    else{
        res.redirect('/admin/login');
    }
})

// Adding report of the patient

route.get('/dashboard/update/report',(req,res)=>{
    if(req.session.adminname){
        pool.query('select count (*) as count from users where is_new=1',(err,obj)=>{
            if (err){
    
                console.log(err);
                res.render('admin/update_report',{notification:0});
            }else{
                if(obj.length==0)
                res.render('admin/update_report',{notification:0});
                else{
                    res.render('admin/update_report',{notification:obj[0].count});
                }
            }
            
        })
    }
    else{
        res.redirect('/admin/login');
    }
})

// Simple Logout FUnction

route.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/login');
    
})


module.exports=route;