const express = require('express');
const route = express.Router();
// const pool = require('../models/pool');
const body_parser = require('body-parser');
// const session = require('express-session')

route.use(body_parser.urlencoded({ extended: false }));
route.use(body_parser.json());


route.get('/dashboard',(req,res)=>{
    res.render('patient/dashboard_patient');
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