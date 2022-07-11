process.on('message', ()=>{ process.exit(); });
setTimeout(()=>process.send(Object.keys(require.cache)), 100);