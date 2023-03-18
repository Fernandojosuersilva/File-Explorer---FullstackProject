const execSync = require('child_process').execSync;



const calculateSizeF = (stats) => {
    //size in bytes
    const filesizeBytes = stats.size; //bytes
    
    //size in human readable format
///bytes
const units = "BKMGT";

const index = Math.floor(Math.log10(filesizeBytes)/3);

const filesizehuman = (filesizeBytes/Math.pow(1000, index)).toFixed(1);

const unit = units[index];

filesize = `${filesizehuman}${unit}`;
    
    return [filesize, filesizeBytes];
}

module.exports = calculateSizeF;