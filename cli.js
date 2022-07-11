#!/usr/bin/env node

const picomon = require('./');

let hitTarget = false;
const {opts, target, args} = process.argv.slice(2).reduce((acc, part)=>{
	if(part.startsWith('-')){
		if(hitTarget){
			acc.args.push(part);
		}else{
			const [_, key,__,val] = /--?(\w+)(=(\w+))?/.exec(part) || [];
			acc.opts[key] = val||true;
		}
	}else{
		acc.target = part;
		hitTarget = true;
	}
	return acc;
}, {opts: {}, target:'./index.js', args : [] });

picomon(require.resolve(target, {paths:[process.cwd()]}), args, opts);