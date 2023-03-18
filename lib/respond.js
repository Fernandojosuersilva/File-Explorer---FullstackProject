//require node modules
const url = require('url');
const path = require('path');
const fs = require('fs');



//file imports
const buildBreadcrumb = require('./breadcrumb.js');
const buildMainContent = require('./mainContent.js');
const getMimeType = require('./getMimeType.js');

//static base path: location of the static folder
const staticBasePath = path.join(__dirname, '..', 'static');


//respond to a request
//function to be passed to createServer used to create the server on app.js file
const respond = (request, response) => {
    
    //b4 working with pathname, we need to decode it
    
    let pathname = url.parse(request.url, true).pathname;
    

    //if favicon.ico stop
    if(pathname === '/favicon.ico'){
        return false;
    }
    
    pathname = decodeURIComponent(pathname);
    
    //get the corresponding full static path located in the static folder
    
    const fullStaticPath = path.join(staticBasePath, pathname);
    
    //can we find something in fullStaticPath?
    
    //no: send '404': File not found!
    
    if(!fs.existsSync(fullStaticPath)){
        console.log(`${fullStaticPath} does not exist`);
        response.write('404: File not found!');
        response.end();
        return false;
    }
        
    
        // We found something 
        //is it a directory or a file?
    let stats;
    try{
        stats = fs.lstatSync(fullStaticPath);
    }catch(err){
        console.log(`lstatSync Error: ${err}`);
    }
    
    
    //it is a directory
    if(stats.isDirectory()){
        
        let data = fs.readFileSync(path.join(staticBasePath, 'project_files/index.html'), 'utf-8');
        
        //build page title
        console.log(pathname);
        let pathElements = pathname.split('/').reverse();
        console.log(pathElements);
        
        pathElements = pathElements.filter(element => element !== '');
        
        let folderName = pathElements[0];
        if(folderName === undefined){
            folderName = 'Home';
        }
//        console.log(folderName);

        
        
        //build breadcrumb
        const breadcrumb = buildBreadcrumb(pathname);
        
        
        
        //build table rows
        const mainContent = buildMainContent(fullStaticPath, pathname);
        
        
        
        
        
        
        
        
        data = data.replace('Home_page', folderName);
        data = data.replace('pathname', breadcrumb);
        data = data.replace('mainContent', mainContent);
        // print data to the web page
        response.statusCode = 200;
        response.write(data);
        return response.end();
    }
    

            
    
    
    
    //its not either a file or a folder
        ////send 401:Access Denied!
    if(!stats.isFile()){
        response.statusCode = 401;
        response.write(`404: access denied!`);
        console.log('not a file!');
        return response.end();
    }
    
    //it is a file
        //get the file extension
    let fileDetails = {};
    
    fileDetails.extname = path.extname(fullStaticPath);
    console.log(fileDetails.extname);
    
    //file size
       let stat;
            try{
               stat = fs.statSync(fullStaticPath);
               
            }catch(err){
                console.log(`err: ${err}`);
            }
    fileDetails.size = stat.size;
    
        //get the file MIME type and add it to the response header
    
    getMimeType(fileDetails.extname).then(mime =>{
        //store headers here
        let head = {};
        let options = {};
        //responde status code
        let statusCode = 200;
        
        
        //set content-type for all file types
       head['Content-Type'] = mime; 
    
        if(fileDetails.extname === '.pdf'){
            head['Content-Disposition'] = 'inline';
//            head['Content-Disposition'] = 'attachment;filename=ComputerScienceBook.pdf'; 
            //for download
        }
        //audio/video files -> stream in ranges
        if(RegExp('audio').test(mime) || RegExp('video').test(mime)){
            //header
            head['Accept-Ranges'] = 'bytes';
            
            const range = request.headers.range;
            console.log(`range: ${range}`);
            if(range){
                
                const start_end = range.replace(/bytes=/, '').split('-');
                const start = parseInt(start_end[0]);
                const end = start_end[1] ? parseInt(start_end[1]) : fileDetails.size -1;
         
            
            head['Content-Range'] = `bytes ${start} - ${end}/${fileDetails.size}`;
            //Content-lenght
            head['Content-Lenght'] = end - start + 1;
            
            
                
                statusCode = 206;
                
                options = {start, end};
            }
            
            
            //headers
//            Content-range

        }
        
        
        
//        fs.promises.readFile(fullStaticPath, 'utf-8')
//        .then((error,data) => {
//
//               response.writeHead(statusCode, head);
//               response.write(data);
//               return response.end();               
//    })
//        .catc(error => {
//            console.log(error);
//            response.statusCode = 404;
//            response.write(`404: File reading error!`);
//            return response.end();
//        });
        const fileStream = fs.createReadStream(fullStaticPath, options);
        response.writeHead(statusCode, head);
        fileStream.pipe(response);
        
        //events
        fileStream.on('close', () =>{
            return response.end();
        });
        fileStream.on('error', error =>{
            console.log(error.code);
            response.statusCode = 404;
            response.write(`404: File stream error!`);
            return response.end();
        });
    })
        
    .catch(err => {
        response.statusCode = 500;
        response.write(`500: internal server error!`);
        console.log(`Promisse error: ${err}`);
        return response.end();
    })
        //pdf ? -> display in browser so the user dont have to download it
        //audio/video ? -> stream in ranges (only send chunks of the video/audio so the usr do not have to download in full which optmize performance)
        //all other files strem in a normal way
    

}
//export respond function from app.js
module.exports = respond;