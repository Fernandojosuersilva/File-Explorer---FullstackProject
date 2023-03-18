const execSync = require('child_process').execSync;

try{
    const result = execSync(`du -sh "/Users/user/desktop/estudos"`).toString();
    console.log(result);
}catch(err){
    console.log(`Error: ${err}`);
};