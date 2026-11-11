import {spawnSync} from "node:child_process";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
for(const [folder,args] of [
 ["backend",["node_modules/typescript/bin/tsc"]],
 ["frontend",["node_modules/typescript/bin/tsc","-b"]],
 ["frontend",["node_modules/vite/bin/vite.js","build"]]
]) {
 const result=spawnSync(process.execPath,args,{cwd:path.join(root,folder),stdio:"inherit",
 env:{...process.env,VITE_SERVER_URL:"",VITE_HOSTED:"1",VITE_TESTING_SITE:process.env.TESTING_ENVIRONMENT==="1"?"1":""}});
 if(result.status!==0)process.exit(result.status||1);
}

// Database changes are a separate, operator-approved release step. Preview builds must never mutate production.
// A one-time opt-in is available only for the newly provisioned, empty testing database.
if(process.env.TESTING_PROVISION_ONCE === "1") {
 const init=spawnSync(process.execPath,["--import","tsx","deploy/provision-testing.ts"],{
  cwd:path.join(root,"backend"),stdio:"inherit",env:process.env
 });
 if(init.status!==0)process.exit(init.status||1);
}
