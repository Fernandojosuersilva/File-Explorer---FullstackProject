const url = require('url');
const path = require('path');


const port = 3000;

//console.log(__dirname);
const staticPath = path.join(__dirname, '..', 'static');
console.log(staticPath);


const respond = (request, response) => {

    //decode the pathname before working with pathname
    let pathname = url.parse(request.url, true).pathname;
    
    console.log(pathname);
    
    
    
    
    
    
    
    
    
}
