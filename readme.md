#  picomon

> Lightweight node.js application restarter that only watches dependencies


I love [nodemon](https://www.npmjs.com/package/nodemon), but it only watched directories of files, and not dependencies. If you had an application that produced bundled files or logs, you had to write all these exclusion rules to stop it from restarting constantly. So I whipped up a quick `pico` version of it that only watches files `require` d by your application.

**Under 50 lines of code with no external dependencies**


##### CLI usage

```
λ picomon ./src/my_app.js --arg1=true -arg2
```

##### Script Usage

```js
const picomon = require('./libs/picomon.js');

picomon('./src/my_app.js', ['--arg1=true', '-arg2'])
```



### How It Works

Uses [Spawn](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) with IPC enabled to launch your app. It first loads a small script using Node's [require CLI flag](https://nodejs.org/api/cli.html#-r---require-module) which uses the IPC channel to communicate with the main `picomon` process. The script sends back the keys from the `require.cache` which are your app's dependencies, and `picomon` sets up watchers for them.

When any of these files change, `picomon` uses the IPC to send a message to gracefully shut down your script, before attempting to restart the process. Since it uses IPC instead of kill signals, this process is OS non-specific and reliable.