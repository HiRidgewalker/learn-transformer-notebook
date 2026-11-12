import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
const root=process.cwd();
const ext=process.platform==='win32'?'.cmd':'';
const bin=(name)=>path.join(root,'node_modules','.bin',name+ext);
for(const name of ['tsc','vite'])if(!fs.existsSync(bin(name))){console.error(`Missing ${name}. Run npm install first.`);process.exit(1);}
const compiler=spawn(bin('tsc'),['-p','tsconfig.json','--watch','--preserveWatchOutput'],{stdio:'inherit',shell:process.platform==='win32'});
const server=spawn(bin('vite'),['--host','0.0.0.0'],{stdio:'inherit',shell:process.platform==='win32'});
function stop(){compiler.kill();server.kill();process.exit();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
server.on('exit',(code)=>{compiler.kill();process.exit(code||0)});
