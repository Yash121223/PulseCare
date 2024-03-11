const express = require('express');
const route = express.Router();
// const pool = require('../models/pool');
const body_parser = require('body-parser');
// const sessions = require('sessions');

route.use(body_parser.urlencoded({ extended: false }));
route.use(body_parser.json());

route.get('/dashboard',(req,res)=>{
    res.render('admin/dashboard_admin');
})

route.get('/dashboard/patients',(req,res)=>{
    res.render('admin/patients');
})

route.get('/dashboard/appointment',(req,res)=>{
    res.render('admin/add_appointment');
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


module.exports=route;