const fs = require('node:fs');
const Path = require('node:path');
const Spawn = require('child_process').spawn;

const debounce = (fn, t=16)=>function(...args){clearTimeout(this.clk);this.clk=setTimeout(()=>fn(...args),t);};
const depWatch = require.resolve('./deps.js');

const getCallStack = ()=>{
	const _prepareStackTrace = Error.prepareStackTrace
	Error.prepareStackTrace = (_, stack) => stack;
	const stack = new Error().stack.slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
	return stack;
};
const resolveFromCaller = (fp, offset=0)=>{
	const callDir = Path.dirname(getCallStack()[2+offset].getFileName());
	return require.resolve(fp, {paths:[callDir]});
};

module.exports = (relPath, args=[], opts={})=>{
	const absPath = resolveFromCaller(relPath);
	let watchers = {}, subprocess, lastFileChanged = absPath;
	const addWatcher = (fp)=>{
		if(fp.indexOf('node_modules')!==-1) return;
		if(watchers[fp]) return;
		watchers[fp] = fs.watch(fp, ()=>{ lastFileChanged = fp; restart(); })
	};
	const restart = debounce(()=>{
		if(subprocess.channel){
			subprocess.send('exit');
			setTimeout(run, 200);
		}else{
			subprocess.kill();
			run();
		}
	}, 10);
	const run = async ()=>{
		console.clear();
		console.log(lastFileChanged.replace(process.cwd(), ''), '\n----------');
		subprocess = Spawn('node', [
			`--trace-uncaught`,
			`--require`, depWatch,
			absPath, ...args
		],{ stdio: ['ipc', process.stdout, process.stderr] });
		subprocess.on('message', (deps)=>{ deps.map(addWatcher) });
	};
	addWatcher(absPath);
	run();
};