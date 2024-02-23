function handleAccountTypeRoute(req,res){
    const connection = require('../../index');
    const { parse } = require('querystring');

    if(req.url === '/accounts' && req.method === 'GET'){
        connection.query('SELECT * from ccs_account_type',(err,rows)=>{
            if(!err){
                console.log('The data from ccs_account_type table are: \n',rows)
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(rows));
            }
            else{
                console.log('Error executing users query',err);
            }
            res.end();
        })
    }
    else if(req.url === '/accounts/add' && req.method === 'POST'){
        let body = '';
        req.on('data',chunk => {
            body += chunk.toString();
        })
        req.on('end',()=>{
            const newAccount = parse(body);
            console.log(newAccount);
            connection.query('INSERT INTO ccs_account_type SET ?',newAccount ,(err)=>{
                if(!err){
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Account added successfully');
                }
                else{
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
                res.end();
            })
        })
    }else if (req.url.startsWith('/accounts/edit') && req.method === 'GET') {
        const accountId = req.url.split('/').pop();
        connection.query('SELECT * FROM ccs_account_type WHERE id = ?', [accountId], (error, results) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else if (results.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Account not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results[0]));
            }
        });
    } else if (req.url.startsWith('/accounts/update') && req.method === 'PUT') {
        const accountId = req.url.split('/').pop();
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const updatedAccount = parse(body); 
            connection.query('UPDATE css_account_type SET ? WHERE account_type_id = ?', [updatedAccount, accountId], (error) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Account updated successfully');
                }
            });
        });
    } else if (req.url.startsWith('/accounts/delete') && req.method === 'DELETE') {
        const accountId = req.url.split('/').pop();
        console.log("Account id",accountId);
        connection.query('DELETE FROM ccs_account_type WHERE account_type_id = ?', [accountId], (error) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Account deleted successfully');
            }
        })}
    else{
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}

module.exports = {handleAccountTypeRoute}