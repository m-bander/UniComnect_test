import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const node=process.execPath;
const children=new Set();
let stopping=false;
function stop(){
 if(stopping)return;stopping=true;
 for(const child of children){
   if(child.exitCode!==null)continue;
   if(process.platform==="win32")spawnSync("taskkill",["/pid",String(child.pid),"/t","/f"],{stdio:"ignore",windowsHide:true});
   else child.kill("SIGTERM");
 }
}
process.on("SIGINT",()=>{stop();process.exit(130)});
process.on("SIGTERM",()=>{stop();process.exit(143)});
function run(args,folder=root){
 return new Promise((resolve,reject)=>{
   const child=spawn(node,args,{cwd:folder,stdio:"inherit",env:process.env});
   children.add(child);
   child.once("error",reject);
   child.once("exit",(code,signal)=>{children.delete(child);code===0?resolve():reject(new Error("Command exited "+(code??signal)+": node "+args.join(" ")))});
 });
}
const backend=path.join(root,"backend"),frontend=path.join(root,"frontend");
const playwright=path.join(backend,"node_modules/@playwright/test/cli.js");
const pnpm=path.join(root,"node_modules/pnpm/bin/pnpm.cjs");
const command=process.argv[2];
try{
 switch(command){
 case "install":
 case "setup":
   if(Number(process.versions.node.split(".")[0])<24)throw new Error("Use Node.js 24 or newer.");
   if(!fs.existsSync(pnpm))throw new Error("Run npm install in the repository root first.");
   await run([pnpm,"install","--frozen-lockfile","--ignore-scripts"],backend);
   await run([pnpm,"install","--frozen-lockfile","--ignore-scripts"],frontend);
   if(command==="setup" && !fs.existsSync(path.join(frontend,".env.local")))fs.copyFileSync(path.join(frontend,".env.example"),path.join(frontend,".env.local"));
   if(command==="setup") await run([playwright,"install","chromium"],backend);
   console.log("\nSetup complete. Run npm run dev to open the app, or npm test to run the full suite.");
   break;
 case "dev":
   await Promise.all([run(["--import","tsx","qa/start.ts"],backend),run(["node_modules/vite/bin/vite.js","--host","localhost","--port","5173","--strictPort"],frontend)]);
   break;
 case "public":await run(["qa/public-smoke.cjs","https://unicomnect-test.vercel.app"],backend);break;
 case "test":await run([playwright,"test"],backend);break;
 case "smoke":await run([playwright,"test","functional.spec.ts","browser.spec.ts"],backend);break;
 case "report":await run([playwright,"show-report","qa/artifacts/html"],backend);break;
 case "build":
   await run(["node_modules/typescript/bin/tsc"],backend);
   await run(["node_modules/typescript/bin/tsc","-b"],frontend);
   await run(["node_modules/vite/bin/vite.js","build"],frontend);
   break;
 default:throw new Error("Use setup, dev, test, smoke, report or build.");
 }
}catch(error){console.error(error.message);stop();process.exitCode=1}
