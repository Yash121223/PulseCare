const express = require('express');
const route = express.Router();
const pool = require('../models/pool');
const body_parser = require('body-parser');
const { renderSync } = require('node-sass');
// sending mails
const nodemailer=require('nodemailer');
var transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'ayash0876@gmail.com',
        pass:'hcmqitxoarqoiabv'
    }
})
// adding multer for adding pdfs
const { v4: uuid, parse } = require('uuid')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/files");
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.split(".");
        ext = ext[ext.length - 1];

        let filename = uuid() + "." + ext;
        req.FileName = filename;
        cb(null, filename);
    },
});
const upload = multer({ storage: storage })
// const sessions = require('sessions');

route.use(body_parser.urlencoded({ extended: false }));
route.use(body_parser.json());


// rendering the dashboard page

route.get('/dashboard', (req, res) => {

    if (req.session.adminname) {
        pool.query(`select * from doctors `, (err, data1) => {
            if (err) {
                console.log(err);
            }
            else {
                pool.query(`select count(*) as count from doctors`, (err2, num) => {
                    if (err2) {
                        console.log(err2);
                    }
                    else {
                        pool.query('select *  from users where is_new=1', (err, obj) => {
                            if (err) {

                                console.log(err);
                                res.render('admin/dashboard_admin', { notification: 0, doctors: data1, num: num });
                            } else {
                                pool.query(`select *  from appointments where Status=3`, (err1, obj1) => {

                                    if (obj.length == 0)
                                        res.render('admin/dashboard_admin', { notification: obj.length + obj1.length, doctors: data1, num: num, userss: obj, request: obj1 });
                                    else {
                                        res.render('admin/dashboard_admin', { notification: obj.length + obj1.length, doctors: data1, num: num[0].count, userss: obj, request: obj1 });
                                    }
                                })
                            }

                        })
                    }
                })
            }
        })
    }
    else {
        res.redirect('/admin/login');
    }

})

route.post('/appointmentapprovals',(req,res)=>{
    pool.query(`update appointments set Status=? where P_id =?`,[req.body.status,req.body.username],(err,obj)=>{
        pool.query('select Email from users where Username =?',[req.body.username],(err,email)=>{
            if(err){
                console.log(err)
            }else{
                
                var mailoptions={
                    from:'ayash0876@gmail.com',
                    to:email[0].Email,
                    subject:'Regarding the appointment you requested.',
                    text:'Hello! your appointment requested is '
                }
                transporter.sendMail(mailoptions,((err,info)=>{
                    console.log('Mail sent');
                }))
                res.send([]);

            }
        })
    })
})



// rendering the patients page

route.get('/dashboard/patients', (req, res) => {
    if (req.session.adminname) {
        pool.query(`select * from users`, (err, data) => {
            if (err)
                console.log(err)
            else {
                pool.query('select count (*) as count from users where is_new=1', (err, obj) => {
                    if (err) {

                        console.log(err);
                        res.render('admin/patients', { notification: 0, patient: data });
                    } else {
                        if (obj.length == 0)
                            res.render('admin/patients', { notification: 0, patient: data });
                        else {
                            res.render('admin/patients', { notification: obj[0].count, patient: data });
                        }
                    }

                })

            }
        })

    }
    else {
        res.redirect('/admin/login');
    }
})

// rendering the appointment page

route.get('/dashboard/appointment', (req, res) => {
    if (req.session.adminname) {
        pool.query('select count (*) as count from users where is_new=1', (err, obj) => {
            if (err) {

                console.log(err);
                res.render('admin/add_appointment', { notification: 0 });
            } else {
                if (obj.length == 0)
                    res.render('admin/add_appointment', { notification: 0 });
                else {
                    res.render('admin/add_appointment', { notification: obj[0].count });
                }
            }

        })
    }
    else {
        res.redirect('/admin/login');
    }
})
//updating the appointment list

route.post('/appointment/done', (req, res) => {
    let b = req.body;
    pool.query(`insert into appointments values(?,?,?,?,?)`, [b.id, b.date, b.doctor, b.category, b.status], (err, obj) => {
        if (err) {
            console.log(err);
            res.send('appointment can not be done');

        }
        else
            res.send('appointment added')


    })
})









// rendering the login page

route.get('/login', (req, res) => {
    res.render('login', { action: 'admin' });
})

// Login process

route.post('/logged', (req, res) => {
    if (req.body.Username == 'chichi' && req.body.Password == '1329') {
        req.session.adminname = req.body.Username;
        res.redirect('/admin/dashboard');
    }
})


// adding doctors in the database

route.post('/doctor/added', (req, res) => {
    let qry = `insert into doctors values(?,?,?,?,?)`;
    pool.query(qry, [req.body.name, req.body.department, req.body.degree, req.body.date, req.body.mobile], (err, obj) => {
        if (err) {
            console.log(err);
            res.redirect('/admin/dashboard/add_doctor')
        } else {
            res.redirect('/admin/dashboard');
        }
    })
})

// Doctor Adding form display

route.get('/dashboard/doctor', (req, res) => {
    if (req.session.adminname) {
        pool.query('select count (*) as count from users where is_new=1', (err, obj) => {
            if (err) {

                console.log(err);
                res.render('admin/add_doctor', { notification: 0 });
            } else {
                if (obj.length == 0)
                    res.render('admin/add_doctor', { notification: 0 });
                else {
                    res.render('admin/add_doctor', { notification: obj[0].count });
                }
            }

        })
    }
    else {
        res.redirect('/admin/login');
    }
})

// Health Factors update

route.get('/dashboard/update/health', (req, res) => {
    if (req.session.adminname) {
        pool.query('select count (*) as count from users where is_new=1', (err, obj) => {
            if (err) {

                console.log(err);
                res.render('admin/update_health', { notification: 0 });
            } else {
                if (obj.length == 0)
                    res.render('admin/update_health', { notification: 0 });
                else {
                    res.render('admin/update_health', { notification: obj[0].count });
                }
            }

        })
    }
    else {
        res.redirect('/admin/login');
    }
})

//setting health factors

route.post(`/updated/health`, (req, res) => {
    let p = req.body;
    pool.query(`INSERT INTO info_form (Username, Temperature, Heart_Rate, Blood_Group, Systole, Diastole, SpO2, Respiration, BMI, FiO2) values(?,?,?,?,?,?,?,?,?,?)`, [p.id, p.temperature, p.heartRate, p.blood, p.systole, p.diastole, p.spo, p.respiration, p.bmi, p.fio], (err, obj) => {
        if (err)
            console.log(err)
        else
            res.send(`health information updated`)
    })
})


// Information update

route.get('/dashboard/update/info', (req, res) => {
    if (req.session.adminname) {
        pool.query('select count (*) as count from users where is_new=1', (err, obj) => {
            if (err) {

                console.log(err);
                res.render('admin/update_info', { notification: 0 });
            } else {
                if (obj.length == 0)
                    res.render('admin/update_info', { notification: 0 });
                else {
                    res.render('admin/update_info', { notification: obj[0].count });
                }
            }

        })
    }
    else {
        res.redirect('/admin/login');
    }
})

//setting information

route.post(`/updated/info`, (req, res) => {
    pool.query(`UPDATE users
    SET Doctor = ? , Disease = ? , is_new = 0
    WHERE Username = ? ;
    `, [req.body.doctor, req.body.Disease, req.body.id], (err, obj) => {
        if (err)
            console.log(err)
        else
            res.send(`User info updated`)
    })
})

// updating patients

route.get('/dashboard/update/patient', (req, res) => {
    if (req.session.adminname) {
        pool.query('select count (*) as count from users where is_new=1', (err, obj) => {
            if (err) {

                console.log(err);
                res.render('admin/update_patient', { notification: 0 });
            } else {
                if (obj.length == 0)
                    res.render('admin/update_patients', { notification: 0 });
                else {
                    res.render('admin/update_patients', { notification: obj[0].count });
                }
            }

        })
    }
    else {
        res.redirect('/admin/login');
    }
})

// Adding report of the patient

route.get('/dashboard/update/report', (req, res) => {
    if (req.session.adminname) {
        pool.query('select count (*) as count from users where is_new=1', (err, obj) => {
            if (err) {

                console.log(err);
                res.render('admin/update_report', { notification: 0 });
            } else {
                if (obj.length == 0)
                    res.render('admin/update_report', { notification: 0 });
                else {
                    res.render('admin/update_report', { notification: obj[0].count });
                }
            }

        })
    }
    else {
        res.redirect('/admin/login');
    }
})

//Adding report
route.post(`/updated/reports`, upload.single('report'), (req, res) => {
    let c = req.body;

    pool.query(`INSERT INTO reports (Username,Date,Doctor,Category,Description,Medicine,Report) values(?,?,?,?,?,?,?) `, [c.id, c.date, c.doctor, c.category, c.description, c.medicine, req.FileName], (err, obj) => {
        if (err)
            console.log(err)
        else
            res.send(`Report added succefully`)
    })
})

// Simple Logout FUnction

route.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin/login');

})


module.exports = route;