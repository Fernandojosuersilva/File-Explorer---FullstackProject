const execSync = require('child_process').execSync;



const calculateSizeD = (itemFullStaticPath) => {
    //escape spaces, tabs, etc.
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g, '\ ');
    
    
    const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();
    
    console.log(commandOutput);
    
    //remove spaces, tabs, etc.
    let filesize = commandOutput.replace(/\s/g, ''); 
    
    
    //split silesize using the separatot '/'
    filesize = filesize.split('/');
    
    
    filesize = filesize[0];
    console.log(filesize);
    
    //unit 
    const filesizeUnit = filesize.replace(/\d|\./g, '');
    console.log(filesizeUnit);
    
    
    //size number
    
    const fileSizeNumber = parseFloat(filesize.replace(/[a-z]/i, ''));
    console.log(fileSizeNumber);
    
    const units = 'BKMGT';
    
    //B 10B -> 10 bytes (1000^0)
    //K 10K -> 10*1000 bytes (1000^1)
    //M 10M -> 10*1000*1000 bytes (1000^2)
    //G 10G -> 10*1000*1000*1000 bytes (1000^3)
    //T 10T -> 10*1000*1000*1000*1000 bytes (1000^4)
    
    
    const fileSizeBytes = fileSizeNumber * Math.pow(1000, units.indexOf(filesizeUnit));
    
    console.log(fileSizeBytes);
    
    
    return [filesize, 110*1000*1000];
}

module.exports = calculateSizeD;