function handleHomeRoute(req,res){
    const connection = require('../../index');
    const { parse } = require('querystring');

    if(req.url === '/' && req.method === 'GET'){
        res.writeHead(200,{'Content-Type':'application/json'});
        res.write("Coming soon...")
        res.end();
     }
     else{
        res.writeHead(404,{'Content-Type':'text/plain'})
        res.write('404 Not Found');
        res.end();
     }
}

module.exports = {handleHomeRoute};
