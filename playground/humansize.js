console.log(Math.log10(1000)); //10^3
console.log(Math.log10(10000)); //10^4


const filesize = 1452603; ///bytes
const units = "BKMGT";


//.....1000.......10000000.......1000000000
//log10
//....3.........6...............9........
//log10(filesize)/3
//0.....1 ...........2...........3........



const index = Math.floor(Math.log10(filesize)/3);

//700B -> 700/1000^0
//10000 -> 10000/1000^1 bytes
//10000000 -> 10000/1000^2 bytes
const filesizehuman = (filesize/Math.pow(1000, index).toFixed(1));



console.log(`${filesizehuman}${units[index]}`);