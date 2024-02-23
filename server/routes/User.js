function handleUserRoute(req,res){
    const connection = require('../../index');
    const { parse } = require('querystring');
    const headers = {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET,PUT,DELETE',
        'Access-Control-Allow-Headers':' Origin, Content-Type, application/json,text/plain,application/x-www-form-urlencoded',
      };

      
    if (req.method === 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
        return;
    }

    if(req.url === '/users' && req.method === 'GET'){
        connection.query('SELECT * from ccs_users',(err,rows)=>{
            if(!err){
                // const responseData = {
                //     data: {
                //         content: rows,
                //         response: 'success'
                //     }
                // };
                console.log('The data from ccs_users table are: \n',rows)
                res.writeHead( 200, headers);
                res.write(JSON.stringify(rows));
            }
            else{
                const errorResponse = {
                    data: {
                        content: err,
                        response: 'error'
                    }
                };
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(errorResponse));
            }
            res.end();
        })
    }
    else if(req.url === '/users/add' && req.method === 'POST'){
        // res.writeHead(200,headers);
        //     res.end('aryan');
        let body = '';
        req.on('data',chunk => {
            body += chunk.toString();
        })
        req.on('end',()=>{
            const newUser = parse(body);
            console.log('Received data:',newUser);
            res.writeHead(200,headers);
            res.end('aryan');
            // connection.query('INSERT INTO ccs_users SET ?',newUser ,(err)=>{
            //     if(!err){
            //         res.writeHead(200,headers);
            //         res.end('User added successfully');
            //     }
            //     else{
            //         res.writeHead(500, headers);
            //         res.end('Internal Server Error');
            //     }
            //     res.end();
            // })
        })      
    }else if (req.url.startsWith('/users/edit') && req.method === 'GET') {
        const userId = pathname.split('/').pop();
        connection.query('SELECT * FROM ccs_users WHERE id = ?', [userId], (error, results) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else if (results.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results[0]));
            }
        });
    } else if (req.url.startsWith('/users/update') && req.method === 'PUT') {
        const userId = pathname.split('/').pop();
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const updatedUser = parse(body); 
            connection.query('UPDATE css_users SET ? WHERE user_id = ?', [updatedUser, userId], (error) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('User updated successfully');
                }
            });
        });
    } else if (req.url.startsWith('/users/delete') && req.method === 'DELETE') {
        const userId = pathname.split('/').pop();
        console.log("User id",userId);
        connection.query('DELETE FROM ccs_users WHERE user_id = ?', [userId], (error) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('User deleted successfully');
            }
        })}
     else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 User Endpoint Not Found');
          }
}

module.exports = {handleUserRoute};