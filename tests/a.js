//throw "test"


// console.log('HEY', process.cwd())
// console.log(require.resolve.paths('./b.js'))
let b = require('./b.js');

const fs = require('node:fs')

//b = 1;

console.log('args', process.argv);




let i = 0;
setInterval(()=>{
	console.log(i);
	i += b;
}, 500);

process.on('exit', function(code, signal) {
        console.log('exit with code %s and signal %s', code, signal);

        fs.writeFileSync('./yo.txt', (new Date()).toString(), 'utf8');
    });