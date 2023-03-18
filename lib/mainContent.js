const fs = require('fs');
const path = require('path');

//require files

const calculateSizeD = require('./calculateSizeD.js');
const calculateSizeF = require('./calculateSizeF.js');

const buildMainContent = (fullStaticPath, pathname) => {
    let mainContent = '';
    let items;
    //loop through the elements insede the folder
    
    
    try{
        items = fs.readdirSync(fullStaticPath);
        console.log(items);
    }catch(err){
        console.log(`readdirSync Error: ${err}`);
        return `<div class="alert alert-danger">Internal server Error</div>`
    
    }
    //remove .DS_Store
    items = items.filter(element => element !== '.DS_Store');
    //home directory remove project_files
    if(pathname === '/'){
        items = items.filter(element => element !== 'project_files');
    }
    
    items.forEach(item => {
        
        //store item details in an object (save time)
        let itemDetails = {};
        
        //name
        
        itemDetails.name = item;
        
        //link
        const link = path.join(pathname, item);
        
        
        const itemFullStaticPath = path.join(fullStaticPath, item);
        
        try{
            itemDetails.stats = fs.statSync(itemFullStaticPath);
        }catch(err){
            console.log(`statSync Error: ${err}`);
            //optional
            mainContent = `<div class="alert alert-danger">Internal server error</div>`;
            return false;
        }
        
        if(itemDetails.stats.isDirectory()){
            
            itemDetails.icon = '<ion-icon name="folder"></ion-icon>';
            
            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeD(itemFullStaticPath);
            
        }else if (itemDetails.stats.isFile()){
            
            itemDetails.icon = '<ion-icon name="document"></ion-icon>';
            
            
            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeF(itemDetails.stats);
            
//            [itemSize, fileSizeBytes] = calculateSizeF();
        }
        //when was the file last change ? (unix timestamp)
        itemDetails.timeStamp = parseInt(itemDetails.stats.mtimeMs);
        
        //convert timestamp to a data
        itemDetails.date = new Date(itemDetails.timeStamp);
        
        itemDetails.date = itemDetails.date.toLocaleString();
        
        console.log(itemDetails.date);
        
            mainContent += `
<tr data-name="${itemDetails.name}" data-size="${itemDetails.sizeBytes}" data-time="${itemDetails.timeStamp}">
    <td>${itemDetails.icon}<a href="${link}" target='${itemDetails.stats.isFile() ? "_blank" : ""}'>${item}</a></td>
    <td>${itemDetails.size}</td>
    <td>${itemDetails.date}</td>
</tr>`;
    
    });
    
        
        
    //get the following elements for each item
        //name
        //icon
        //link
        //size
        //last modified

    return mainContent;
};




module.exports = buildMainContent;