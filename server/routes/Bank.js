function handleBankRoute(req,res){
    const connection = require('../../index');
    const { parse } = require('querystring');

    if(req.url === '/banks' && req.method === 'GET'){
        connection.query('SELECT * from ccs_banks',(err,rows)=>{
            if(!err){
                console.log('The data from ccs_banks table are: \n',rows)
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(rows));
            }
            else{
                console.log('Error executing users query',err);
            }
            res.end();
        })
    }
    else if(req.url === '/banks/add' && req.method === 'POST'){
        let body = '';
        req.on('data',chunk => {
            body += chunk.toString();
        })
        req.on('end',()=>{
            const newBank = parse(body);
            console.log(newBank);
            connection.query('INSERT INTO ccs_banks SET ?',newBank ,(err)=>{
                if(!err){
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Bank added successfully');
                }
                else{
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
                res.end();
            })
        })
    }else if (req.url.startsWith('/banks/edit') && req.method === 'GET') {
        const bankId = req.url.split('/').pop();
        connection.query('SELECT * FROM ccs_banks WHERE id = ?', [bankId], (error, results) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else if (results.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Bank not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results[0]));
            }
        });
    } else if (req.url.startsWith('/banks/update') && req.method === 'PUT') {
        const bankId = req.url.split('/').pop();
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const updatedBank = parse(body); 
            connection.query('UPDATE css_banks SET ? WHERE bank_id = ?', [updatedBank, bankId], (error) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Bank updated successfully');
                }
            });
        });
    } else if (req.url.startsWith('/banks/delete') && req.method === 'DELETE') {
        const bankId = req.url.split('/').pop();
        console.log("Bank id",bankId);
        connection.query('DELETE FROM ccs_banks WHERE bank_id = ?', [bankId], (error) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Bank deleted successfully');
            }l
        })}
    else{
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}

module.exports = {handleBankRoute};