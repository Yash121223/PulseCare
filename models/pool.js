const mysql=require('mysql');
const pool=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"pulse",
    port:3310
})

pool.connect((err)=>{
    if(err)
    throw err
    else
    console.log('database connected');
})

module.exports=pool;
