const http = require('http');
const mysql = require('mysql');
const dotenv = require('dotenv');
const {handleHomeRoute} = require('./server/routes/Home');
const {handleUserRoute} = require('./server/routes/User');
const {handleBankRoute} = require('./server/routes/Bank');
const {handleAccountTypeRoute} = require('./server/routes/Account_type');
const {handleReportRoute} = require('./server/routes/Reports');

dotenv.config({path:'.env'})
const PORT = process.env.PORT || 8080
const HOST = process.env.HOST
const USER = process.env.USER
const DATABASE = process.env.DATABASE

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host:HOST,
    user:USER,
    database :DATABASE
})

// Connect to the database
connection.connect((err)=> {
    if(err){
        console.log("Error connecting to database:",err)
        return;
    }
    console.log('Connected to the database');
})

const server = http.createServer((req,res)=>{
    const pathname = req.url.split('/')[1];
    // console.log("Pathname",pathname);

    if(pathname === ''){
        handleHomeRoute(req,res);
       }
       else if(pathname === `users`){
        console.log("Pathname",pathname);
          handleUserRoute(req,res);
       }
       else if(pathname === 'banks'){
          handleBankRoute(req,res);
       }
       else if(pathname === 'accounts'){
          handleAccountTypeRoute(req,res);
       }
       else if(pathname === 'reports'){
        handleReportRoute(req,res);
       }
       else{
          res.writeHead(404,{'Content-Type':'text/plain'});
          res.write('404 Main Not Found');
          res.end();
       }
})

server.listen(PORT,()=>{
    console.log(`Example app listening on port ${PORT}`)
})

module.exports = connection;