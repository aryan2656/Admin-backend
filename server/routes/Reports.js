function handleReportRoute(req,res){
    const connection = require('../../index');
    const { parse } = require('querystring');
    const headers = {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET,PUT,DELETE',
        'Access-Control-Allow-Headers':' Origin, Content-Type, application/json',
      };

    if(req.url === '/reports' && req.method === 'GET'){
        connection.query('SELECT * from ccs_reports',(err,rows)=>{
            if(!err){
                console.log('The data from ccs_reports table are: \n',rows)
                res.writeHead(200, headers);
                res.write(JSON.stringify(rows));
            }
            else{
                console.log('Error executing users query',err);
            }
            res.end();
        })
    }
    else if(req.url === '/reports/add' && req.method === 'POST'){
        let body = '';
        req.on('data',chunk => {
            body += chunk.toString();
        })
        req.on('end',()=>{
            const newUser = parse(body);
            console.log(newUser);
            connection.query('INSERT INTO ccs_reports SET ?',newUser ,(err)=>{
                if(!err){
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('User added successfully');
                }
                else{
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
                res.end();
            })
        })
    }else if (req.url.startsWith('/reports/edit') && req.method === 'GET') {
        const reportId = pathname.split('/').pop();
        connection.query('SELECT * FROM ccs_reports WHERE report_id = ?', [reportId], (error, results) => {
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
    } else if (req.url.startsWith('/reports/update') && req.method === 'PUT') {
        const reportId = pathname.split('/').pop();
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const updatedReport = parse(body); 
            connection.query('UPDATE css_reports SET ? WHERE report_id = ?', [updatedReport, reportId], (error) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('User updated successfully');
                }
            });
        });
    } else if (req.url.startsWith('/reports/delete') && req.method === 'DELETE') {
        const reportId = pathname.split('/').pop();
        console.log("Report id",reportId);
        connection.query('DELETE FROM ccs_reports WHERE report_id = ?', [reportId], (error) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Report deleted successfully');
            }
        })}
     else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Report Endpoint Not Found');
          }
}

module.exports = {handleReportRoute};