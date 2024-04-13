const express = require('express');
const route = express.Router();
const pool = require('../models/pool');
const body_parser = require('body-parser');
// const session = require('express-session')

route.use(body_parser.urlencoded({ extended: false }));
route.use(body_parser.json());


route.get('/dashboard', (req, res) => {
    if (req.session.username) {
        // console.log(req.session.username)
        let uname = req.session.username
        pool.query(`select * from info_form where Username = ? `, [uname], (err, data) => {
            if (err)
                console.log(err)
            else {
                res.render('patient/dashboard_patient', { user: req.session.username, info: data });

            }
        })


    }
    else {

        res.redirect('/user/login')
    }
})


route.post('/registered', (req, res) => {
    const text = req.body;
    // console.log(text);
    pool.query(`insert into users (Username, Name,Email, Age, Mobile, Gender, Password) values (?,?,?,?,?,?,?)`, [text.Username, text.Name, text.Email, text.Age, text.Mobile, text.Gender, text.Password], (err, obj) => {
        if (err) {
            console.log(err);
            res.redirect('/user/login?status=2')
        }

        else {
            let qry2 = `create table ` + text.Username + ` (Date varchar(50), Doctor varchar(50), Category varchar(50), Description varchar(300), Medicine varchar(50), Report varchar(50))`
            pool.query(qry2, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    // res.send("User successfully registered, proceed to login!")
                    res.redirect('/user/login?status=1')
                }
            })
        }

    });
})

route.get('/login', (req, res) => {
    if (req.query.status == 1) {

        res.render('login', { action: 'user', status: 'User Registered Successfully!!' });

    } else if (req.query.status == 2) {
        res.render('login', { action: 'user', status: 'Username Already Exists!' });
    }
    else if (req.query.status == 3) {
        res.render('login', { action: 'user', status: 'Invalid Credentials!!' });
    }
    else {
        res.render('login', { action: 'user' });
    }
})

route.post('/logged', (req, res) => {
    const pid = req.body.Username;
    pool.query(`select * from users where Username =? and Password=?`, [pid, req.body.Password], (err, obj) => {
        if (err) {
            res.redirect('/user/login?status=3')
        }

        else {
            if (obj.length == 0) {
                res.redirect('/user/login?status=3')
            }

            else {
                //   console.log(obj[0]);
                req.session.username = obj[0].Username;

                //   console.log(req.session.username);
                res.redirect('/user/dashboard');
            }
        }

    })
})

route.get('/dashboard/appointment', (req, res) => {
    if (req.session.username) {

        let uname = req.session.username;
        // console.log(req.session.username)
        pool.query(`select * from appointments where P_id = ? and Status='1' `, [uname], (err, data) => {
            if (err)
                console.log(err)
            else {
                res.render('patient/dashboard_appointment', { user: req.session.username, info: data });

            }
        })
    }
    else {

        res.redirect('/user/login')
    }

})

route.get('/dashboard/request', (req, res) => {
    if (req.session.username) {
        // console.log(req.session.username)
        pool.query(`select Name from doctors`,(err,docname)=>{
            if(err)
            res.send(err)
            else{
                if (req.query.status == 1) {

                    res.render('patient/dashboard_md', { action: 'user', status: 'Appointment request sent!!', user: req.session.username,doc:docname });
        
                }
                // else if(req.query.status==2) {
                //     res.render('patient/dashboard_md',{action:'user',status:'User info can not be updated!!',user:req.session.username});
        
                // }
                else {
                    res.render('patient/dashboard_md', { action: 'user', user: req.session.username,doc:docname });
                }
            }
        })


    }
    else {

        res.redirect('/user/login')
    }

})

route.post('/appointment/requested', (req, res) => {
    pool.query(`insert into appointments (P_id,Date, Doctor, Category, Status) values(?,?,?,?, '3') `, [req.session.username, req.body.Date, req.body.Doctor, req.body.Category], (err, obj) => {
        if (err) {
            res.redirect('/user/dashboard/request?status=2')
        }
        else {
            res.redirect('/user/dashboard/request?status=1')
        }
    })
})

route.get('/dashboard/diagnosis', (req, res) => {
    if (req.session.username) {
        // console.log(req.session.username)
        res.render('patient/diagnosis', { user: req.session.username });

    }
    else {

        res.redirect('/user/login')
    }

})

route.get('/dashboard/treatment', (req, res) => {
    if (req.session.username) {
        let uname = req.session.username;
        // console.log(req.session.username)
        pool.query(`select * from reports where Username = ? `, [uname], (err, data) => {
            if (err)
                console.log(err)
            else {
                res.render('patient/treatment_dashboard', { user: req.session.username, info: data });

            }
        })


    }
    else {

        res.redirect('/user/login')
    }

})

route.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/user/login');

})


module.exports = route